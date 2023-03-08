"use client";
import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

export default function TeamManagement({ allTeams }) {
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState(allTeams)
  const { selectedGuild } = useSelector((state) => state.auth);
  const newPoints = useRef();
  const newFlag = useRef();

  async function editTeam() {
    let points, flag;
    let newTeams = [...teams]
    if (newPoints.current.value) {
      points = parseFloat(newPoints.current.value);
    }
    if (newFlag.current.value) {
      flag = newFlag.current.value;
    }
    if (points || flag) {
      for (const next of newTeams) {
        if (next["Team ID"] === selectedTeam["Team ID"]) {
          if (points && flag) {
            await fetch("/api/team/edit", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                team: selectedTeam.Name,
                points: points,
                flag: flag,
                id: selectedGuild.id,
              }),
            }).then(() => {
              next.Points = points;
              next["Team Flag"] = flag;
              setTeams(newTeams)
              toast.success("Edit success")
            })
          } else if (points) {
            await fetch("/api/team/edit", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                team: selectedTeam.Name,
                points: points,
                id: selectedGuild.id,
              }),
            }).then(() => {
              next.Points = points;
              setTeams(newTeams)
              toast.success("Edit success")
            })
          } else if (flag) {
            await fetch("/api/team/edit", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                team: selectedTeam.Name,
                flag: flag,
                id: selectedGuild.id,
              }),
            }).then(() => {
              next["Team Flag"] = flag;
              setTeams(newTeams)
              toast.success("Edit success")
            })
          }
          break;
        }
      }
    }
  }

  return (
    <div className="text-white text-center mt-3">
      <ReactModal
        ariaHideApp={false}
        className="top-2/4 left-2/4 right-auto bottom-auto"
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        contentLabel="Edit Team"
      >
        <div
          style={{ width: "800px", height: "300px" }}
          className="background absolute left-1/4 top-32"
        >
          <div className="flex flex-col justify-center text-white p-5">
            <h1 className="text-xl text-center font-bold">
              Edit Team {selectedTeam?.Name}
            </h1>
            <hr />
            <label>Scout Bucks</label>
            <input
              ref={newPoints}
              className="text-black rounded-md mt-3 h-8 p-2 w-44"
              type={"number"}
              name={"Scout Bucks"}
              placeholder={selectedTeam?.Points}
            />
            <label className="mt-5">Team Flag</label>
            <input
              ref={newFlag}
              className="text-black rounded-md mt-3 h-8 p-2"
              type={"url"}
              name={"Team Flag"}
              placeholder={selectedTeam ? selectedTeam["Team Flag"] : ""}
            />
            <div
              className="flex justify-center gap-4 mt-10"
              onClick={() => setOpen(false)}
            >
              <button className="bg-blue-500 rounded-md p-2 hover:bg-blue-800">
                Cancel
              </button>
              <button
                className="bg-blue-500 rounded-md p-2 hover:bg-blue-800"
                onClick={() => editTeam()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
      <h2 className="text-2xl font-bold mb-3">Team Management Settings</h2>
      <p className="italic">Edit existing teams net worth or flag</p>
      <div
        className="background opacity-90 text-white p-5 mb-8"
        style={{ width: "1000px" }}
      >
        <ToastContainer/>
        <table className="w-full">
          <tbody>
            <tr className="border-b-2 border-white">
              <th className="border-b-2 border-white">Team Name</th>
              <th className="border-b-2 border-white">Scout Bucks</th>
              <th className="border-b-2 border-white">Team Flag Set</th>
              <th className="border-b-2 border-white">Actions</th>
            </tr>
            {teams.map((team) => (
              <tr
                className="border-b-2 border-white h-14 hover:bg-lime-600"
                key={team["Team ID"]}
              >
                <td>{team.Name}</td>
                <td>{team.Points}</td>
                <td>
                  {team["Team Flag"] ===
                  "https://drive.google.com/thumbnail?id=" ? (
                    "N/A"
                  ) : (
                    <a
                      className=" text-blue-300"
                      target={"_blank"}
                      rel="noopener noreferrer"
                      href={team["Team Flag"]}
                    >
                      Flag Link
                    </a>
                  )}
                </td>
                <td>
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-blue-500 rounded-md p-2 hover:bg-blue-800"
                      onClick={() => {
                        setSelectedTeam(team);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
