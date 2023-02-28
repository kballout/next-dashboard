"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getSession,
  SessionProvider,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import { useDispatch } from "react-redux";
import { updateUserGuilds } from "@/utils/authReducer";

export default function NavLayout() {

  async function login() {
    signIn("discord");
  }

  const { data: session } = useSession();
  return (
    <header>
      <nav
        className={`bg-emerald-900 h-fit text-2xl font-bold font-livings text-white`}
      >
        <ul className="flex items-center justify-around">
          <Link href={"/"}>
            <div className="flex items-center">
              <div
                style={{
                  height: "75px",
                  overflow: "clip",
                  color: "white",
                }}
              >
                <Image
                  unoptimized
                  style={{ position: "relative", bottom: "20px" }}
                  width={100}
                  height={100}
                  src={"/transparent.png"}
                  alt="logo"
                />
              </div>
              GuildMaster
            </div>
          </Link>
          <Link href={"/tutorial"}>Tutorial</Link>
          <Link href={"/dashboard"}>Dashboard</Link>
          {session ? (
            <div className="text-lg">
              Logged in as {session?.user?.name}
              <button
                className="bg-blue-600 p-2 rounded-md ml-3"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="bg-blue-600 p-2 rounded-md"
              onClick={() => login()}
            >
              Login
            </button>
          )}
        </ul>
      </nav>
    </header>
  );
}
