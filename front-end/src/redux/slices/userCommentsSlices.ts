import { createSlice } from "@reduxjs/toolkit";
import { Commentprops } from "../../entities";

type InitialState = {
    userComments: {
        data: Commentprops[]
        loading: boolean
        error: string
    }
};

const initialState: InitialState = {
    userComments: {
        data: [],
        loading: false,
        error: '',
    }
};

const userComments = createSlice({
    name: 'userComments',
    initialState,
    reducers: {
        addComments: (state, action) => {
            state.userComments = action.payload;
        },
        createComment: (state, action)=> {
            const {data} = state.userComments
            state.userComments.data = [action.payload, ...data];
        },
        deleteComments : (state, action)=>{
            state.userComments.data = state.userComments.data.filter(
                (item)=> item._id !== action.payload
            )
        }
    }
});

export const {addComments, createComment, deleteComments} = userComments.actions;
export default userComments.reducer