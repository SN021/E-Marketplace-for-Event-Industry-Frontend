import React from "react";

const Navbar = () => {
  return (
    <div className="px-10 pt-2 fixed w-full">
      <div className=" bg-[#171a1b]/85  backdrop-blur-md mx-auto h-20 border-b-[1px] rounded-2xl border-gray-500 text-white">
        <div className="  h-full mx-auto px-5 flex items-center justify-between">
          <h1 className="text-2xl uppercase font-bold">venzor</h1>
          <ul className="flex items-center gap-6 text-5m font-semibold">
            <li className="text-[#86C232] hover:text-white ">Community Hub</li>
          </ul>
          <button className="primary-btn">Become A Vendor</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
