import { createSlice } from "@reduxjs/toolkit";
import { Imageprops } from "../../entities";


type Initialstateprops = {
    userAdvaters: {
        data: Imageprops[]
        loading: boolean
        error: string
    }
};

const initialState: Initialstateprops = {
    userAdvaters: {
        data: [],
        loading: false,
        error: ''
    }
};

const userAdvaters = createSlice({
    name: 'userAdvaters',
    initialState,
    reducers: {
        addAdvaters: (state, action) => {
            state.userAdvaters = action.payload;
        },
        createAdvaters: (state, action) => {
            state.userAdvaters.data = [action.payload, ...state.userAdvaters.data];
        },
        deleteAdvaters: (state, action) => {
            state.userAdvaters.data = state.userAdvaters.data.filter(
                (item) => item._id !== action.payload 
            );
        },
    }
});

export const {addAdvaters, createAdvaters, deleteAdvaters} = userAdvaters.actions;
export default userAdvaters.reducer;
