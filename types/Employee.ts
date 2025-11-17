export interface Employee {
  id: number;
  name: string;
  phone: string;
  email: string;
  department: string;
  experience: string;
  image: string;
  status:string;
}


export interface doctorProperty{
  department:string,
  experience:number,
  id:number,
  image:string,
  name:string,
  total_appointments:string
}


export interface appointmentFormdata{
    name: string,
    phone: string,
    address: string,
    doctorId: number,
}
