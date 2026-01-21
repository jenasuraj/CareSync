from langchain.tools import tool
from util.database import get_db
from services.doctor import get_all_doctors
from schemas.doctor import DoctorResponse
from services.appointment import create_appointment
from services.health_data import health_data_submit
from agent.rag import retriever

@tool
def book_appointment(date, doc_id, p_id):
    """use this tool to book appointment for user.. in order to use this tool, provide selected date by user, doctor_id and patient_id"""
    print("Appointment booking tool called", date, doc_id, p_id)
    db = next(get_db())
    try:
        appointment = create_appointment(
            db=db,
            date=date,
            d_id=doc_id,
            p_id=p_id
        )
        print("response is",appointment)
        return { "message": "Appointment booked successfully"}
    finally:
        db.close()


@tool
def save_health_data(p_id,calorieburnt,caloriegained,exercise_time):
    """use this tool to track/add user's fitness data (for ex: calorie taken,calorieburnt ,exercise time)"""
    print("save_health_data tool was called",p_id,calorieburnt,caloriegained,exercise_time)
    db = next(get_db())
    try:
        card = health_data_submit(
            db=db,
            p_id=p_id,
            caloriegained=caloriegained,
            calorieburnt=calorieburnt,
            exercise_time=exercise_time
        )
        print("response is",card)
        return { "message": "health data saved successfully"}
    finally:
        db.close()


@tool
def track_health(p_id):
    """use this tool to track users health"""
    print("track_health tool was called",)
    return "users health updated and is being tracked"


@tool
def rag_lookup(query: str):
    """
    Use this tool to understand database structure, tables, columns,
    and rules before booking appointments or tracking health.
    """
    print("rag tool was called",query)
    docs = retriever.invoke(query)
    return "\n\n".join([doc.page_content for doc in docs])


@tool
def show_doctors():
    """Use this tool to find available doctors for booking an appointment"""
    print("show_doctors tool was called")
    # manually manage DB session (tool layer)
    db = next(get_db())
    try:
        doctors = get_all_doctors(db)
        response = [
            DoctorResponse.model_validate(doc).model_dump()
            for doc in doctors
        ]
        return response
    finally:
        db.close()
