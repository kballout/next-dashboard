"use client";
import React, { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import ReactModal from "react-modal";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Programs({ allPrograms }) {
  const [programs, setPrograms] = useState(allPrograms);
  const [open, setOpen] = useState(false);
  const [chosenModal, setChosenModal] = useState();
  const [selectedProgram, setSelectedProgram] = useState();
  const { selectedGuild } = useSelector((state) => state.auth);
  const progName = useRef();
  const progFactor = useRef();
  const progBonusType = useRef();
  const progBonusAmount = useRef();



  async function createNewProgram(e) {
    e.preventDefault();
    let list = Object.values(programs)
    let isValid = true
    for (const next of list) {
      if(next.Name === progName.current.value){
        isValid = false
        break
      }
    }
    if(isValid){
      await fetch("/api/programs/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          id: selectedGuild.id,
          name: progName.current.value,
          factor: parseFloat(progFactor.current.value),
          type: parseInt(progBonusType.current.value),
          amount: parseFloat(progBonusAmount.current.value),
        }),
      }).then(() => {
        window.location.reload();
      });
    } else {
      toast.error("Program name is already in use", {theme: 'dark'})
    }
  }

  async function changeProgram() {
    await fetch("/api/programs/edit", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: selectedGuild.id,
        name: selectedProgram.Name,
        factor: parseFloat(progFactor.current.value) || selectedProgram.Factor,
        type:
          parseInt(progBonusType.current.value) ||
          selectedProgram["Bonus Type"],
        amount:
          parseFloat(progBonusAmount.current.value) ||
          selectedProgram["Bonus Amount"],
      }),
    }).then((res) => {
      if (res.ok) {
        selectedProgram.Factor = parseFloat(progFactor.current.value) || selectedProgram.Factor
        selectedProgram['Bonus Type'] = parseInt(progBonusType.current.value) || selectedProgram['Bonus Type']
        selectedProgram['Bonus Amount'] = parseFloat(progBonusAmount.current.value) || selectedProgram['Bonus Amount']
        toast.success("Program has been updated", { theme: "dark" });
      }
      setOpen(false);
    });
  }

  async function deleteProgram(){
    await fetch("/api/programs/delete", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: selectedGuild.id,
        name: selectedProgram.Name,
      }),
    }).then(() => {
      window.location.reload();
    });
  }

  function changeModal(modal, program = {}) {
    if (modal !== "create") {
      setSelectedProgram(program);
    }
    setChosenModal(modal);
    setOpen(true);
  }

  return (
    <div className="text-white text-center mt-3">
      <ToastContainer />
      <ReactModal
        ariaHideApp={false}
        className="top-2/4 left-2/4 right-auto bottom-auto"
        isOpen={open}
        onRequestClose={() => setOpen(false)}
      >
        <div
          style={{ width: "700px", height: "300px", left: "40%" }}
          className="p-4 background absolute top-64 rounded-md"
        >
          {chosenModal === "create" ? (
            <div className="text-white flex flex-col">
              <h1 className="font-bold text-xl text-center">New Program</h1>
              <hr />
              <form onSubmit={(e) => createNewProgram(e)}>
                <div className="flex justify-center items-center gap-3 mt-5">
                  <label>Name</label>
                  <input
                    ref={progName}
                    className="text-black rounded-md mt-1 h-8 p-2 w-40"
                    type={"text"}
                    required
                    placeholder={"Name"}
                  />

                  <div>
                    <label>Factor</label>
                    <input
                      ref={progFactor}
                      className="text-black rounded-md h-8 p-2 w-24 ml-2"
                      type={"number"}
                      min={0}
                      step={0.1}
                      required
                      placeholder={"Factor"}
                    />
                  </div>
                  <div className="flex items-center">
                    <label>Bonus Amount</label>
                    <input
                      ref={progBonusAmount}
                      className="text-black rounded-md h-8 p-2 w-24 ml-2"
                      type={"number"}
                      step={0.1}
                      required
                      placeholder="Amount"
                    />
                  </div>
                </div>
                <div className="mt-10">
                  <label>Bonus Type (1 or 2)</label>
                  <input
                    ref={progBonusType}
                    className="text-black rounded-md h-8 p-2 w-24 ml-2"
                    type={"number"}
                    min={1}
                    max={2}
                    required
                    placeholder={"Type"}
                  />
                  <p className="italic">
                    A bonus type of 1 means full attendance is required for
                    bonus. 2 will give bonus for partial attendance
                  </p>
                </div>

                <div className="flex justify-evenly mt-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="bg-red-500 rounded-md p-2 hover:bg-red-800"
                  >
                    Cancel
                  </button>
                  <input
                    type={"submit"}
                    className="bg-green-500 rounded-md p-2 hover:bg-green-800"
                    value={"Create Program"}
                  />
                </div>
              </form>
            </div>
          ) : (
            <></>
          )}
          {chosenModal === "edit" ? (
            <div className="text-white flex flex-col">
              <h1 className="font-bold text-xl text-center">
                Edit {selectedProgram.Name}
              </h1>
              <hr />
              <div className="flex justify-center items-center gap-3 mt-5">
                <div>
                  <label>Factor</label>
                  <input
                    ref={progFactor}
                    className="text-black rounded-md h-8 p-2 w-24 ml-2"
                    type={"number"}
                    min={0}
                    step={0.1}
                    placeholder={selectedProgram.Factor || "Factor"}
                  />
                </div>
                <div className="flex items-center">
                  <label>Bonus Amount</label>
                  <input
                    ref={progBonusAmount}
                    className="text-black rounded-md h-8 p-2 w-24 ml-2"
                    type={"number"}
                    step={0.1}
                    placeholder={selectedProgram["Bonus Amount"] || "Amount"}
                  />
                </div>
              </div>
              <div className="mt-10">
                <label>Bonus Type (1 or 2)</label>
                <input
                  ref={progBonusType}
                  className="text-black rounded-md h-8 p-2 w-24 ml-2"
                  type={"number"}
                  min={1}
                  max={2}
                  placeholder={selectedProgram["Bonus Type"] || "Type"}
                />
                <p className="italic">
                  A bonus type of 1 means full attendance is required for bonus.
                  2 will give bonus for partial attendance
                </p>
              </div>

              <div className="flex justify-evenly mt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-red-500 rounded-md p-2 hover:bg-red-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => changeProgram()}
                  className="bg-green-500 rounded-md p-2 hover:bg-green-800"
                >
                  Confirm Changes
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          {chosenModal === "delete" ? (
            <div className="text-white flex flex-col">
              <h1 className="font-bold text-xl text-center">
                Delete Program
              </h1>
              <hr />
             <p className="text-2xl text-center mt-10">Are you sure you want to delete {selectedProgram.Name}</p>
              <div className="flex justify-evenly mt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-red-500 w-24 rounded-md p-2 hover:bg-red-800"
                >
                  No
                </button>
                <button
                  onClick={() => deleteProgram()}
                  className="bg-green-500 rounded-md w-24 p-2 hover:bg-green-800"
                >
                  Yes
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          
        </div>
      </ReactModal>
      <h2 className="text-2xl font-bold mb-3">Program Settings</h2>
      <p className="italic">Add or remove programs</p>
      <div
        className="background opacity-90 text-white p-5 mb-8"
        style={{ width: "1000px" }}
      >
        <button
          onClick={() => changeModal("create")}
          className="bg-blue-500 rounded-md p-2 hover:bg-blue-800"
        >
          Create New Program
        </button>
        <table className="w-full mt-10">
          <tbody>
            <tr className="border-b-2 border-white">
              <th className="border-b-2 boreder-white">Program Name</th>
              <th className="border-b-2 boreder-white">Factor</th>
              <th className="border-b-2 boreder-white">Bonus Type</th>
              <th className="border-b-2 boreder-white">Bonus Amount</th>
              <th className="border-b-2 boreder-white">Actions</th>
            </tr>
            {Object.values(programs).map((program, index) => (
              <tr
                className="border-b-2 border-white h-14 hover:bg-lime-600"
                key={index}
              >
                <td>{program.Name}</td>
                <td>{program.Factor}</td>
                <td>{program["Bonus Type"]}</td>
                <td>{program["Bonus Amount"]}</td>
                <td>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => changeModal("edit", program)}
                      className="bg-blue-500 rounded-md p-2 hover:bg-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => changeModal("delete", program)}
                      className="bg-blue-500 rounded-md p-2 hover:bg-blue-800"
                    >
                      Delete
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
