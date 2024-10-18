import { createSlice } from "@reduxjs/toolkit";
import { Blogpostprops } from "../../entities";

type Initialstate = {
    userTimelineFeeds: {
        data: Blogpostprops[]
        loading: boolean,
        error: string
    }
};

const initialState: Initialstate = {
    userTimelineFeeds: {
        data: [],
        loading: false,
        error: ''
    },
};

const userTimelineFeeds = createSlice({
    name: 'userTimelineFeeds',
    initialState,
    reducers: {
        addTimelineFeeds : (state, action)=>{
            state.userTimelineFeeds = action.payload;
        }
    }
});

export const {addTimelineFeeds} = userTimelineFeeds.actions;
export default userTimelineFeeds.reducer;