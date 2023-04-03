/** @format */

import React, { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import data from './data.json';

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
      <ul id="search-results">
        {/* {searchResults.map((item, i) => ( */}
        {data.map((item, i) => (
          <li key={i} className={i % 2 === 0 ? "lieven" : ""}>
            {`${item.fileName.split("_")[1].split(".")[0].replaceAll("-", " ")} ${
              item.matchedLine
            }`}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SearchComponent
