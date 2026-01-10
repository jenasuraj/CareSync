from pydantic import BaseModel

class DoctorResponse(BaseModel):
    id: int
    name: str
    department: str
    status: str
    experience: int

    class Config:
        from_attributes = True
