# app/crud/doctor.py
from sqlalchemy.orm import Session
from models.doctor import Doctor

def get_all_doctors(db: Session):
    return db.query(Doctor).all()
