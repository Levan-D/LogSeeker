/** @format */

import React, { useState } from "react"
//@ts-ignore
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { setStartDate, setEndDate, setSearchValue } from "./appSlice"
import { getLogs } from "./appSlice"

const SearchComponent = () => {
  const dispatch = useAppDispatch()
  const { startDate, endDate, searchValue } = useAppSelector(store => store.app)

  const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      dispatch(getLogs({ startDate, endDate, searchValue }))
    }
  }

  return (
    <div>
      <input
        type="text"
        value={searchValue}
        onChange={e => dispatch(setSearchValue(e.target.value))}
        onKeyPress={handleKeyPress}
        placeholder="Search any message or username"
        id="searchbox"
      />
      <div>
        <label>Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date: Date) => dispatch(setStartDate(date))}
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
        <label>End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date: Date) => dispatch(setEndDate(date))}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
      </div>
    </div>
  )
}

export default SearchComponent
