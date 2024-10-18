import { createSlice } from "@reduxjs/toolkit";
import { Blogpostprops} from "../../entities";

type InitialState = {
    userSaves: {
        data: Blogpostprops[]
        loading: boolean
        error: string
    }
};

const initialState: InitialState = {
    userSaves: {
        data: [],
        loading: false,
        error: '',
    }
};

const userSaves = createSlice({
    name: 'userSaves',
    initialState,
    reducers: {
        addSaves: (state, action) => {
            state.userSaves = action.payload;
        },
        createSaves: (state, action) => {
            const { data } = state.userSaves || []
            state.userSaves.data = [action.payload, ...data];
        },
        deleteSaves: (state, action) => {
            state.userSaves.data = state.userSaves.data.filter(
                (item) => item._id !== action.payload
            )
        }
    }
});

export const { addSaves, createSaves, deleteSaves } = userSaves.actions;
export default userSaves.reducer