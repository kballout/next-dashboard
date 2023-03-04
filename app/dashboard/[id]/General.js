"use client";
import SettingCard from "@/components/SettingCard";
import React from "react";
import { Controller, useForm } from "react-hook-form";

export default function General({ generalSettings }) {
  const { control, handleSubmit } = useForm();

  const allParams = [
    {
      name: "Exchange Rate",
      description:
        "Change the rate of exchange for the server (must be a whole number e.g. 75)",
      current: generalSettings["Exchange Rate"] + "%",
      dataName: "exchangeRate",
      type: "number",
      control: control,
      rules: {
        min: 1,
      },
    },
    {
      name: "Maximum offenses",
      description: "Change the maximum number of offenses a player can receive",
      current: generalSettings["Max Offenses"],
      dataName: "maxOffenses",
      type: "number",
      control: control,
      rules: {
        min: 1,
      },
    },
    {
      name: "Offenses Bonus",
      description:
        "Change the amount of bonus points a player recieves for having 0 offenses when the bonus command is sent",
      current: generalSettings["Offenses Bonus"],
      dataName: "offensesBonus",
      type: "number",
      control: control,
      rules: {
        min: 1,
      },
    },
    {
      name: "Exchange Bonus",
      description:
        "Change the amount of bonus points a player recieves for being among the top exchangers when the bonus command is sent",
      current: generalSettings["Exchange Bonus"],
      dataName: "exchangeBonus",
      type: "number",
      control: control,
      rules: {
        min: 1,
      },
    },
    {
      name: "Points Bonus",
      description:
        "Change the amount of bonus points a player recieves for being among the top point collectors when the bonus command is sent",
      current: generalSettings["Points Bonus"],
      dataName: "pointsBonus",
      type: "number",
      control: control,
      rules: {
        min: 1,
      },
    },
    {
      name: "Streak Bonus",
      description:
        "Change the amount of bonus points a player recieves for maintaining streaks for programs when the bonus command is sent",
      current: generalSettings["Streak Bonus"],
      dataName: "streakBonus",
      type: "number",
      control: control,
      rules: {
        min: 1,
      },
    },
    {
      name: "Level 1 buyer",
      description:
        "Change the level a player must reach to gain access to store 1",
      current: generalSettings["Buyer 1 Level"],
      dataName: "level1Buyer",
      type: "number",
      control: control,
      rules: {
        min: 1,
      },
    },
    {
      name: "Level 2 buyer",
      description:
        "Change the level a player must reach to gain access to store 2",
      current: generalSettings["Buyer 2 Level"],
      dataName: "level2Buyer",
      type: "number",
      control: control,
      rules: {
        min: 1,
      },
    },
    {
      name: "Level 3 buyer",
      description:
        "Change the level a player must reach to gain access to store 3",
      current: generalSettings["Buyer 3 Level"],
      dataName: "level3Buyer",
      type: "number",
      control: control,
      rules: {
        min: 1,
      },
    },
    {
      name: "Boost Time Limit",
      description:
        "Change how long a boost card will last once used (in hours)",
      current: generalSettings["Boost Time Limit"],
      dataName: "boostTimeLimit",
      type: "number",
      control: control,
      rules: {
        min: 1,
        max: 6,
      },
    },
  ];

  const submitForm = async (data) => {
    console.log(data);
  };

  return (
    <div className="text-white text-center mt-3">
      <h2 className="text-2xl font-bold mb-3">General Settings</h2>
      <p className="italic">Change the basic settings for your server</p>
      <div
        className="background text-center opacity-90 text-white p-5 mb-8"
        style={{ width: "1000px" }}
      >
        <form
          className="flex flex-wrap items-center justify-evenly gap-2"
          onSubmit={handleSubmit(submitForm)}
        >
          <div className="flex flex-wrap items-center justify-evenly gap-2">
            {allParams.map((param) => (
              <SettingCard key={param.name} params={param} />
            ))}
            {/* auto bonus */}
            <Controller
              control={control}
              name="automaticMonthlyBonus"
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <div className="flex flex-col w-96 bg-blue-900 text-white p-3 rounded-lg">
                  <p className="ml-auto text-sm italic">
                    Currently:{" "}
                    {generalSettings["Automatic Monthly Bonus"] ? "On" : "Off"}
                  </p>
                  <h2 className="font-bold">Automatic Monthly Bonus</h2>
                  <hr />
                  <p className="text-sm italic">
                    Description: Change this setting to allow automatic monthly
                    bonuses in your server
                  </p>
                  <label className="flex items-center justify-center">
                    Toggle Automatic Bonuses
                    <input
                      className="text-black rounded-md p-2 w-5 h-5 ml-2"
                      type="checkbox"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      name="automaticMonthlyBonus"
                      placeholder={generalSettings["Automatic Monthly Bonus"]}
                    />
                  </label>
                </div>
              )}
            />
          </div>
            <input
              className="bg-blue-500 rounded-md p-2 cursor-pointer w-36 mt-5 hover:bg-blue-800"
              type="submit"
            />
        </form>
      </div>
    </div>
  );
}
