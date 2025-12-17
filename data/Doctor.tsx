import adil from "@/public/azam.jpg";
import baishnabi from "@/public/diya.jpg";
import suraj from "@/public/gyan.jpg";
import ayushi from "@/public/martina.jpg";
import preet from "@/public/preet.jpg";
import sujit from "@/public/rahul.jpg";
import umanorth from "@/public/umanorth.jpg";
import willina from "@/public/willina.jpg";
import { SlHome } from "react-icons/sl";
import { GoChevronRight } from "react-icons/go";
import { MdOutlineLocalHospital } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";
import { FaMobileAlt } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { LuPanelLeftClose } from "react-icons/lu";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { RxPerson } from "react-icons/rx";
import { TbHealthRecognition } from "react-icons/tb";
import { MdOutlineMessage } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { GoHistory } from "react-icons/go";
import { FaUserDoctor } from "react-icons/fa6";
import { RiNurseLine } from "react-icons/ri";
import { MdOutlineLocalPharmacy } from "react-icons/md";
import { BsMotherboard } from "react-icons/bs";


export const doctors = [
  {
    img: adil,
    name: "Dr. Suraj jena",
    genre: "Cardiologist",
    experience: "10 Years",
  },
  {
    img: baishnabi,
    name: "Dr. Baishnabi",
    genre: "Pediatrician",
    experience: "7 Years",
  },
  {
    img: suraj,
    name: "Dr. Sujit ",
    genre: "Orthopedic Surgeon",
    experience: "9 Years",
  },
  {
    img: ayushi,
    name: "Dr. Ayushi ",
    genre: "Dermatologist",
    experience: "6 Years",
  },
  {
    img: preet,
    name: "Dr. Preet Sharma",
    genre: "Neurologist",
    experience: "12 Years",
  },
  {
    img: sujit,
    name: "Dr. Sujit",
    genre: "General Physician",
    experience: "8 Years",
  },
  {
    img: umanorth,
    name: "Dr. Uma North",
    genre: "Gynecologist",
    experience: "11 Years",
  },
  {
    img: willina,
    name: "Dr. Willina Grace",
    genre: "Psychiatrist",
    experience: "10 Years",
  },
];



export const dashboard_items = [
  {
    id: 1,
    name: "Dashboard",
    icon:<SlHome size={20}/>,
    back:<GoChevronRight size={20}/>,
    genre:'admin',
    path:'/'
  },
  {
    id: 2,
    name: "Employees",
    icon:<MdOutlineLocalHospital size={20}/>,
    back:<GoChevronRight size={20}/>,
    genre:'admin',
    path:'/employees'
  },
  {
    id: 3,
    name: "Add On",
    icon:<FaPerson  size={20}/>,
    back:<GoChevronRight size={20}/>,
    genre:'admin',
    path:'/patients'
  },
    {
    id: 4,
    name: "Profile",
    icon:<RxPerson  size={20}/>,
    back:<GoChevronRight size={20}/>,
    genre:'admin',
    path:'/profile'
  },
  {
    id: 8,
    name: "Dashboard",
    icon:<SlHome size={20}/>,
    back:<GoChevronRight size={20}/>,
    genre:'patient',
    path:'/'
  },
    {
    id: 9,
    name: "Appointment",
    icon:<FaMobileAlt  size={20}/>,
    back:<GoChevronRight size={20}/>,
    genre:'patient',
    path:'/appointment'
  },
  {
    id: 10,
    name: "History",
    icon:<GoHistory size={20}/>,
    back:<GoChevronRight size={20}/>,
    genre:'patient',
    path:'/history'
  },
  {
    id: 11,
    name: "Health Track",
    icon:<TbHealthRecognition size={20}/>,
    back:<GoChevronRight size={20}/>,
    genre:'patient',
    path:'/track_health'
  },
  {
    id: 12,
    name: "Account",
    icon:<IoSettingsOutline size={20}/>,
    back:<GoChevronRight size={20}/>,
    genre:'patient',
    path:'/account'
  },
  {
    id: 13,
    name: "Close",
    icon:<LuPanelLeftClose size={20}/>,
  },
];



export const patient_page_items = [
  {id:1,
   name:'Book Appointment',
   icon:<MdOutlineMessage size={25} color='white'/>,
   path:'/dashboard/patient/appointment',
  },
  {id:2,
    name:'Track Healthcare',
   icon:<GiHealthNormal size={25} color='white'/>,
   path:'/dashboard/patient/track_health',
  },
    {id:3,
   name:'History',
   icon:<GoHistory size={25} color='white'/>,
   path:'/dashboard/patient/history', 
  }
] 



export const admin_employees_items = [{
    id:1,
    name:"Doctors",
    icon:<FaUserDoctor size={20} color='white'/>
},
{
    id:2,
    name:"Nurses",
    icon:<RiNurseLine size={20} color='white'/>
},{

        id:3,
    name:"Pharmacists",
    icon:<MdOutlineLocalPharmacy size={20} color='white'/>
},
{
    id:4,
    name:"Others",
    icon:<BsMotherboard size={20} color='white'/>
}]


export const doctor_departments = [
    "General Medicine",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
    "Gynecology",
    "Ophthalmology",
    "ENT",
    "Psychiatry",
  ];



export const other_departments = [
    "Receptionist",
    "Security Guard",
    "Lab Assistant",
    "IT Support Staff",
    "Ambulance Driver",
];