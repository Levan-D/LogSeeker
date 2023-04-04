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
    try {
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
      return res
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

  searchResults: data,
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetState: () => initialState,
    setCurrentPage: (state, action: PayloadAction<initialStateType["currentPage"]>) => {
      state.currentPage = action.payload
    },
    setStartDate: (state, action: PayloadAction<initialStateType["startDate"]>) => {
      state.startDate = action.payload
    },
    setEndDate: (state, action: PayloadAction<initialStateType["endDate"]>) => {
      state.endDate = action.payload
    },
    setSearchValue: (state, action: PayloadAction<initialStateType["searchValue"]>) => {
      state.searchValue = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getLogs.pending, state => {
        state.logStatus.loading = true
        state.logStatus.success = false
        state.logStatus.error = null
      })
      .addCase(getLogs.fulfilled, (state, action: any) => {
        const contentType = action.payload.headers.get("content-type")

        if (contentType && contentType.includes("application/json")) {
          state.searchResults = action.payload
        } else console.error("Expected JSON but received:", contentType)

        state.searchValue = ""
      })
      .addCase(getLogs.rejected, (state, action: any) => {
        const contentType = action.payload.headers.get("content-type")

        console.error("Expected JSON but received:", contentType)

        state.searchValue = ""
        state.logStatus.loading = false
        state.logStatus.error = "Expected JSON but received:" + " " + " " + contentType
      })
  },
})

export const selectPageLength = createSelector(
  (state: RootState) => state.app,
  app => {
    return Math.floor(app.searchResults.length / app.pageLength)
  }
)

export const { setStartDate, setEndDate, setCurrentPage, setSearchValue } =
  appSlice.actions
export default appSlice.reducer
