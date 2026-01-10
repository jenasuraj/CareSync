from fastapi import APIRouter
from schemas.user import QueryRequest
router = APIRouter()
from agent.agent import graph


@router.get("/")
def read_root():
    return {"message": "FastAPI server is running 🚀"}

@router.post("/")
def ask_query(data: QueryRequest):
    print("Received query:", data.query)
    result =  graph.invoke(
    {"messages": [{"role": "user", "content": f"query is: {data.query} & patient_id is: {data.patient_id}"}]},
    {"configurable": {"thread_id": "1"}},
    )
    final_data = result["messages"][-1].content
    return {
        "message": final_data,
        "query": data.query
    }