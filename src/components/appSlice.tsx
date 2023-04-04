/** @format */

import { createSlice, createSelector } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../app/store"

interface initialStateType {

}

const initialState: initialStateType = {

}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetState: () => initialState,

  },
})

export const selectInbetweenColors = createSelector(
  (state: RootState) => state.app,
    app => { }
  
)

export const {  } =
  appSlice.actions
export default appSlice.reducer
