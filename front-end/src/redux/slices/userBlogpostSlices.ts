import { createSlice } from "@reduxjs/toolkit";
import { Blogpostprops, Userprops } from "../../entities";

type Initialstate = {
    userBlogposts: {
        data: Blogpostprops[]
        loading: boolean,
        error: string
    }
};

const initialState: Initialstate = {
    userBlogposts: {
        data: [],
        loading: false,
        error: ''
    },
};

const userBlogposts = createSlice({
    name: 'userBlogposts',
    initialState,
    reducers: {
        addBlogposts: (state, action) => {
            state.userBlogposts = action.payload;
        },
        createBlogpost: (state, action) => {
            state.userBlogposts.data = [action.payload, ...state.userBlogposts.data];
        },
        editBlogposts: (state, action) => {
            state.userBlogposts.data = state.userBlogposts.data.map(
                (item) => item._id === action.payload._id ? { ...action.payload } : item
            );
        },
        deleteBlogposts: (state, action) => {
            state.userBlogposts.data = state.userBlogposts.data.filter(
                (item) => item._id !== action.payload
            );
        },
    },
});

export const { addBlogposts, createBlogpost, editBlogposts, deleteBlogposts } = userBlogposts.actions;
export default userBlogposts.reducer;
