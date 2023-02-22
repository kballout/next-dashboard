"use client";
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
import { useDispatch, useSelector } from "react-redux";
import { selectGuild, updateUserGuilds } from "@/utils/authReducer";
import Link from "next/link";

export default function Sidebar({ guilds, session }) {
  const dispatch = useDispatch();
  dispatch(updateUserGuilds(guilds));
  const [show, setShow] = useState(false);
  const { selectedGuild } = useSelector((state) => state.auth);

  function chooseGuild(guild) {
    if (!selectedGuild || (selectedGuild && selectedGuild.id !== guild.id)) {
      dispatch(selectGuild(guild));
      setShow(true);
    }
  }

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
          <FaBars
            className="cursor-pointer text-white"
            size={32}
            onClick={() => setShow(!show)}
          />
        </div>
        <hr className="bg-white w-14 h-1 m-1" />
        <ul className="m-0 p-0 flex flex-col">
          {guilds.map((guild) => (
            <li
              onClick={() => chooseGuild(guild)}
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
      {/* sidebar extention */}
      <div
        className={` bg-green-200 h-screen w-0 border-r-black border-2 ease-in transition-all duration-200 ${
          show ? "w-80" : "w-0"
        }`}
      >
        {show ? (
          <div>
            {!selectedGuild ? (
              <p className=" text-center items-center">Please select a guild</p>
            ) : (
              <div className="flex flex-col text-center justify-center items-center p-2">
                <Image
                  className="rounded-full"
                  src={`https://cdn.discordapp.com/icons/${selectedGuild.id}/${selectedGuild.icon}.png`}
                  alt={selectedGuild.name}
                  width={200}
                  height={200}
                />
                <h5 className="mt-3 font-bold text-lg">{selectedGuild.name}</h5>
                <nav className="bg-emerald-800 rounded-xl p-3 w-64 mt-8">
                  <ul>
                    <li className=" bg-lime-600 block text-start content-center rounded-xl h-10 cursor-pointer">
                      <Link className="flex items-center h-10 m-1 no-underline text-white" href={`/dashboard/${selectedGuild.id}/general`}>
                        <FiSettings size={20} />
                        <h5 className="ml-1">General</h5>
                      </Link>
                    </li>
                    <li className=" bg-lime-600 block text-start content-center rounded-xl h-10 cursor-pointer">
                      <Link className="flex items-center h-10 m-1 no-underline text-white" href={`/dashboard/${selectedGuild.id}/moderation`}>
                        <FaLanguage size={20} />
                        <h5 className="ml-1">Moderation</h5>
                      </Link>
                    </li>
                    <li className=" bg-lime-600 block text-start content-center rounded-xl h-10 cursor-pointer">
                      <Link className="flex items-center h-10 m-1 no-underline text-white" href={`/dashboard/${selectedGuild.id}/management`}>
                        <HiUserGroup size={20} />
                        <h5 className="ml-1">Team Management</h5>
                      </Link>
                    </li>
                    <li className=" bg-lime-600 block text-start content-center rounded-xl h-10 cursor-pointer">
                      <Link className="flex items-center h-10 m-1 no-underline text-white" href={`/dashboard/${selectedGuild.id}/stores`}>
                        <FaStore size={20} />
                        <h5 className="ml-1">Stores</h5>
                      </Link>
                    </li>
                    <li className=" bg-lime-600 block text-start content-center rounded-xl h-10 cursor-pointer">
                      <Link className="flex items-center h-10 m-1 no-underline text-white" href={`/dashboard/${selectedGuild.id}/programs`}>
                        <FaClipboardList size={20} />
                        <h5 className="ml-1">Programs</h5>
                      </Link>
                    </li>
                    <li className=" bg-lime-600 block text-start content-center rounded-xl h-10 cursor-pointer">
                      <Link className="flex items-center h-10 m-1 no-underline text-white" href={`/dashboard/${selectedGuild.id}/emblems`}>
                        <GiSwordsEmblem size={20} />
                        <h5 className="ml-1">Emblems</h5>
                      </Link>
                    </li>
                    <li className=" bg-lime-600 block text-start content-center rounded-xl h-10 cursor-pointer">
                      <Link className="flex items-center h-10 m-1 no-underline text-white" href={`/dashboard/${selectedGuild.id}/stats`}>
                        <ImStatsBars size={20} />
                        <h5 className="ml-1">Leaderboards</h5>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
