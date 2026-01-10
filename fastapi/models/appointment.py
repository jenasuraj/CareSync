# app/models/doctor.py
from util.database import Base
from sqlalchemy import Column, Integer, Date, ForeignKey, String

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    d_id = Column(Integer,  index=True)
    p_id = Column(Integer, index=True)
    date = Column(Date, index=True)

