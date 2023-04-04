/** @format */

import React, { useState } from "react"
//@ts-ignore
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import data from "./data.json"
import Tooltip from "./Tooltip"

const SearchComponent = () => {
  const [searchValue, setSearchValue] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [startDate, setStartDate] = useState(new Date("2021-02-17"))
  const [endDate, setEndDate] = useState(new Date())
  console.log(searchResults)
  const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      submitSearch()
      event.preventDefault()
    }
  }

  const submitSearch = async () => {
    const response = await fetch(
      `https://chatlog.totemarts.dev/search/?` +
        new URLSearchParams({
          dateFrom: startDate.toISOString().split("T")[0],
          dateTo: endDate.toISOString().split("T")[0],
          searchValue: searchValue,
        }),
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )

    if (response.ok) {
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        setSearchResults(data)
      } else {
        console.error("Expected JSON but received:", contentType)
      }
    } else {
      console.log(response)
    }
  }

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
    <div>
      <input
        type="text"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search any message or username"
        id="searchbox"
      />
      <div>
        <label>Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
        <label>End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
      </div>
      <ul>
        {/* {searchResults.map((item, i) => ( */}
        {data.map((item, i) => (
          <li
            key={i}
            className={`${
              i % 2 === 0 ? " bg-slate-800  " : "bg-slate-900"
            }  rounded-md px-5 m-2.5 py-2.5 `}
          >
            {formatString(item.fileName, item.matchedLine, i)}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SearchComponent
