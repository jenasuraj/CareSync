# app/crud/doctor.py
from sqlalchemy.orm import Session
from models.health_data import HealthData

def get_health_report(db: Session,p_id):
    result = db.query(HealthData)\
               .filter(HealthData.p_id ==
                p_id)\
               .all()
    if len(result) == 0:
        return "No prior information for that particular patient till now !"
    parsed_result = [
    {
        "id": row.id,
        "date": row.date,
        "p_id": row.p_id,
        "calorieburnt": row.calorieburnt,
        "caloriegained": row.caloriegained,
        "exercise": row.exercise
    }
    for row in result
    ]
    return parsed_result 
