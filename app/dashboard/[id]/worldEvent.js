"use client";
import React, { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillCheckSquareFill, BsXCircle } from "react-icons/bs";
import ReactModal from "react-modal";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WorldEvent({ worldEvent }) {
  const { selectedGuild } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const cost = useRef();
  const [chosenModal, setChosenModal] = useState();

  async function endEvent() {
    await fetch("/api/general/worldEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: selectedGuild.id,
        type: 'end'
      })
    }).then((res) => {
      if(res.ok){
        worldEvent.Status = false,
        worldEvent.Cost = 0.0
        toast.success("The world event has been terminated", {theme:'dark'})
      }
      setOpen(false)
    })
  }

  async function beginEvent(e) {
    e.preventDefault()
    await fetch("/api/general/worldEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: selectedGuild.id,
        type: 'start',
        cost: parseFloat(cost.current.value)
      })
    }).then((res) => {
      if(res.ok){
        worldEvent.Status = true,
        worldEvent.Cost = parseFloat(cost.current.value)
        toast.success("The world event has started", {theme:'dark'})
      }
      setOpen(false)
    })
  }

  function changeModal(modal) {
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
          style={{ width: "500px", height: "250px", left: "40%" }}
          className="p-4 background absolute top-64 rounded-md"
        >
          {chosenModal === "start" ? (
            <div className="text-white flex flex-col">
              <h1 className="font-bold text-xl text-center">
                Begin World Event
              </h1>
              <hr />
              <p className="italic text-center mt-5">
                Please give the amount of scout bucks you want players to reach
              </p>
              <form onSubmit={(e) => beginEvent(e)}>
                <div className="text-center mt-5">
                  <input
                    ref={cost}
                    className="text-black rounded-md h-10 p-2 w-24 ml-2"
                    type={"number"}
                    min={1}
                    step={0.1}
                    required
                    placeholder={"Cost"}
                  />
                </div>
                <div className="flex justify-evenly mt-6">
                  <button
                    onClick={() => setOpen(false)}
                    className="bg-red-500 rounded-md p-2 hover:bg-red-800"
                  >
                    Cancel
                  </button>
                  <input
                    type={"submit"}
                    className="bg-green-500 rounded-md p-2 hover:bg-green-800"
                    value={"Begin Event"}
                  />
                </div>
              </form>
            </div>
          ) : (
            <div className="text-white flex flex-col">
              <h1 className="font-bold text-xl text-center">
                Terminate World Event
              </h1>
              <hr />
              <p className="text-xl text-center mt-5">
                Are you sure you want to end the world event?
              </p>
              <div className="flex justify-evenly mt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-red-500 w-24 rounded-md p-2 hover:bg-red-800"
                >
                  No
                </button>
                <button
                  onClick={() => endEvent()}
                  className="bg-green-500 rounded-md w-24 p-2 hover:bg-green-800"
                >
                  Yes
                </button>
              </div>
            </div>
          )}
        </div>
      </ReactModal>
      <h2 className="text-2xl font-bold mb-3">World Event Settings</h2>
      <p className="italic">Change the settings for the world event</p>
      <div
        className="background opacity-90 text-white p-5 mb-8"
        style={{ width: "1000px" }}
      >
        <h3 className="font-bold text-xl text-center">Current Status</h3>
        <div className="flex items-center justify-center mt-3">
          <p className="italic text-lg">
            The world event is currently{" "}
            {worldEvent.Status ? "active" : "inactive"}
          </p>
          {worldEvent.Status ? (
            <BsFillCheckSquareFill size={23} className="ml-2 text-green-500" />
          ) : (
            <BsXCircle size={23} className="ml-2 text-red-500" />
          )}
        </div>
        {worldEvent.Status ? (
          <div className="flex flex-col items-center">
            The current cost for the world event is {worldEvent.Cost} Scout
            Bucks
            <button
              onClick={() => changeModal("endEvent")}
              className="bg-blue-500 w-fit mt-5 rounded-md p-2 hover:bg-blue-800"
            >
              End World Event
            </button>
          </div>
        ) : (
          <button
            onClick={() => changeModal("start")}
            className="bg-blue-500 rounded-md mt-5 p-2 hover:bg-blue-800"
          >
            Start World Event
          </button>
        )}
      </div>
    </div>
  );
}
