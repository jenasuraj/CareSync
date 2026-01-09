from langgraph.graph import StateGraph, START, END
from dotenv import load_dotenv
load_dotenv()
from langgraph.checkpoint.memory import InMemorySaver
checkpointer = InMemorySaver()
from typing_extensions import TypedDict
from typing import Annotated
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
import os
from langchain_core.messages import HumanMessage,AIMessage
from langchain.prompts import PromptTemplate


class State(TypedDict):
    messages: Annotated[list, add_messages]
    valid: str

llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    openai_api_key=os.getenv("OPENROUTER_API_KEY"),
    openai_api_base="https://openrouter.ai/api/v1",
)

def node1(state:State):
    promptt = """ Task: You are a medical ai assitant, respond gently,
    message: {messages}
    """
    prompt = PromptTemplate.from_template(promptt)
    chain = prompt | llm
    messages = state["messages"]
    response = chain.invoke({"messages": messages})
    return{
        "messages":state["messages"]+[AIMessage(content=response.content)]
    }


graph_builder = StateGraph(State)
graph_builder.add_node("node1",node1)
graph_builder.add_edge(START,"node1")
graph_builder.add_edge("node1",END)
graph = graph_builder.compile(checkpointer=checkpointer)