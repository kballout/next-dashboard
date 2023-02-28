"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import {
  FaBars,
  FaPlusCircle,
  FaLanguage,
  FaStore,
  FaClipboardList,
} from "react-icons/fa";
import { FiHome, FiSettings } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import { GiSwordsEmblem } from "react-icons/gi";
import { ImStatsBars } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { selectGuild, updateUserGuilds } from "@/utils/authReducer";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Sidebar({guildSettings = {}}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [setting, setSetting] = useState("home");
  const { guilds, selectedGuild } = useSelector((state) => state.auth);
  const { data: session } = useSession();
  
  async function chooseGuild(guild) {
    if (!selectedGuild || (selectedGuild && selectedGuild.id !== guild.id)) {
      dispatch(selectGuild(guild));
      setSetting("");
      router.push(`/dashboard/${guild.id}`);
    }
  }
  console.log('guild settings');
  return (
    <div className="flex items-center">
      <div className="flex mr-auto h-screen float-left font-livings w-auto">
        <nav className="overflow-auto whitespace-nowrap bg-green-700 flex flex-col border-r-black float-left p-3 items-center">
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
          className={`bg-teal-800 opacity-95 h-screen w-0 border-2 border-black ease-in transition-all duration-200 ${
            show ? "w-80" : "w-0"
          }`}
        >
          {show ? (
            <div>
              {!selectedGuild ? (
                <p className="text-white text-2xl text-center items-center">
                  Please select a guild
                </p>
              ) : (
                <div className="text-white flex flex-col text-center justify-center items-center p-2">
                  <Image
                    className="rounded-full"
                    src={`https://cdn.discordapp.com/icons/${selectedGuild.id}/${selectedGuild.icon}.png`}
                    alt={selectedGuild.name}
                    width={200}
                    height={200}
                  />
                  <h5 className="text-white mt-3 font-bold text-2xl">
                    {selectedGuild.name}
                  </h5>
                  <nav className=" bg-cyan-700 rounded-xl p-3 w-64 mt-8">
                    <ul className=" text-lg">
                      <li
                        className={`block text-start content-center rounded-xl h-10 cursor-pointer ${
                          setting === "home" ? "bg-blue-600" : "bg-lime-600"
                        }`}
                      >
                        <div
                          className="flex items-center h-10 m-1 no-underline"
                          onClick={() => setSetting("home")}
                        >
                          <FiHome size={20} />
                          <h5 className="ml-1">Home</h5>
                        </div>
                      </li>
                      <li
                        className={`block text-start content-center rounded-xl h-10 cursor-pointer ${
                          setting === "general" ? "bg-blue-600" : "bg-lime-600"
                        }`}
                      >
                        <div
                          className="flex items-center h-10 m-1 no-underline"
                          onClick={() => setSetting("general")}
                        >
                          <FiSettings size={20} />
                          <h5 className="ml-1">General</h5>
                        </div>
                      </li>
                      <li
                        className={`block text-start content-center rounded-xl h-10 cursor-pointer ${
                          setting === "moderation"
                            ? "bg-blue-600"
                            : "bg-lime-600"
                        }`}
                      >
                        <div
                          className="flex items-center h-10 m-1 no-underline"
                          onClick={() => setSetting("moderation")}
                        >
                          <FaLanguage size={20} />
                          <h5 className="ml-1">Moderation</h5>
                        </div>
                      </li>
                      <li
                        className={`block text-start content-center rounded-xl h-10 cursor-pointer ${
                          setting === "management"
                            ? "bg-blue-600"
                            : "bg-lime-600"
                        }`}
                      >
                        <div
                          className="flex items-center h-10 m-1 no-underline"
                          onClick={() => setSetting("management")}
                        >
                          <HiUserGroup size={20} />
                          <h5 className="ml-1">Team Management</h5>
                        </div>
                      </li>
                      <li
                        className={`block text-start content-center rounded-xl h-10 cursor-pointer ${
                          setting === "stores" ? "bg-blue-600" : "bg-lime-600"
                        }`}
                      >
                        <div
                          className="flex items-center h-10 m-1 no-underline"
                          onClick={() => setSetting("stores")}
                        >
                          <FaStore size={20} />
                          <h5 className="ml-1">Stores</h5>
                        </div>
                      </li>
                      <li
                        className={`block text-start content-center rounded-xl h-10 cursor-pointer ${
                          setting === "programs" ? "bg-blue-600" : "bg-lime-600"
                        }`}
                      >
                        <div
                          className="flex items-center h-10 m-1 no-underline"
                          onClick={() => setSetting("programs")}
                        >
                          <FaClipboardList size={20} />
                          <h5 className="ml-1">Programs</h5>
                        </div>
                      </li>
                      <li
                        className={`block text-start content-center rounded-xl h-10 cursor-pointer ${
                          setting === "emblems" ? "bg-blue-600" : "bg-lime-600"
                        }`}
                      >
                        <div
                          className="flex items-center h-10 m-1 no-underline"
                          onClick={() => setSetting("emblems")}
                        >
                          <GiSwordsEmblem size={20} />
                          <h5 className="ml-1">Emblems</h5>
                        </div>
                      </li>
                      <li
                        className={`block text-start content-center rounded-xl h-10 cursor-pointer ${
                          setting === "stats" ? "bg-blue-600" : "bg-lime-600"
                        }`}
                      >
                        <div
                          className="flex items-center h-10 m-1 no-underline"
                          onClick={() => setSetting("stats")}
                        >
                          <ImStatsBars size={20} />
                          <h5 className="ml-1">Leaderboards</h5>
                        </div>
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
      <div className="mr-auto">
        {!selectedGuild ? (
          <div
            className="bg-cover bg-no-repeat float-right"
            style={{
              backgroundImage: `url('/transparent.png')`,
              width: "700px",
              height: "700px",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        ) : (
          <div className="flex">
            {setting === 'home' ? (
              <div
                className="bg-sky-500 h-40 text-center opacity-90"
                style={{ width: "600px" }}
              >
                <h3 className="font-bold">{selectedGuild.name}</h3>
                <h4>Overview</h4>
                {guildSettings.current['initialize'] ? (
                  <h3 className="mt-3 italic text-2xl">The activity is currently initialized</h3>
                ): (
                  <h3 className="mt-3 italic text-2xl">The activity has not been initialized</h3>
                )}
                {/* TODO put member,channel,role count */}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
