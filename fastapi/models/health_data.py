# app/models/doctor.py
from util.database import Base
from sqlalchemy import Column, Integer, Date, ForeignKey, String

class HealthData(Base):
    __tablename__ = "card"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    p_id = Column(Integer, index=True)
    calorieburnt = Column(String, index = True)
    caloriegained = Column(String,index = True)
    exercise = Column(String,index = True)

