// Copyright 2018-present the xiejiahe. All rights reserved. MIT license.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { serviceGetAllCompany } from '@/services'
import { ICompany } from '@/models/company'

export interface SystemState {
  loading: boolean
  companyAll: ICompany[]
}

const initialState: SystemState = {
  loading: false,
  companyAll: []
}

export const getAllCompany = createAsyncThunk('company/getAllCompany', async () => {
  const response = await serviceGetAllCompany()
  return response.items
})

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
  },

  extraReducers(builder) {
    builder
      .addCase(getAllCompany.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllCompany.fulfilled, (state, action) => {
        state.companyAll = action.payload
      })
      .addCase(getAllCompany.rejected, (state) => {
        state.loading = false
      })
  }
})

export default companySlice.reducer
