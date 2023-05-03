/** @format */

import React from "react";
//@ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setStartDate, setEndDate, setSearchValue } from "./appSlice";
import { getLogs } from "./appSlice";

const SearchComponent = () => {
  const dispatch = useAppDispatch();
  const { startDate, endDate, searchValue, searchResults, logStatus } =
    useAppSelector((store) => store.app);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      dispatch(getLogs({ startDate, endDate, searchValue }));
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(getLogs({ startDate, endDate, searchValue }));
  };

  return (
    <div
      className={`${
        searchResults.length === 0
          ? "   mt-[30vh]  w-fit"
          : "mt-8 w-full rounded-lg bg-slate-800"
      }  transition-all duration-500 mx-auto `}
    >
      <div
        className={` bg-slate-800 w-fit mx-auto rounded-lg mt-8 px-12 py-8 `}
      >
        <form onSubmit={submit}>
          <label className="font-semibold">Enter message or username</label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => dispatch(setSearchValue(e.target.value))}
            onKeyDown={handleKeyPress}
            required
            placeholder="Search any message or username"
            id="searchbox"
            className="w-full bg-slate-700 rounded-md  p-2 mt-1"
          />
          <div className="flex justify-between mt-8 gap-16">
            <div className="max-w-[200px]">
              <label className="font-semibold">Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date) => dispatch(setStartDate(date))}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="w-full bg-slate-700 rounded-md  p-2 mt-1 text-center"
              />
            </div>
            <div className="max-w-[200px]">
              <label className="font-semibold text-center  ">End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date) => dispatch(setEndDate(date))}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="w-full bg-slate-700 rounded-md    p-2 mt-1 text-center"
              />
            </div>
          </div>
          <input
            type="submit"
            value="Search"
            disabled={logStatus.loading ? true : false}
            className={` ${
              logStatus.loading
                ? "opacity-50 cursor-progress "
                : "hover:bg-rose-500 active:bg-rose-400  "
            } w-2/3 mx-auto  block font-semibold bg-rose-600   duration-300 cursor-pointer select-none py-2 rounded-md text-center  mt-8`}
          />
        </form>
      </div>
    </div>
  );
};

export default SearchComponent;
