/** @format */

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import data from "./data.json"

interface initialStateType {
  searchValue: string
  startDate: Date
  endDate: Date
  currentPage: number
  pageLength: number
  logStatus: {
    error: null | string
    loading: boolean
    success: boolean
  }

  searchResults: {
    fileName: string
    matchedLine: string
  }[]
}
export const getLogs = createAsyncThunk(
  "logs/get",
  async (
    {
      startDate,
      endDate,
      searchValue,
    }: { startDate: Date; endDate: Date; searchValue: string },
    { rejectWithValue }
  ) => {
    console.log(
      `${window.location.origin}/search/?` +
        new URLSearchParams({
          dateFrom: startDate.toISOString().split("T")[0],
          dateTo: endDate.toISOString().split("T")[0],
          searchValue: searchValue,
        })
    )
    try {
      // this is to simulate data fetching cuz u didnt faking fix the cors policy

      // return new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve(data);
      //   }, 2000);
      // });

      // code below is the actual api call

      const res = await fetch(
        `${window.location.origin}/search/?` +
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

      // code above is the actual api call

      // Check if the response is OK and try to parse the text as JSON
      if (res.ok) {
        const data = await res.text()
        const jsonData = JSON.parse(data)
        return jsonData
      } else {
        throw new Error("Failed to fetch data")
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const initialState: initialStateType = {
  searchValue: "",
  startDate: new Date("2021-02-17"),
  endDate: new Date(),
  currentPage: 0,
  pageLength: 100,
  logStatus: {
    error: null,
    loading: false,
    success: false,
  },
  // add data to search results for testing purposes
  searchResults: [],
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetState: () => initialState,
    setCurrentPage: (
      state,
      action: PayloadAction<initialStateType["currentPage"]>
    ) => {
      state.currentPage = action.payload
    },
    setStartDate: (
      state,
      action: PayloadAction<initialStateType["startDate"]>
    ) => {
      state.startDate = action.payload
    },
    setEndDate: (state, action: PayloadAction<initialStateType["endDate"]>) => {
      state.endDate = action.payload
    },
    setSearchValue: (
      state,
      action: PayloadAction<initialStateType["searchValue"]>
    ) => {
      state.searchValue = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLogs.pending, (state) => {
        state.logStatus.loading = true
        state.logStatus.success = false
        state.logStatus.error = null
      })
      .addCase(getLogs.fulfilled, (state, action: any) => {
        console.log("action.payload:", action.payload)
        state.searchResults = action.payload.filter(
          (item: { fileName: string; matchedLine: string }) =>
            item.fileName.includes("ChatLog")
        ) // Directly use the parsed data and filter out anything that isnt chatlog because apperantly noone gives a goose neck about datatructures
        state.searchValue = ""
        state.currentPage = 0
        state.logStatus.loading = false
      })
      .addCase(getLogs.rejected, (state, action: any) => {
        state.searchValue = ""
        state.logStatus.loading = false
        state.logStatus.error = "Error fetching data: " + action.payload.message
      })
  },
})

export const selectPageLength = createSelector(
  (state: RootState) => state.app,
  (app) => {
    return Math.ceil(app.searchResults.length / app.pageLength)
  }
)

export const { setStartDate, setEndDate, setCurrentPage, setSearchValue } =
  appSlice.actions
export default appSlice.reducer
