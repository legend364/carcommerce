"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Listings from "../viewListings/page";
import Ratings from "../ratings/page";
import AgentProfile from "../agentProfile/page";
import { AuthContext } from "../../authorization/AuthContext";

export default function Dashboard() {
  const { access_token, permissions } = useContext(AuthContext); 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Loading state to prevent rendering

  useEffect(() => {
    // Only proceed if token and permissions are checked
    if (access_token && permissions) {
      if (!permissions?.sub.has_listing_permission) {
        router.push('/');
      } else {
        setIsLoading(false); // Allow rendering if authorized
        
        // Check URL parameters for initial tab
        if (typeof window !== 'undefined') {  // Check if we're in the browser
          const urlParams = new URLSearchParams(window.location.search);
          const tab = urlParams.get('tab');
          if (tab === 'listings') {
            setSelectedOption('option2');
          }
        }
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
    <div className="bg-[#e2e2ef] flex text-white h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Column: Dashboard Options */}
      <div className="w-1/4 bg-[#f75049] p-5 overflow-hidden h-full">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full font-rajdhaniSemiBold text-xl text-left p-2 hover:bg-[#5ef6ff] ${
                selectedOption === "option1" ? "bg-[#5ef6ff]/60 border-2 border-[#5ef6ff]" : ""
              }`}
              onClick={() => handleOptionClick("option1")}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              className={`w-full font-rajdhaniSemiBold text-xl text-left p-2 hover:bg-[#5ef6ff] ${
                selectedOption === "option2" ? "bg-[#5ef6ff]/60 border-2 border-[#5ef6ff]" : ""
              }`}
              onClick={() => handleOptionClick("option2")}
            >
              My Listings
            </button>
          </li>
          <li>
            <button
              className={`w-full font-rajdhaniSemiBold text-xl text-left p-2 hover:bg-[#5ef6ff] ${
                selectedOption === "option3" ? "bg-[#5ef6ff]/60 border-2 border-[#5ef6ff]" : ""
              }`}
              onClick={() => handleOptionClick("option3")}
            >
              Ratings
            </button>
          </li>
        </ul>
      </div>

      {/* Right Column: Content Based on Selected Option */}
      <div className="w-3/4 p-4 overflow-y-auto h-full">
        {selectedOption === "option1" && (
          <div>
            <AgentProfile />
          </div>
        )}
        {selectedOption === "option2" && (
          <div>
            <Listings />
          </div>
        )}
        {selectedOption === "option3" && (
          <div>
            <Ratings />
          </div>
        )}
      </div>
    </div>
  );
}