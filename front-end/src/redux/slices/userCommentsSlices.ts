import { createSlice } from "@reduxjs/toolkit";
import { Commentprops } from "../../entities";

type InitialState = {
    userComments: {
        data: Commentprops[]
        loading: boolean
        error: string
    }
    totalNumberOfUserComments: {
        data: number
        loading: boolean
        error: string
    },
};

const initialState: InitialState = {
    userComments: {
        data: [],
        loading: false,
        error: '',
    },
    totalNumberOfUserComments: {
        data: 0,
        loading: false,
        error: '',
    }
};

const userComments = createSlice({
    name: 'userComments',
    initialState,
    reducers: {
        fetchComments: (state, action: {payload: InitialState['userComments']}) => {
            state.userComments = action.payload;
        },
        addComment: (state, action: {payload: Commentprops})=> {
            const {data} = state.userComments
            state.userComments.data = [action.payload, ...data];
        },
        deleteComments : (state, action: {payload: {_id: string}})=>{
            state.userComments.data = state.userComments.data.filter(
                (item)=> item._id !== action.payload._id
            )
        },
        fetchTotalNumberOfUserComments: (state, action: {payload: InitialState['totalNumberOfUserComments']}) => {
            state.totalNumberOfUserComments = action.payload;
        },
        increaseTotalNumberOfUserComments: (state, action: {payload: number}) => {
            state.totalNumberOfUserComments.data += action.payload;
        },
        decreaseTotalNumberOfUserComments: (state, action: {payload: number}) => {
            state.totalNumberOfUserComments.data -= action.payload;
        },
    }
});

export const {
    fetchComments, addComment, deleteComments,
    fetchTotalNumberOfUserComments, decreaseTotalNumberOfUserComments, increaseTotalNumberOfUserComments,
} = userComments.actions;

export default userComments.reducer;
