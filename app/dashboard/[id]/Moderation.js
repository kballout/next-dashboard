"use client";
import SettingCard from "@/components/SettingCard";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";

export default function Moderation({ wordsList }) {
  const [words, setWords] = useState(wordsList);
  const [addWord, setAddWord] = useState("");

  const submitForm = async () => {
    
  };

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      setWords([...words, addWord]);
      setAddWord("");
    }
  }

  function removeWord(index) {
    setWords(words.filter((word, i) => i != index));
  }

  return (
    <div className="text-white text-center mt-3">
      <h2 className="text-2xl font-bold mb-3">Moderation Settings</h2>
      <p className="italic">
        Add or remove words from the moderation list below
      </p>
      <div
        className="background opacity-90 text-white p-5 mb-8"
        style={{ width: "1000px" }}
        >
        <div className="flex flex-wrap gap-3">
        {words.map((word, index) => (
          <div
            className="bg-blue-500 p-2 rounded-md flex items-center"
            key={index}
          >
            {word}
            <AiOutlineClose
              onClick={() => removeWord(index)}
              className="ml-2 cursor-pointer"
              size={15}
            />
          </div>
        ))}
        </div>
        <div className="flex mt-10">
          <input
            className="text-black w-72 rounded-md mt-3 h-8 p-2"
            placeholder="Add new word"
            onChange={(event) => setAddWord(event.target.value)}
            value={addWord}
            onKeyDown={(event) => handleKeyDown(event)}
          />
          <button onClick={() => submitForm()} className="bg-blue-500 rounded-md p-2 ml-auto hover:bg-blue-800">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
