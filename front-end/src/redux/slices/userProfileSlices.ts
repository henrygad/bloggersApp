import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfile: {
        data: {},
        loading: true,
        error: ''
    },
};

const  userProfile = createSlice({
    name: ' userProfile',
    initialState,
    reducers: {
        addProfile: (state, action)=> {
            state.userProfile = action.payload
        },
        editProfile: (state, action)=>{
            state.userProfile.data = {...state.userProfile.data, ...action.payload};
        },
        deleteProfile: (state, action)=>{
            state.userProfile = action.payload
        },
    },
});

export const {addProfile, editProfile, deleteProfile} = userProfile.actions;
export default userProfile.reducer;