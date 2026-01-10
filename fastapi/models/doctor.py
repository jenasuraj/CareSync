# app/models/doctor.py
from sqlalchemy import Column, Integer, String
from util.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    status = Column(String, nullable=False)
    experience = Column(Integer)
