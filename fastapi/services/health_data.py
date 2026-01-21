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

    today = date.today()
    result = db.query(HealthData)\
               .filter(HealthData.date ==
                today)\
               .all()
    
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
    print("result is",parsed_result) 


    if(len(result) == 0): #first insertion to be made in db
        db.add(card)      # stage INSERT
        db.commit()              # execute INSERT
        db.refresh(card)  # fetch generated id
        return card
    else: #for updation and insert rest!
            db.query(HealthData)\
            .filter(HealthData.date == today)\
            .update({
                HealthData.calorieburnt: calorieburnt if calorieburnt else parsed_result[0]["calorieburnt"],
                HealthData.caloriegained: caloriegained if caloriegained else parsed_result[0]["caloriegained"],
                HealthData.exercise: exercise_time if exercise_time else parsed_result[0]["exercise"]
            })
            db.commit()