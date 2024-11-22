import { createSlice } from "@reduxjs/toolkit";
import { Blogpostprops, Notificationsprops, Userprops } from "../../entities";

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
        clearProfile: (state, action: { payload: InitialState['userProfile'] }) => {
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
        addNotifications: (state, action: { payload: Notificationsprops[] }) => {
            const { data } = state.userProfile;
            if (!data) return;
            state.userProfile.data = {
                ...data,
                notifications: [...action.payload, ...data.notifications]
            };
        },
        viewedNotification: (state, action: { payload: { _id: string } }) => {
            const { data } = state.userProfile;
            if (!data) return;
            state.userProfile.data = {
                ...data,
                notifications: data.notifications.map((item) => {
                    if (item._id === action.payload._id) {
                        return { ...item, checked: true };
                    } else {
                        return item;
                    };
                })
            };
        },
        deleteNotification: (state, action: { payload: { _id: string } }) => {
            const { data } = state.userProfile;
            if (!data) return;
            state.userProfile.data = {
                ...data,
                notifications: data.notifications.filter(item => item._id !== action.payload._id)
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
        },
        addDrafts: (state, action: { payload: Blogpostprops }) => {
            const { data } = state.userProfile;
            if (!data) return;
            state.userProfile.data = {
                ...data,
                drafts: [action.payload, ...data.drafts]
            };
        },
        editDrafts: (state, action: { payload: Blogpostprops }) => {
            const { data } = state.userProfile
            if (!data) return
            state.userProfile.data = {
                ...data,
                drafts: data.drafts.map((item) => item._id === action.payload._id ? { ...action.payload } : item)
            }
        },
        deleteDrafts: (state, action: { payload: { _id: string } }) => {
            const { data } = state.userProfile;
            if (!data) return;
            state.userProfile.data = {
                ...data,
                drafts: data.drafts.filter(item => item._id !== action.payload._id)
            };
        }
    }
});

export const {
    fetchProfile, editProfile, clearProfile,
    unFollow, follow,
    addNotifications, viewedNotification,
    addBlogpostIdToSaves, deleteBlogpostIdFromSaves, deleteNotification,
    addDrafts, deleteDrafts, editDrafts
} = userProfile.actions;

export default userProfile.reducer;
