"use client";
import NavLayout from "@/components/NavLayout";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function MainGuildScreen() {
  const { selectedGuild } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  let guildSettings = useRef();

  useEffect(() => {
    async function getData() {
      await fetch(`/api/guild/${selectedGuild?.id}`, {}).then((res) => {
        return res.json().then((data) => {
          guildSettings.current = data;
          setLoading(false);
        });
      });
    }
    getData();
  }, []);

  if (status === "unauthenticated") {
    redirect("/");
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <NavLayout />
      <Sidebar guildSettings={guildSettings} />
    </div>
  );
}
