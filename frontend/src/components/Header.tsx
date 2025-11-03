import React from "react";
import BarangayImage from "/BarangayKanto.jpg";

const Header = () => {
  return (
    <header className="relative w-full bg-black text-white shadow-md z-20">
      <div
        className="w-full h-40 sm:h-32 bg-cover bg-center flex flex-col justify-center items-center text-center rounded-b-2xl"
        style={{ backgroundImage: `url(${BarangayImage})` }}
      >
        <div className="bg-black bg-opacity-60 w-full h-full flex flex-col justify-center items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Barangay Locator System</h1>
          <p className="text-sm sm:text-base mt-1 opacity-90">
            Find and navigate to your local barangays easily
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
