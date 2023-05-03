/** @format */

import React from "react";
import { setCurrentPage } from "./appSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectPageLength } from "./appSlice";

export default function Pagination() {
  const dispatch = useAppDispatch();
  const { currentPage } = useAppSelector((store) => store.app);
  const pages = useAppSelector(selectPageLength);
  return (
    <div className="flex w-fit mx-auto my-8  gap-2 flex-wrap max-w-2xl">
      {[...Array(pages).keys()].map((page, i) => (
        <div
          key={i}
          onClick={() => dispatch(setCurrentPage(i))}
          className={`${
            i === currentPage && "!border-white"
          } bg-slate-800  w-8 h-8 select-none cursor-pointer border-2 border-transparent hover:bg-slate-700  active:bg-slate-600 duration-200 text-center rounded-md leading-7`}
        >
          {page + 1}
        </div>
      ))}
    </div>
  );
}
