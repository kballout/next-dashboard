"use client";
import NavLayout from "@/components/NavLayout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import perms from "../../utils/bitfield";
import React, { useEffect } from "react";
import { getGuilds } from "@/utils/testData";
import Sidebar from "@/components/Sidebar";
import { updateUserGuilds } from "@/utils/authReducer";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const {data:session, status} = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getData() {
      // await fetch("/api/guild/getGuilds", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(session?.accessToken),
      // }).then((res) => {
      //   return res.json().then((data) => {
      //     console.log(data);
      //     dispatch(updateUserGuilds(data));
      //   });
      // });
      dispatch(updateUserGuilds(getGuilds()))
    }
    if(status === 'authenticated'){
      getData();
    }
  }, [status]);

  if(status === 'unauthenticated'){
    redirect('/')
  } else{
    return (
      <div>
        {status === 'authenticated' ? (
          <div>
            <NavLayout />
            <Sidebar />
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
