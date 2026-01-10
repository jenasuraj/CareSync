from pydantic import BaseModel

class AppointmentResponse(BaseModel):
    id:int
    d_id: int
    p_id: int
    date:str

    class Config:
        from_attributes = True
