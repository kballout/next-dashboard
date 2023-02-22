import NavLayout from "@/components/NavLayout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import perms from "../../utils/bitfield";
import React from "react";
import { getGuilds } from "@/utils/testData";
import Sidebar from "@/components/Sidebar";
import { updateUserGuilds } from "@/utils/authReducer";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
//   const fetchGuilds = await fetch(
//     `https://discord.com/api/v10/users/@me/guilds`,
//     {
//       headers: {
//         Authorization: `Bearer ${session?.accessToken}`,
//       },
//     }
//   );
//   const userGuilds = await fetchGuilds.json();
//   const botGuildsFetch = await fetch(
//     `https://discord.com/api/v10/users/@me/guilds`,
//     {
//       headers: {
//         Authorization: `Bot ${process.env.TOKEN}`,
//       },
//     }
//   );

//   const result = await botGuildsFetch.json();
//   const botGuilds = new Map(result.map((obj) => [obj.id, obj]));

//   const guilds = [];
//   let isManager, guild, permissions;
//   for (const next of userGuilds) {
//     guild = botGuilds.get(next.id);
//     if (guild) {
//       permissions = perms(next.permissions);
//       isManager = permissions.includes("MANAGE_GUILD");
//       if (isManager) {
//         guilds.push(guild);
//       }
//     }
//   }


const guilds = getGuilds()
  if (session) {
    return (
      <>
        <NavLayout />
        <Sidebar guilds={guilds} session={session} />
        <div>Welcome to the dashboard</div>
      </>
    );
  }
  return <div>You are not signed in</div>;
}
