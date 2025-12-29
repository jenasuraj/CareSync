"use client";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FormType } from "@/types/Employee";

interface Props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  tempFormData: FormType;
  setTempFormData: React.Dispatch<React.SetStateAction<FormType>>;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  onClose: () => void;
  setFormData: React.Dispatch<React.SetStateAction<FormType>>;
}

export default function EditProfileModal({
  loading,
  setLoading,
  tempFormData,
  setTempFormData,
  setRefresh,
  isOpen,
  onClose,
  setFormData,
}: Props) {
  if (!isOpen) return null;

  
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const el = e.currentTarget;
  const name = el.name;

  if (el instanceof HTMLInputElement && el.type === "file") {
    setTempFormData(p => ({
      ...p,
      [name]: el.files?.[0] ?? null,
    }));
  } else {
    setTempFormData(p => ({
      ...p,
      [name]: el.value,
    }));
  }
};



  const handleSubmit = async () => {
    const storedId = localStorage.getItem("userId");
    if (!storedId) return;

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("userId", storedId);
      fd.append("name", tempFormData.name);
      fd.append("email", tempFormData.email);
      fd.append("about", tempFormData.about);

      if (tempFormData.profile instanceof File)
        fd.append("profile", tempFormData.profile);

      if (tempFormData.banner instanceof File)
        fd.append("banner", tempFormData.banner);

      const res = await axios.post("/api/dashboard/user/profile", fd);
      const d = res.data.data;

      setFormData({
        name: d.name,
        email: d.email,
        about: d.about,
        profile: d.profileImg,
        banner: d.bannerImg,
        address: d.address,
        phone: d.phone,
      });

      setRefresh((p) => !p);
      onClose();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center">
      <div className="bg-black p-6 flex flex-col rounded-2xl w-full max-w-lg text-gray-300">
        <button onClick={onClose} className="absolute top-4 right-4">
          <RxCross1 />
        </button>

        <input
          name="name"
          value={tempFormData.name}
          onChange={handleChange}
          className="w-full mb-3 border border-gray-500 p-2 rounded-sm"
          placeholder="Name"
        />

        <input
          name="phone"
          value={tempFormData.phone}
          onChange={handleChange}
          className="w-full mb-3 border border-gray-500 p-2 rounded-sm"
          placeholder="Phone"
        />

        <input
          name="address"
          value={tempFormData.address}
          onChange={handleChange}
          className="w-full mb-3 border border-gray-500 p-2 rounded-sm"
          placeholder="Address"
        />

        <textarea
          name="about"
          value={tempFormData.about}
          onChange={handleChange}
          className="w-full mb-3 border border-gray-500 p-2 rounded-sm"
        />
        <div className="w-full flex items-center justify-center gap-4">          
        <input placeholder="enter" type="file" className="bg-green-900 w-1/2 p-2 rounded-md"  name="profile" onChange={handleChange} />
        <input type="file" className="bg-yellow-900 w-1/2 p-2 rounded-md" name="banner" onChange={handleChange} />
        </div>

        <div className="flex justify-end  mt-4 gap-5">
          <button onClick={onClose} >
            <MdCancel /> Cancel
          </button>
          <button onClick={handleSubmit}>
            <FaSave /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
