# app/crud/appointment.py
from sqlalchemy.orm import Session
from models.appointment import Appointment

def create_appointment(db: Session, date, d_id, p_id):
    appointment = Appointment(
        d_id=d_id,
        p_id=p_id,
        date=date
    )

    db.add(appointment)      # stage INSERT
    db.commit()              # execute INSERT
    db.refresh(appointment)  # fetch generated id

    return appointment
