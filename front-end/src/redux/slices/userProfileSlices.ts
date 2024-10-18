import { createSlice } from "@reduxjs/toolkit";
import { Blogpostprops, Userprops } from "../../entities";

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
        follow: (state, action) => {
            const { data } = state.userProfile;
            state.userProfile.data = { ...data, following: [...data.following, action.payload] };
        },
        unFollow: (state, action) => {
            const { data } = state.userProfile;
            state.userProfile.data = {
                ...data,
                following: data.following.filter(item => item !== action.payload)
            };
        },
        updateNotification: (state, action) => {
            const { data } = state.userProfile;
            state.userProfile.data = {
                ...data,
                notifications: action.payload
            }
        },
        saveId: (state, action) => {
            const { data } = state.userProfile;
            state.userProfile.data = {
                ...data,
                saves: [action.payload, ...data.saves]
            };
        },
        unSaveId: (state, action) => {
            const { data } = state.userProfile;
            state.userProfile.data = {
                ...data,
                saves: data.saves.filter(item => item !== action.payload)
            };
        }
    }
});

export const {
    addProfile, editProfile,
    deleteProfile, follow,
    unFollow, updateNotification,
    saveId, unSaveId,
} = userProfile.actions;
export default userProfile.reducer;