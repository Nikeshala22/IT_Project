import React from "react";
import logo from '../assets/Logo3.webp'; 


export default function SideBar() {
  return (
    <aside>
      <aside className="h-full w-64 bg-gray-900 text-white hidden md:block">
        <div className="p-4 flex items-center">
          <img src={logo} alt="Logo" className="h-32 w-auto mt-5 mx-auto rounded-full" />
        </div>
        <nav className="mt-8">
          <ul className="space-y-5 font-bold text-xl text-center">

            <li className="px-4 py-3 hover:bg-gray-700 hover:duration-300">
              <SideNavLinks linkName="DASHBOARD" url="/dashboard" />
            </li>
            <li className="px-4 py-3 hover:bg-gray-700 hover:duration-300">
              <SideNavLinks linkName="CUSTOMER DETAILS" url="/cus_details" />
            </li>
            <li className="px-4 py-3 hover:bg-gray-700 hover:duration-300">
              <SideNavLinks linkName="PACKAGES" url="/dash_packages" />
            </li>
            <li className="px-4 py-3 hover:bg-gray-700 hover:duration-300">
              <SideNavLinks linkName="INVENTORY" url="/StoreDashboard" />
            </li>
            <li className="px-4 py-3 hover:bg-gray-700 hover:duration-300">
              <SideNavLinks linkName="RECOVERY" url="/Dashboard/recoveryDash" />
            </li>
            <li className="px-4 py-3 hover:bg-gray-700 hover:duration-300">
              <SideNavLinks linkName="RESERVATIONS" url="/reservation" />
            </li>
            <li className="px-4 py-3 hover:bg-gray-700 hover:duration-300">
              <SideNavLinks linkName="OFFERS" url="/offers_dash" />
            </li>
            <li className="px-4 py-3 hover:bg-gray-700 hover:duration-300">
              <SideNavLinks linkName="REFERRALS" url="/referrals_dash" />
            </li>
          </ul>
        </nav>
      </aside>
    </aside>
  );
}