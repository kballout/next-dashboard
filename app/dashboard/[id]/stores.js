"use client";
import React, { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import ReactModal from "react-modal";

export default function Stores({ allStores }) {
  const [stores, setStores] = useState(allStores);
  const { selectedGuild } = useSelector((state) => state.auth);
  const [chosenModal, setChosenModal] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  //inputs
  const newName = useRef();
  const newCost = useRef();
  const newQty = useRef();
  const newAvailability = useRef();
  const newStoreIcon = useRef();
  const newLevelRequired = useRef();
  const newStoreOptions = useRef();

  const options = stores.map((store) => {
    return {
      value: store.Name,
      label: store.Name,
    };
  });
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const [selectedStore, setSelectedStore] = useState(stores[0]);

  //api
  function deleteItem() {
    setOpen(false);
  }

  async function changeItem() {
    await fetch("/api/stores/editItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedGuild.id,
        storeName: selectedStore.Name,
        itemNumber: selectedItem.Number,
        itemName: newName.current.value || selectedItem.Name,
        itemQty: newQty.current.value || selectedItem.Qty,
        itemCost: newCost.current.value || selectedItem.Cost,
        itemAvailable: newAvailability.current.value || selectedItem.Available,
      }),
    }).then((res) => {
      if (res.ok) {
        toast.success('Item has been updated', {theme: "dark"})
      }
    });
    setOpen(false);
  }

  function changeStore(store) {
    setSelectedOption(store);
    let newStore = stores.filter((s) => s.Name === store.value)[0];
    setSelectedStore(newStore);
  }

  function changeStoreSettings() {}

  async function createNewStore(e) {
    e.preventDefault();
    let split = newName.current.value.split(" ");
    let nameValid = true
    for (let i = 0; i < split.length; i++) {
      split[i] = split[i][0].toUpperCase() + split[i].substr(1)
    }
    let storeName = split.join(" ")
    for (const store of options) {
      if(store.value === storeName){
        nameValid = false
        break
      }
    }
    if(!nameValid){
      toast.error("That store name already exists", {theme: 'dark'})
    }
    else{
      toast.promise("Store is being made please wait")
      await fetch("/api/stores/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedGuild.id,
          name: storeName,
          level: newLevelRequired.current.value,
          icon: newStoreIcon.current.value || "",
        }),
      }).then((res) => {
        if (res.ok) {
          window.location.reload();
        }
      });
    }
  }

  function RenderSettings() {
    if (
      selectedStore.Name !== "Store 1" &&
      selectedStore.Name !== "Store 2" &&
      selectedStore.Name !== "Store 3" &&
      selectedStore.Name !== "Team Store"
    ) {
      return (
        <div className="flex flex-col">
          <div className="flex items-center">
            <label>Level Required</label>
            <input
              ref={newLevelRequired}
              className="text-black rounded-md mt-1 h-8 p-2 w-24 ml-2"
              type={"number"}
              min={1}
              name={"Store Icon"}
              placeholder={`${selectedStore["Level Required"]}`}
            />
          </div>
          <div className="mt-5">
            <div className="flex">
              <p className="italic mr-2">Current Icon:</p>
              <div>
                {!selectedStore?.Icon ? (
                  "N/A"
                ) : (
                  <a
                    className=" text-blue-300"
                    target={"_blank"}
                    rel="noopener noreferrer"
                    href={selectedStore.Icon}
                  >
                    Store Icon Link
                  </a>
                )}
              </div>
            </div>
            <label>Store Icon</label>
            <input
              ref={newStoreIcon}
              className="text-black rounded-md mt-1 h-8 p-2 w-full"
              type={"url"}
              name={"Store Icon"}
              placeholder={selectedStore?.Icon || "Icon URL"}
            />
          </div>
          <div className="mt-5">
            <p>
              Additional store options gives the player the ability to choose
              between extra stores
            </p>
            <p className="italic underline">Currently</p>
            {Object.values(selectedStore?.Options).map((str) => (
              <div key={str}>{str}</div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col">
          <div className="flex">
            <p className="italic mr-2">Current Icon:</p>
            <div>
              {!selectedStore?.Icon ? (
                "N/A"
              ) : (
                <a
                  className=" text-blue-300"
                  target={"_blank"}
                  rel="noopener noreferrer"
                  href={selectedStore.Icon}
                >
                  Store Icon Link
                </a>
              )}
            </div>
          </div>
          <label>Store Icon</label>
          <input
            ref={newStoreIcon}
            className="text-black rounded-md mt-1 h-8 p-2 w-full"
            type={"url"}
            name={"Store Icon"}
            placeholder={selectedStore?.Icon || "Icon URL"}
          />
          <div className="flex justify-evenly mt-8">
            <button
              onClick={() => setOpen(false)}
              className="bg-red-500 rounded-md p-2 hover:bg-red-800"
            >
              Cancel
            </button>
            <button
              onClick={() => changeStoreSettings()}
              className="bg-green-500 rounded-md p-2 hover:bg-green-800"
            >
              Confirm Changes
            </button>
          </div>
        </div>
      );
    }
  }

  function changeModal(modal, item = {}) {
    if (modal !== "settings") {
      setSelectedItem(item);
    }
    setChosenModal(modal);
    setOpen(true);
  }

  return (
    <div className="text-white text-center mt-3">
      {/* Edit store settings */}
      <ToastContainer/>
      <ReactModal
        ariaHideApp={false}
        className="top-2/4 left-2/4 right-auto bottom-auto"
        isOpen={open}
        onRequestClose={() => setOpen(false)}
      >
        {chosenModal === "delete" ? (
          <div
            style={{ width: "550px", height: "150px", left: "40%" }}
            className="background absolute top-64 rounded-md"
          >
            <div className="text-white flex flex-col items-center">
              <h2>Delete Item {selectedItem?.Number}</h2>
              <p>Are you sure you want to delete Item {selectedItem?.Name}?</p>
              <div className="flex gap-5 mt-5">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-red-500 rounded-md p-2 hover:bg-red-800"
                >
                  No
                </button>
                <button
                  onClick={() => deleteItem()}
                  className="bg-green-500 rounded-md p-2 hover:bg-green-800"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {chosenModal === "edit" ? (
          <div
            style={{ width: "600px", height: "250px", left: "40%" }}
            className="background absolute top-64 rounded-md p-5"
          >
            <div className="text-white flex flex-col">
              <h1 className="font-bold text-xl text-center">
                Edit {selectedItem.Name}
              </h1>
              <hr />
              <div className="">
                <label>Name</label>
                <input
                  ref={newName}
                  className="text-black rounded-md mt-1 h-8 p-2 w-full"
                  type={"text"}
                  name={"Item Name"}
                  placeholder={selectedItem?.Name}
                />
                <div className="flex justify-around gap-3 mt-5">
                  <div>
                    <label>Cost</label>
                    <input
                      ref={newCost}
                      className="text-black rounded-md h-8 p-2 w-24 ml-2"
                      type={"number"}
                      min={0}
                      name={"Item Cost"}
                      placeholder={selectedItem?.Cost}
                    />
                  </div>
                  <div>
                    <label>Quantity</label>
                    <input
                      ref={newQty}
                      className="text-black rounded-md h-8 p-2 w-24 ml-2"
                      type={"number"}
                      min={0}
                      name={"Item Quantity"}
                      placeholder={selectedItem?.Qty}
                    />
                  </div>
                  <div className="flex items-center">
                    <label>Availability</label>
                    <input
                      ref={newAvailability}
                      className="text-black rounded-md h-8 p-2 w-7 ml-2"
                      type={"checkbox"}
                      name={"Item Availability"}
                      defaultChecked={selectedItem?.Available}
                    />
                  </div>
                </div>
                <div className="flex justify-evenly mt-8">
                  <button
                    onClick={() => setOpen(false)}
                    className="bg-red-500 rounded-md p-2 hover:bg-red-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => changeItem()}
                    className="bg-green-500 rounded-md p-2 hover:bg-green-800"
                  >
                    Confirm Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {chosenModal === "settings" ? (
          <div
            style={{ width: "700px", left: "40%" }}
            className="background absolute top-64 rounded-md p-5"
          >
            <div className="text-white flex flex-col">
              <h1 className="font-bold text-xl text-center">
                {selectedStore.Name} Settings
              </h1>
              <hr />
              <RenderSettings />
            </div>
          </div>
        ) : (
          <></>
        )}
        {chosenModal === "newStore" ? (
          <div
            style={{ width: "700px", left: "40%" }}
            className="background absolute top-64 rounded-md p-5"
          >
            <div className="text-white flex flex-col">
              <h1 className="font-bold text-xl text-center">
                Create New Store
              </h1>
              <hr />
              <div className="flex flex-col">
                <form onSubmit={(e) => createNewStore(e)}>
                  <div className="flex items-center justify-start">
                    <div>
                      <label>Store Name</label>
                      <input
                        ref={newName}
                        className="text-black rounded-md mt-1 h-8 p-2 w-40 ml-2"
                        type={"text"}
                        required
                        name={"Store Name"}
                        placeholder={"Store Name"}
                      />
                    </div>
                    <div className="ml-5">
                      <label>Level Required</label>
                      <input
                        ref={newLevelRequired}
                        className="text-black rounded-md mt-1 h-8 p-2 w-24 ml-2"
                        type={"number"}
                        min={1}
                        required
                        name={"Store Icon"}
                        placeholder={"Level"}
                      />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="italic">Optional Store Icon</label>
                    <input
                      ref={newStoreIcon}
                      className="text-black rounded-md mt-1 h-8 p-2 w-full"
                      type={"url"}
                      name={"Store Icon"}
                      placeholder={"Icon URL"}
                    />
                  </div>
                  <div className="flex justify-evenly mt-8">
                    <button
                      onClick={() => setOpen(false)}
                      className="bg-red-500 rounded-md p-2 hover:bg-red-800"
                    >
                      Cancel
                    </button>
                    <input
                      className="bg-green-500 rounded-md p-2 hover:bg-green-800"
                      type={"submit"}
                      value="Create New Store"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </ReactModal>
      <h2 className="text-2xl font-bold mb-3">Store Settings</h2>
      <p className="italic">Add/remove stores and edit store items/options</p>
      <div
        className="background opacity-90 text-white p-5 mb-8"
        style={{ width: "1000px" }}
      >
        <div className="flex justify-between">
          <Select
            className="w-fit text-blue-400"
            options={options}
            defaultValue={options[0]}
            onChange={(val) => changeStore(val)}
          />
          <button
            onClick={() => changeModal("newStore")}
            className="bg-blue-500 rounded-md p-2 hover:bg-blue-800"
          >
            Create New Store
          </button>
        </div>
        <div className="mt-8">
          <div className="flex">
            <h1 className="flex-1 text-2xl font-bold">{selectedStore.Name}</h1>
            <button
              onClick={() => changeModal("settings")}
              className="bg-blue-500 rounded-md p-2 ml-auto hover:bg-blue-800"
            >
              Edit Settings
            </button>
          </div>
          <table className="w-full mt-10">
            <tbody>
              <tr className="border-b-2 border-white">
                <th className="border-b-2 boreder-white">Item #</th>
                <th className="border-b-2 boreder-white">Item Name</th>
                <th className="border-b-2 boreder-white">Item Qty</th>
                <th className="border-b-2 boreder-white">Item Cost</th>
                <th className="border-b-2 boreder-white">Available</th>
                <th className="border-b-2 boreder-white">Actions</th>
              </tr>
              {Object.values(selectedStore.Items).map((item) => (
                <tr
                  className="border-b-2 border-white h-14 hover:bg-lime-600"
                  key={item["Number"]}
                >
                  <td>{item["Number"]}</td>
                  <td>{item.Name}</td>
                  <td>{item.Qty}</td>
                  <td>{item.Cost}</td>
                  <td>{item.Available ? "Yes" : "No"}</td>
                  <td>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => changeModal("edit", item)}
                        className="bg-blue-500 rounded-md p-2 hover:bg-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => changeModal("delete", item)}
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
    </div>
  );
}
