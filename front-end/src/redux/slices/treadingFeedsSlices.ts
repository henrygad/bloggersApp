import { createSlice } from "@reduxjs/toolkit";
import { Blogpostprops } from "../../entities";


type Initialstate = {
    treadingFeeds: {
        data: Blogpostprops[]
        loading: boolean,
        error: string
    }
};

const initialState: Initialstate = {
    treadingFeeds: {
        data: [],
        loading: false,
        error: ''
    },
};

const treadingFeeds = createSlice({
    name: 'treadingFeeds',
    initialState,
    reducers: {
        addTreadingFeeds: (state, action)=>{
            state.treadingFeeds = action.payload;
        }
    }
});


export const {addTreadingFeeds} = treadingFeeds.actions;
export default treadingFeeds.reducer;