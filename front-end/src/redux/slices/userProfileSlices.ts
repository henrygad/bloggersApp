import { createSlice } from "@reduxjs/toolkit";
import { Userprops } from "../../entities";

type InitialState = {
    userProfile: {
        data: Userprops
        loading: boolean
        error: string
    },
};

const initialState: InitialState = {
    userProfile: {
        data: {} as InitialState['userProfile']['data'],
        loading: false,
        error: ''
    },
};

const userProfile = createSlice({
    name: ' userProfile',
    initialState,
    reducers: {
        addProfile: (state, action) => {
            state.userProfile = action.payload
        },
        editProfile: (state, action) => {
            const { data } = state.userProfile;
            state.userProfile.data = { ...data, ...action.payload };
        },
        deleteProfile: (state, action) => {
            state.userProfile = action.payload
        },
        addFollowing: (state, action) => {
            const { data } = state.userProfile;
            state.userProfile.data = { ...data, following: [...data.following, action.payload] };
        },
        removeFollowing: (state, action) => {
            const { data } = state.userProfile;
            state.userProfile.data = {
                ...data,
                following: data.following.filter(item => item !== action.payload)
            };
        },
        updateNotification: (state, action)=> {
            const {data} = state.userProfile;
            state.userProfile.data = {
                ...data,
                notifications: action.payload
            }
        }

    }
});

export const { 
    addProfile, editProfile, 
    deleteProfile, addFollowing, 
    removeFollowing, updateNotification } = userProfile.actions;
export default userProfile.reducer;