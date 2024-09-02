import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userBlogposts: {
        data: [{}],
        loading: true,
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
            state.userBlogposts.data.push(action.payload)
        },
        editBlogposts: (state, action) => {
            state.userBlogposts.data = state.userBlogposts.data.map(
                (item) => item._id === action.payload._id ? { ...action.payload } : item
            );
        },
        deleteBlogposts: (state, action) => {
            state.userBlogposts.data = state.userBlogposts.data.filter(
                (item) => item._id === action.payload ? null : item
            );

            console.log(state.userBlogposts.data);
        },
    },
});

export const { addBlogposts, createBlogpost, editBlogposts, deleteBlogposts } = userBlogposts.actions;
export default userBlogposts.reducer;
