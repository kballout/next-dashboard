"use client"
import Image from "next/image";
import React, { useState } from "react";
import {
  FaBars,
  FaPlusCircle,
  FaLanguage,
  FaStore,
  FaClipboardList,
} from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import { GiSwordsEmblem } from "react-icons/gi";
import { ImStatsBars } from "react-icons/im";

export default function Sidebar({ guilds, session }) {
    
    const [show, setShow] = useState(false)

  return (
    <div className="flex h-screen float-left font-livings">
      <nav className="overflow-auto whitespace-nowrap bg-green-400 flex flex-col border-r-black float-left p-3 items-center">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src={`https://cdn.discordapp.com/avatars/${session.discordUser.id}/${session.discordUser.avatar}.png`}
            alt="profilepic"
            height={52}
            width={52}
          />
          <FaBars className="cursor-pointer text-white" size={32} onClick={() => setShow(!show)} />
        </div>
        <hr className="bg-white w-14 h-1 m-1" />
        <ul className="m-0 p-0 flex flex-col">
          {guilds.map((guild) => (
            <li
              className=" list-none m-2 float-left block cursor-pointer"
              key={guild.id}
            >
              <Image
                className="rounded-full"
                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                alt={guild.name}
                width={52}
                height={52}
              />
            </li>
          ))}
        </ul>
        <hr className="bg-white w-14 h-1 m-1" />
        <FaPlusCircle className="cursor-pointer text-white" size={32} />
      </nav>
      <div className={` bg-green-200 h-screen w-0 border-r-black border-2 ease-in transition-all ${show ? 'w-80' : 'w-0'}`}>
            {show ? (
                <div>
                    <p>Please select a guild</p>
                </div>
            ): <></>}
      </div>
    </div>
  );
}
