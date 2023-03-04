"use client";
import React from "react";
import { Controller } from "react-hook-form";

export default function SettingCard({ params }) {
  return (
    <Controller
      control={params.control}
      name={params.dataName}
      rules={params.rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <div className="flex flex-col w-96 bg-blue-900 text-white p-3 rounded-lg">
          <p className="ml-auto text-sm italic">Currently: {params.current}</p>
          <h2 className="font-bold">{params.name}</h2>
          <hr />
          <p className="text-sm italic">Description: {params.description}</p>
          <input
            className="text-black rounded-md mt-3 h-8 p-2"
            type={params.type}
            min={params.rules.min || null}
            max={params.rules.max || null}
            name={params.dataName}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={params.name}
          />
          <div className="self-stretch">
            {error ? (
              <p className="text-red-500">{error.message || "Error"}</p>
            ): (
              <></>
            )}
          </div>
        </div>
      )}
    />
  );
}
