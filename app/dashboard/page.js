"use client";
import NavLayout from "@/components/NavLayout";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { getGuilds } from "@/utils/testData";
import Sidebar from "@/components/Sidebar";
import { selectGuild, updateUserGuilds } from "@/utils/authReducer";
import { useDispatch } from "react-redux";

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
      dispatch(selectGuild(""))
      dispatch(updateUserGuilds(getGuilds()))
    }
    if(status === 'authenticated'){
      getData();
    }
  }, [status]);

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
