import { createSlice } from "@reduxjs/toolkit"


export const callSlice = createSlice({
    name: 'call',
    initialState: {
        State:"",
        Time:"",
        caller:"",
        displayName:"",
        
    },
    reducers: {
        setCall: (state, action) => {
            state.user = action.payload;
        }
    }
});

export const { setCall } = callSlice.actions;

export default callSlice.reducer;