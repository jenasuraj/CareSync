from langgraph.graph import StateGraph, START, END
from dotenv import load_dotenv
from langgraph.checkpoint.memory import InMemorySaver
from typing_extensions import TypedDict
from typing import Annotated
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage
from langgraph.prebuilt import create_react_agent
from langchain.tools import tool
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from util.database import get_db
from services.doctor import get_all_doctors
from schemas.doctor import DoctorResponse
from services.appointment import create_appointment
from services.health_data import health_data_submit
import os
checkpointer = InMemorySaver()
load_dotenv()



BASE_DIR = os.path.dirname(os.path.abspath(__file__))
rag_path = os.path.join(BASE_DIR, "agent.txt")
loader = TextLoader(
    file_path=rag_path,
    encoding="utf-8")

docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # large enough to hold table logic + rules
    chunk_overlap=200,      # preserves reasoning continuity
    add_start_index=True    # helps trace hallucinations later
)

chunks = text_splitter.split_documents(docs)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
vector_store = InMemoryVectorStore(embeddings)
ids = vector_store.add_documents(documents=chunks)
print("data added to v-db")
retriever = vector_store.as_retriever(search_kwargs={"k": 5})


class State(TypedDict):
    messages: Annotated[list, add_messages]

llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    openai_api_key=os.getenv("OPENROUTER_API_KEY"),
    openai_api_base="https://openrouter.ai/api/v1",)


@tool
def book_appointment(date, doc_id, p_id):
    """use this tool to book appointment for user.. in order to use this tool, provide selected date by user, doctor_id and patient_id"""
    print("Appointment booking tool called", date, doc_id, p_id)
    db = next(get_db())
    try:
        appointment = create_appointment(
            db=db,
            date=date,
            d_id=doc_id,
            p_id=p_id
        )
        print("response is",appointment)
        return { "message": "Appointment booked successfully"}
    finally:
        db.close()


@tool
def save_health_data(p_id,calorieburnt,caloriegained,exercise_time):
    """use this tool to track/add user's fitness data (for ex: calorie taken,calorieburnt ,exercise time)"""
    print("save_health_data tool was called",p_id,calorieburnt,caloriegained,exercise_time)
    db = next(get_db())
    try:
        card = health_data_submit(
            db=db,
            p_id=p_id,
            caloriegained=caloriegained,
            calorieburnt=caloriegained,
            exercise_time=exercise_time
        )
        print("response is",card)
        return { "message": "health data saved successfully"}
    finally:
        db.close()


@tool
def track_health(p_id):
    """use this tool to track users health"""
    print("track_health tool was called",)
    return "users health updated and is being tracked"


@tool
def rag_lookup(query: str):
    """
    Use this tool to understand database structure, tables, columns,
    and rules before booking appointments or tracking health.
    """
    print("rag tool was called",query)
    docs = retriever.invoke(query)
    return "\n\n".join([doc.page_content for doc in docs])


@tool
def show_doctors():
    """Use this tool to find available doctors for booking an appointment"""
    print("show_doctors tool was called")
    # manually manage DB session (tool layer)
    db = next(get_db())
    try:
        doctors = get_all_doctors(db)
        response = [
            DoctorResponse.model_validate(doc).model_dump()
            for doc in doctors
        ]
        return response
    finally:
        db.close()



def node1(state:State):
    prompt = """
        -------------------------------
        INTRODUCTION
        -------------------------------
        You are CareSync AI, a careful highly sequential, intelligent and rule-driven medical assistant.
        Your job is to assist patients in:
        1 - Booking medical appointments.
        2 - Tracking and saving user's health data.
        You must behave conservatively and NEVER assume missing information all by your own.

        -------------------------------
        CRITICAL BEHAVIOR RULES
        -------------------------------
        1 - NEVER book an appointment unless ALL required information is explicitly provided by the user.
        2 - NEVER invent or guess a date.
        3 - ALWAYS ask follow-up questions if required data is missing.
        4 - Analyse user's intention and if the intension meets calling tools, then you should call otherwise dont explicitely call tools.
        5 - You can call one tool to get information and use that information in other tool as input . Ex: you can call 'show_doctors' tool and take doctor's id and use that id in 'book_appointments' tool.
        6 - If user provides any of the following (calories taken, calories burnt or total duration of exercise) of that particular day only, then you have to use 'save_health_data' tool to submit data so that you can track users health. 
        7 - Until the user explicitly mentions appointment booking or health tracking or statements that involves booking appointment or tracking past health data or providing per day health data, stay in a neutral conversation mode.
        8 - In neutral mode:
            - DO NOT call any tools.
            - DO NOT ask for medical, appointment, or health-related data.
            - DO NOT describe capabilities.
            - Respond briefly and conversationally.
        9 - Only transition out of neutral mode when the user clearly states intent related to:
            - booking an appointment
            - tracking health data

        -------------------------------
        APPOINTMENT BOOKING RULES
        -------------------------------
        To book an appointment, you MUST have:
        1 - A selected doctor (chosen by the user)
        2 - A selected appointment date (explicitly given by the user)
        3 - Patient confirmation they want to book

        -------------------------------
        TOOLS AVAILABLE
        -------------------------------
        1 - rag_lookup: Understand database structure and rules
        2 - show_doctors: Use this tool to fetch doctors information for ex: (id,name,experience,status etc..). Basically you need to call this tool to fetch doctors name so that user can select a doctor and later during booking time, you can call this tool to retrive the id of the particular doctor so that you can pass patient_id,doctor_id and date to 'book_appointment' tool.
        3 - book_appointment: Book appointment (ONLY after confirmation). In order to book appointment using this tool, you have to provide doctors id, patients id and date. so provide necessary information and you can call 'show_doctors' tool to fetch doctors id. Always pass date as (year-month-date) format for ex: 2026-10-10.
        4 - track_health: use this tool to fetch past health data and provide a health report.
        5 - save_health_data: use this tool to save users daily health routine data (calories taken, calories burnt or total duration of exercise)

        
        -------------------------------
        OUTPUT FORMAT
        -------------------------------
        Always return the final response in HTML format using only h2,p,bullet list elements.

        -------------------------------
        CONVERSATION SO FAR
        -------------------------------
        {messages}
        """
    agent = create_react_agent(model=llm,tools=[book_appointment,rag_lookup,track_health,show_doctors,save_health_data],prompt=prompt)
    response = agent.invoke({"messages": state["messages"]})
    return{
        "messages":state["messages"]+[AIMessage(content=response["messages"][-1].content)]
    }


graph_builder = StateGraph(State)
graph_builder.add_node("node1",node1)
graph_builder.add_edge(START,"node1")
graph_builder.add_edge("node1",END)
graph = graph_builder.compile(checkpointer=checkpointer)