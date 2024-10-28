import { createSlice } from "@reduxjs/toolkit";
import { Notificationsprops, Userprops } from "../../entities";

type InitialState = {
    userProfile: {
        data: Userprops | null
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
        fetchProfile: (state, action: { payload: InitialState['userProfile'] }) => {
            state.userProfile = action.payload
        },
        editProfile: (state, action: { payload: Userprops }) => {
            const { data } = state.userProfile;
            state.userProfile.data = { ...data, ...action.payload };
        },
        deleteProfile: (state, action: { payload: InitialState['userProfile'] }) => {
            state.userProfile = action.payload
        },
        follow: (state, action: { payload: { userName: string } }) => {
            const { data } = state.userProfile;
            if (!data) return;
            state.userProfile.data = { ...data, following: [...data.following, action.payload.userName] };
        },
        unFollow: (state, action: { payload: { userName: string } }) => {
            const { data } = state.userProfile;
            if (!data) return;
            state.userProfile.data = {
                ...data,
                following: data.following.filter(item => item !== action.payload.userName)
            };
        },
        updateNotification: (state, action: { payload: Notificationsprops[] }) => {
            const { data } = state.userProfile;
            if (!data) return;
            state.userProfile.data = {
                ...data,
                notifications: action.payload
            };
        },
        addBlogpostIdToSaves: (state, action: { payload: { _id: string } }) => {
            const { data } = state.userProfile;
            if (!data) return;
            state.userProfile.data = {
                ...data,
                saves: [action.payload._id, ...data.saves]
            };
        },
        deleteBlogpostIdFromSaves: (state, action: { payload: { _id: string } }) => {
            const { data } = state.userProfile;
            if (!data) return;
            state.userProfile.data = {
                ...data,
                saves: data.saves.filter(item => item !== action.payload._id)
            };
        }
    }
});

export const {
    fetchProfile, editProfile,
    deleteProfile, follow,
    unFollow, updateNotification,
    addBlogpostIdToSaves, deleteBlogpostIdFromSaves,
} = userProfile.actions;

export default userProfile.reducer;
