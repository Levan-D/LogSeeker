/** @format */

import React, { useState } from "react"
import { useAppSelector } from "../app/hooks"

import Tooltip from "./Tooltip"

export default function ListDisplay() {
  const { searchResults } = useAppSelector(store => store.app)

  const formatString = (date: string, rest: string, i: number) => {
    const regexRest =
      /^(\d{2}:\d{2}:\d{2}) (\d+\.\d+\.\d+\.\d+:\d+) (TEAM|ALL) (.*): (.*)$/
    const matchRest = rest.match(regexRest)

    const regexDate = /ChatLog_(\d{4}-\d{2}-\d{2})\.log/
    const matchDate = date.match(regexDate)

    const dateStr = matchDate !== null ? matchDate[1] : ""
    const dateObj = new Date(dateStr)
    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    const formattedDateParts = formatter.formatToParts(dateObj)
    const formattedDateWithComma = formattedDateParts
      .map(part => {
        if (part.type === "month") {
          return part.value + ","
        }
        return part.value
      })
      .join(" ")

    if (matchRest) {
      const userDate = {
        time: matchRest[1],
        ip: matchRest[2],
        group: matchRest[3],
        name: matchRest[4],
        comment: matchRest[5],
      }
      return (
        <div className="flex justify-around gap-8 items-center text-slate-200">
          <div className=" min-w-[120px]  text-center ">
            <div className="leading-5">{formattedDateWithComma}</div>
            <div className="leading-5">{userDate.time}</div>
          </div>
          <div className=" min-w-[180px] ">
            <Tooltip text="Copied" onClick={true}>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(userDate.ip)
                }}
                className={`${
                  i % 2 === 0
                    ? " bg-slate-600  hover:bg-slate-500   active:bg-slate-400"
                    : "bg-slate-700 hover:bg-slate-600  active:bg-slate-500"
                } rounded-lg px-4 py-1 cursor-pointer  duration-300 font-semibold hover:text-white`}
              >
                {userDate.ip}
              </div>
            </Tooltip>
          </div>

          <div className=" basis-2/3">
            <div className="flex  items-center">
              <div className=" font-bold text-slate-100">{userDate.name}</div>
              <Tooltip
                text={userDate.group !== "TEAM" ? "All-chat" : "Team-chat"}
                onClick={false}
              >
                <div
                  className={`${
                    userDate.group === "TEAM" ? "bg-green-300" : "bg-amber-300"
                  } ${
                    i % 2 === 0 ? " text-slate-800  " : "text-slate-900"
                  } text-center leading-4 h-4 w-4  rounded-full font-bold text-xs mx-2 `}
                >
                  {userDate.group.slice(0, 1)}
                </div>
              </Tooltip>
            </div>
            <div className="  text-sm">{userDate.comment}</div>
          </div>
        </div>
      )
    } else {
      return formattedDateWithComma + " " + " " + rest
    }
  }

  return (
    <ul className=" mx-4 my-8 ">
      {searchResults.map((item, i) => (
        <li
          key={i}
          className={`${i % 2 === 0 ? " bg-slate-800  " : "bg-slate-900"}  ${
            i === 0 && " rounded-t-xl "
          }  ${i + 1 === searchResults.length && " rounded-b-xl "}    px-5  py-2.5 `}
        >
          {formatString(item.fileName, item.matchedLine, i)}
        </li>
      ))}
    </ul>
  )
}
