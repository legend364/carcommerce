"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Listings from "../listing/page";
import Ratings from "../ratings/page";
import { AuthContext } from "../../authorization/AuthContext";

export default function Dashboard() {
  const { access_token, permissions } = useContext(AuthContext); 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Loading state to prevent rendering

  useEffect(() => {
    // Only proceed if token and permissions are checked
    if (access_token && permissions) {
      if (!permissions?.sub.has_buy_permission) {
        router.push('/');
      } else {
        setIsLoading(false); // Allow rendering if authorized
      }
    } else if (!access_token) {
      // If there's no token, redirect immediately
      router.push('/');
    }
  }, [access_token, permissions, router]);

  const [selectedOption, setSelectedOption] = useState("option1");
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  if (isLoading) {
    return null; // Render nothing until loading is complete
  }

  return (
    <div className="bg-gray-100 flex text-white h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Column: Dashboard Options */}
      <div className="w-1/2 bg-red-500 p-5 overflow-hidden h-full">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left p-2 rounded hover:bg-red-200 ${
                selectedOption === "option1" ? "bg-red-300" : ""
              }`}
              onClick={() => handleOptionClick("option1")}
            >
              Car Listings
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded hover:bg-red-200 ${
                selectedOption === "option2" ? "bg-red-300" : ""
              }`}
              onClick={() => handleOptionClick("option2")}
            >
              Rate Agents
            </button>
          </li>
        </ul>
      </div>

      {/* Right Column: Content Based on Selected Option */}
      <div className="w-3/4 p-4 overflow-y-auto h-full">
        {selectedOption === "option1" && (
          <div>
            <Listings />
          </div>
        )}
        {selectedOption === "option2" && (
          <div>
            <Ratings />
          </div>
        )}
      </div>
    </div>

  );
}
