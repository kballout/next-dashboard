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
  const [itemIndex, setitemIndex] = useState(0);
  //inputs
  const newName = useRef();
  const newCost = useRef();
  const newQty = useRef();
  const newAvailability = useRef();
  const newStoreIcon = useRef();
  const newLevelRequired = useRef();

  const options = stores.map((store) => {
    return {
      value: store.Name,
      label: store.Name,
    };
  });
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const [selectedStore, setSelectedStore] = useState(stores[0]);

  //extra store options dropdown
  const [extraStores, setExtraStores] = useState();
  const [addedStores, setAddedStores] = useState();
  const [selectedExtraStoreOption, setSelectedExtraStoreOption] = useState();

  //api
  async function deleteItem() {
    await fetch("/api/stores/deleteItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedGuild.id,
        storeName: selectedStore.Name,
        itemNumber: itemIndex,
      }),
    }).then((res) => {
      if (res.ok) {
        for (let i = 0; i < stores.length; i++) {
          if (stores[i].Name === selectedStore.Name) {
            stores[i].Items.splice(itemIndex, 1);
            break;
          }
        }
        toast.success("Item has been removed", { theme: "dark" });
      }
    });
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
        itemNumber: itemIndex,
        itemName: newName.current.value || selectedItem.Name,
        itemQty: parseInt(newQty.current.value) || selectedItem.Qty,
        itemCost: parseFloat(newCost.current.value) || selectedItem.Cost,
        itemAvailable:
          newAvailability.current.value === "on"
            ? true
            : false || selectedItem.Available,
      }),
    }).then((res) => {
      if (res.ok) {
        for (let i = 0; i < stores.length; i++) {
          if (stores[i].Name === selectedStore.Name) {
            stores[i].Items[itemIndex] = {
              Name: newName.current.value || selectedItem.Name,
              Qty: parseInt(newQty.current.value) || selectedItem.Qty,
              Cost: parseFloat(newCost.current.value) || selectedItem.Cost,
              Available:
                newAvailability.current.value === "on"
                  ? true
                  : false || selectedItem.Available,
            };
            break;
          }
        }
        toast.success("Item has been updated", { theme: "dark" });
      }
    });
    setOpen(false);
  }

  async function createNewItem(e) {
    e.preventDefault();
    await fetch("/api/stores/newItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedGuild.id,
        storeName: selectedStore.Name,
        itemNumber: selectedStore.Items.length,
        itemName: newName.current.value,
        itemQty: parseInt(newQty.current.value),
        itemCost: parseFloat(newCost.current.value),
        itemAvailable: newAvailability.current.value === "on" ? true : false,
      }),
    }).then((res) => {
      if (res.ok) {
        for (let i = 0; i < stores.length; i++) {
          if (stores[i].Name === selectedStore.Name) {
            stores[i].Items.push({
              Name: newName.current.value,
              Qty: parseInt(newQty.current.value),
              Cost: parseFloat(newCost.current.value),
              Available: newAvailability.current.value === "on" ? true : false,
            });
            break;
          }
        }
        toast.success("Item has been created", { theme: "dark" });
      }
    });
    setOpen(false);
  }

  async function createNewStore(e) {
    e.preventDefault();
    let split = newName.current.value.split(" ");
    let nameValid = true;
    for (let i = 0; i < split.length; i++) {
      split[i] = split[i][0].toUpperCase() + split[i].substr(1);
    }
    let storeName = split.join(" ");
    for (const store of options) {
      if (store.value === storeName) {
        nameValid = false;
        break;
      }
    }
    if (!nameValid) {
      toast.error("That store name already exists", { theme: "dark" });
    } else {
      await fetch("/api/stores/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedGuild.id,
          name: storeName,
          level: parseInt(newLevelRequired.current.value),
          icon: newStoreIcon.current.value || "",
        }),
      }).then((res) => {
        if (res.ok) {
          window.location.reload();
        }
      });
    }
  }

  async function changeStoreSettings() {
    if (
      selectedStore.Name === "Store 1" ||
      selectedStore.Name === "Store 2" ||
      selectedStore.Name === "Store 3" ||
      selectedStore.Name === "Team Store"
    ) {
      await fetch("/api/stores/editSettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedGuild.id,
          storeName: selectedStore.Name,
          icon: newStoreIcon.current.value || selectedStore.Icon,
        }),
      }).then((res) => {
        if (res.ok) {
          for (let i = 0; i < stores.length; i++) {
            if (stores[i].Name === selectedStore.Name) {
              stores[i].Icon = newStoreIcon.current.value || selectedStore.Icon;
              break
            }
          }
          toast.success("Store settings have been saved", { theme: "dark" });
        }
      });
      setOpen(false)
    } 
    //If extra store
    else {
      await fetch("/api/stores/editSettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedGuild.id,
          storeName: selectedStore.Name,
          icon: newStoreIcon.current.value || selectedStore.Icon,
          levelRequired: parseInt(newLevelRequired.current.value) || selectedStore['Level Required'],
          options: addedStores
        }),
      }).then((res) => {
        if (res.ok) {
          toast.success("Store settings have been saved", { theme: "dark" });
          window.location.reload()
        }
      });
      setOpen(false)
    }
  }

  function changeStore(store) {
    setSelectedOption(store);
    let newStore = stores.filter((s) => s.Name === store.value)[0];
    setSelectedStore(newStore);
    if (
      newStore.Name !== "Store 1" &&
      newStore.Name !== "Store 2" &&
      newStore.Name !== "Store 3" &&
      newStore.Name !== "Team Store"
    ) {
      setAddedStores(Object.values(newStore.Options));
      let opt = [];
      for (const store of stores) {
        if (
          store.Name === "Store 1" ||
          store.Name === "Store 2" ||
          store.Name === "Store 3" ||
          store.Name === "Team Store" ||
          store.Name === newStore.Name
        ) {
        } else {
          if (!Object.values(newStore.Options).includes(store.Name)) {
            opt.push({
              value: store.Name,
              label: store.Name,
            });
          }
        }
      }
      setExtraStores(opt);
      if (opt.length !== 0) {
        setSelectedExtraStoreOption(opt[0]);
      }
    }
  }

  function changeExtraStore(store) {
    setSelectedExtraStoreOption(store);
  }
  function addExtraStore() {
    setAddedStores([...addedStores, selectedExtraStoreOption.value]);
    setExtraStores(
      extraStores.filter((str) => str.value != selectedExtraStoreOption.value)
    );
  }
  function removeExtraStore(str, index) {
    setAddedStores(addedStores.filter((str, i) => i != index));
    setExtraStores([...extraStores, { value: str, label: str }]);
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
          <div className="mt-10">
            <p>
              Additional store options gives the player the ability to choose
              which stores they want to unlock at a certain level. Current
              Settings:
            </p>
            <div className="bg-sky-600 rounded-md h-20 flex gap-2 p-2 flex-wrap">
              {addedStores.map((str, index) => (
                <div key={index}>
                  <div className="bg-blue-500 p-2 text-sm rounded-md flex items-center">
                    {str}
                    <AiOutlineClose
                      onClick={() => removeExtraStore(str, index)}
                      className="ml-2 cursor-pointer"
                      size={15}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Select
                className="w-fit text-blue-400"
                options={extraStores}
                defaultValue={extraStores[0]}
                onChange={(val) => changeExtraStore(val)}
              />
              <button
                onClick={() => addExtraStore()}
                className="bg-blue-500 rounded-md p-2 hover:bg-blue-800"
              >
                Add Store
              </button>
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
              onClick={() => changeStoreSettings()}
              className="bg-green-500 rounded-md p-2 hover:bg-green-800"
            >
              Confirm Changes
            </button>
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

  function changeModal(modal, item = {}, index) {
    if (modal !== "settings") {
      setitemIndex(parseInt(index));
      console.log("item index " + itemIndex);
      setSelectedItem(item);
    }
    setChosenModal(modal);
    setOpen(true);
  }

  return (
    <div className="text-white text-center mt-3">
      {/* Edit store settings */}
      <ToastContainer />
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
              <h2 className="font-bold text-xl text-center">Delete Item</h2>
              <hr className="w-full" />
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
              <div>
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
                      step={0.1}
                      name={"Cost"}
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
                      name={"Quantity"}
                      placeholder={selectedItem?.Qty}
                    />
                  </div>
                  <div className="flex items-center">
                    <label>Availability</label>
                    <input
                      ref={newAvailability}
                      className="text-black rounded-md h-8 p-2 w-7 ml-2"
                      type={"checkbox"}
                      name={"Availability"}
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
        {chosenModal === "newItem" ? (
          <div
            style={{ width: "600px", height: "250px", left: "40%" }}
            className="background absolute top-64 rounded-md p-5"
          >
            <div className="text-white flex flex-col">
              <h1 className="font-bold text-xl text-center">
                New Item
              </h1>
              <hr />
              <form onSubmit={(e) => createNewItem(e)}>
                <label>Name</label>
                <input
                  ref={newName}
                  className="text-black rounded-md mt-1 h-8 p-2 w-full"
                  type={"text"}
                  required
                  placeholder={"Item Name"}
                />
                <div className="flex justify-around gap-3 mt-5">
                  <div>
                    <label>Cost</label>
                    <input
                      ref={newCost}
                      className="text-black rounded-md h-8 p-2 w-24 ml-2"
                      type={"number"}
                      min={0}
                      step={0.1}
                      required
                      placeholder={"Cost"}
                    />
                  </div>
                  <div>
                    <label>Quantity</label>
                    <input
                      ref={newQty}
                      className="text-black rounded-md h-8 p-2 w-24 ml-2"
                      type={"number"}
                      min={0}
                      required
                      placeholder={"Quantity"}
                    />
                  </div>
                  <div className="flex items-center">
                    <label>Availability</label>
                    <input
                      ref={newAvailability}
                      className="text-black rounded-md h-8 p-2 w-7 ml-2"
                      type={"checkbox"}
                      name={"Availability"}
                      defaultChecked={false}
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
                  <input
                    type={"submit"}
                    className="bg-green-500 rounded-md p-2 hover:bg-green-800"
                    value={"Create New Item"}
                  />
                </div>
              </form>
            </div>
          </div>
        ) : (
          <></>
        )}
        {chosenModal === "settings" ? (
          <div
            style={{ width: "700px", left: "40%", top: "150px" }}
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
              {Object.values(selectedStore.Items).map((item, index) => (
                <tr
                  className="border-b-2 border-white h-14 hover:bg-lime-600"
                  key={index}
                >
                  <td>{index + 1}</td>
                  <td>{item.Name}</td>
                  <td>{item.Qty}</td>
                  <td>{item.Cost}</td>
                  <td>{item.Available ? "Yes" : "No"}</td>
                  <td>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => changeModal("edit", item, index)}
                        className="bg-blue-500 rounded-md p-2 hover:bg-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => changeModal("delete", item, index)}
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
          <button
            onClick={() => changeModal("newItem")}
            className="bg-blue-500 rounded-md p-2 mt-5 hover:bg-blue-800"
          >
            Create New Item
          </button>
        </div>
      </div>
    </div>
  );
}
