# app/crud/appointment.py
from sqlalchemy.orm import Session
from models.health_data import HealthData
from datetime import date

def health_data_submit(db: Session,p_id,calorieburnt,caloriegained,exercise_time):
    card = HealthData(
     date = date.today(),
     p_id = p_id,
     calorieburnt = calorieburnt,
     caloriegained = caloriegained,
     exercise = exercise_time
    )

    db.add(card)      # stage INSERT
    db.commit()              # execute INSERT
    db.refresh(card)  # fetch generated id

    return card