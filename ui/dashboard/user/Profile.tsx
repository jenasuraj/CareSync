"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";
import { VscHistory } from "react-icons/vsc";
import Link from "next/link";
import img from "@/public/banner.jpg";
import profimg from "@/public/profile.webp";
import EditProfileModal from "@/ui/dashboard/user/EditProileModal";
import { FormType } from "@/types/Employee"; // adjust path if needed
import type { StaticImageData } from "next/image";



const EMPTY_FORM: FormType = {
  name: "",
  email: "",
  about: "",
  profile: "",
  banner: "",
  address: "",
  phone: "",
};




const Profile = () => {
  const [formData, setFormData] = useState<FormType>(EMPTY_FORM);
  const [tempFormData, setTempFormData] = useState<FormType>(EMPTY_FORM);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const storedId = localStorage.getItem("userId");
    if (!storedId) return;

    try {
      const res = await axios.get("/api/dashboard/user/profile", {
        params: { id: Number(storedId) },
      });

      const d = res.data.data;
      setFormData({
        name: d.name ?? "",
        email: d.email ?? "",
        about: d.about ?? "",
        profile: d.profileImg ?? "",
        banner: d.bannerImg ?? "",
        address: d.address ?? "",
        phone: d.phone ?? "",
      });
    } catch (err) {
      console.error("Profile fetch failed", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  useEffect(() => {
    if (showModal) setTempFormData(formData);
  }, [showModal]);


  const getImageSrc = (img: string | File, fallback: StaticImageData) => {
  if (typeof img === "string" && img.length > 0) return img;
  if (img instanceof File) return URL.createObjectURL(img);
  return fallback;
};


  return (
    <>
      <section className="w-full max-w-4xl mx-auto text-black p-4 min-h-screen ">
        {/* Banner */}
        <div className="w-full h-[35vh] relative overflow-hidden rounded-t-md">
          <Image
            src={getImageSrc(formData.banner, img)}
            alt="banner"
            fill
            className="object-cover"
          />

          <div className="absolute bottom-4 left-6 w-28 h-28 rounded-full overflow-hidden">
            <Image
              src={getImageSrc(formData.profile, profimg)}
              alt="profile"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="mt-16 flex justify-between px-4 gap-5 ">
          <div>
            <h1 className="text-2xl flex gap-2">
              {formData.name || "Unknown"}
            </h1>
            <p>
              Email : {formData.email || "unknown@email.com"}
            </p>
            <p>
              Phone : {formData.phone || "+91 9999999999"}
            </p>
        <p className="max-w-lg">
            {formData.address || "No Address"}
          </p>
          </div>

          <p className="max-w-lg">
            {formData.about || "No description"}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4 w-full flex-col">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 flex items-center text-gray-300 justify-center gap-2 py-2 rounded-sm bg-blue-900 cursor-pointer hover:bg-blue-700 duration-300"
          >
            Edit Profile <FaRegEdit color="white"/>
          </button>
       <Link href="/dashboard/patient/history" className="flex-1 flex items-center text-gray-300 justify-center gap-2 py-2 rounded-sm bg-blue-900 cursor-pointer hover:bg-blue-700 duration-300">
            Past Activity <VscHistory color="white"/>
       </Link>
        </div>
      </section>

      {showModal && (
        <EditProfileModal
          loading={loading}
          setLoading={setLoading}
          tempFormData={tempFormData}
          setTempFormData={setTempFormData}
          refresh={refresh}
          setRefresh={setRefresh}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          setFormData={setFormData}
        />
      )}
    </>
  );
};

export default Profile;
