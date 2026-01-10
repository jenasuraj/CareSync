from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str
    patient_id:int