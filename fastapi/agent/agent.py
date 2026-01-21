from langgraph.graph import StateGraph, START, END
from dotenv import load_dotenv
from langgraph.checkpoint.memory import InMemorySaver
from typing_extensions import TypedDict
from typing import Annotated
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage
from langgraph.prebuilt import create_react_agent
import os
from agent.tools import book_appointment,rag_lookup,track_health,show_doctors,save_health_data
from agent.prompts import main_prompt


checkpointer = InMemorySaver()
load_dotenv()


class State(TypedDict):
    messages: Annotated[list, add_messages]

llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    openai_api_key=os.getenv("OPENROUTER_API_KEY"),
    openai_api_base="https://openrouter.ai/api/v1",)




def node1(state:State):
    prompt = main_prompt
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