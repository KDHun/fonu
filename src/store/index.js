import { configureStore } from '@reduxjs/toolkit'
import  callHistoryReducer from './CallHistorySlice'
import  phonenumberReducer  from './phonenumberSlice'
export const store = configureStore({
  reducer: {
    phonenumber:phonenumberReducer,
    callHistory:callHistoryReducer
  },
})