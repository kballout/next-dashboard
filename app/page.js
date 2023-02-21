import NavLayout from "@/components/NavLayout";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata = {
  title: "Home - GuildMaster",
};

export default function Home() {
  return (
    <>
      <NavLayout />
      <div className="text-white flex justify-center mt-10">
        <div className=" flex flex-col gap-5 text-center font-serif">
          <h1 className=" text-4xl">Build an MMO Themed server!</h1>
          <div className="flex">
            <Image
              src={"/swords-311733.png"}
              alt="swords"
              width={175}
              height={175}
            />
            <p className=" w-48 ml-8">
              Guildmaster will help turn your Discord server into an expansive
              MMO with all sorts of configurable features including Levels/XP,
              Points, Stores, Teams, and many more.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
