import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../redux/store'
import { Link } from 'react-router-dom';
import { FiHome } from "react-icons/fi";
import { LuMessageSquareMore } from "react-icons/lu";
import { CiBookmark } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";

export default function Menu() {
  const {user} = useSelector((state:RootState) => state.auth);
  const [firstLetter, setFirstLetter] = useState(user?.username.length != undefined ? user.username.charAt(0) : "P");

  type NavItemProps = {
    to: string, 
    icon: React.ReactNode,
    label: string
  }

  const NavItem = ({to, icon, label}: NavItemProps) => {
    return (
        <Link to={to} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors">
          {icon}
          <span className="font-sans font-medium hidden md:inline">{label}</span>
        </Link>

    )
  };

  console.log(user);
  
  return (
    <div className='h-full flex flex-col justify-between'>
      <div className='flex flex-col text'>
        <div className="m-5 ml-5 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center"> {firstLetter} </div>
        <div className="flex flex-col space-y-2">
          <NavItem to="/" icon={<FiHome />} label="Home" />
          <NavItem to="/messages" icon={<LuMessageSquareMore />} label="Messages" />
          <NavItem to="/bookmarks" icon={<CiBookmark />} label="Bookmarks" />
          <NavItem to="/profile" icon={<CiUser />} label="Profile" />
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-4 border-t border-gray-300">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
            {firstLetter}
          </div>
          <div className="flex-1">
            <div className="font-medium">{user?.username ?? "Guest"}</div>
            <div className="text-sm text-gray-500">@{user?.email ?? "email"}</div>
          </div>
          <button className="text-sm text-gray-500 hover:underline"><CiSettings size={30} /></button>
        </div>
    </div>
  )
}