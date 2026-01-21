"use client";

import React, { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { FaFireAlt, FaUtensils, FaRunning } from "react-icons/fa";


type CardName = "calorieburnt" | "caloriegained" | "exercise";
interface ApiCardItem {
  name: CardName;
  value: string | null;
}
interface UICardItem extends ApiCardItem {
  icon: ReactNode;
}


const HealthCards = () => {
  const [cardData, setCardData] = useState<UICardItem[]>([]);

  /* Icon mapping */
  const iconMap: Record<CardName, ReactNode> = {
    calorieburnt: <FaFireAlt className="text-orange-500" />,
    caloriegained: <FaUtensils className="text-green-500" />,
    exercise: <FaRunning className="text-blue-500" />,
  };

  const fetchCardInfo = async () => {
    try {
      const storedId = localStorage.getItem("userId");
      if (!storedId) return;

      const response = await axios.get("/api/dashboard/user/health_track", {
        params: { id: Number(storedId) },
      });

      if (response.data?.cardData) {
        const formattedData: UICardItem[] =
          response.data.cardData.map((item: ApiCardItem) => ({
            ...item,
            icon: iconMap[item.name],
          }));

        setCardData(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch health cards", error);
    }
  };

  useEffect(() => {
    fetchCardInfo();
  }, []);

  /* ---------------- UI ---------------- */

return (
  <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
    {cardData.length === 0 ? (
      <p className="text-gray-200">No health data for today</p>
    ) : (
      cardData.map((card) => {
        const value = Number(card.value ?? 0);
        const max = 500;
        const percent = Math.min((value / max) * 100, 100);

        return (
          <div
            key={card.name}
            className="rounded-lg bg-blue-800 border border-blue-700 p-4 flex flex-col gap-4 shadow-sm hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl text-white">{card.icon}</span>
                <p className="text-sm font-medium text-gray-200 capitalize">
                  {card.name.replace("calorie", "calorie ")}
                </p>
              </div>

              <span className="text-xs text-gray-300">Today</span>
            </div>

            {/* Main value */}
            <div>
              <p className="text-2xl font-bold text-white">
                {value}
                <span className="text-sm font-normal text-gray-200 ml-1">
                  {card.name === 'exercise' ? 'Min' : 'Kcal'}
                </span>
              </p>
              <p className="text-xs text-gray-300 mt-1">
                {value > 0 ? "Good progress so far" : "No activity logged"}
              </p>
            </div>
            <p className="text-gray-300">{percent}%</p>

            {/* Progress bar */}
            <div className="w-full h-2 bg-blue-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })
    )}
  </div>
);
};

export default HealthCards;