import { createSlice } from "@reduxjs/toolkit";
import { Imageprops } from "../../entities";


type Initialstate = {
    userAvaters: {
        data: Imageprops[]
        loading: boolean
        error: string
    }
    totalNumberOfUserAvaters: {
        data: number
        loading: boolean
        error: string
    }
    userBlogpostimage: {
        data: Imageprops[]
        loading: boolean
        error: string
    }
};

const initialState: Initialstate = {
    userAvaters: {
        data: [],
        loading: false,
        error: ''
    },
    totalNumberOfUserAvaters: {
        data: 0,
        loading: false,
        error: ''
    },
    userBlogpostimage: {
        data: [],
        loading: false,
        error: ''
    }
};

const userImage = createSlice({
    name: 'userImages',
    initialState,
    reducers: {
        fetchAvaters: (state, action: { payload: Initialstate['userAvaters'] }) => {
            state.userAvaters = action.payload;
        },
        addAvaters: (state, action: { payload: Imageprops }) => {
            state.userAvaters.data = [action.payload, ...state.userAvaters.data];
        },
        deleteAvaters: (state, action: { payload: { _id: string } }) => {
            state.userAvaters.data = state.userAvaters.data.filter(
                (item) => item._id !== action.payload._id
            );
        },
        fetchTotalNumberOfUserAvaters: (state, action: { payload: Initialstate['totalNumberOfUserAvaters'] }) => {
            state.totalNumberOfUserAvaters = action.payload;
        },
        increaseTotalNumberOfUserAvaters: (state, action: { payload: number }) => {
            state.totalNumberOfUserAvaters.data += action.payload;
        },
        decreaseTotalNumberOfUserAvaters: (state, action: { payload: number }) => {
            state.totalNumberOfUserAvaters.data -= action.payload;
        },
        fetchBlogpostImages: (state, action: { payload: Initialstate['userBlogpostimage'] }) => {
            state.userBlogpostimage = action.payload;
        },
        addBlogpostImages: (state, action: { payload: Imageprops }) => {
            console.log(action.payload)
            state.userBlogpostimage.data = [action.payload, ...state.userBlogpostimage.data];
        },
        deleteBlogpostImages: (state, action: { payload: { _id: string } }) => {
            state.userBlogpostimage.data = state.userBlogpostimage.data.filter(
                (item) => item._id !== action.payload._id
            );
        },
    }
});

export const {
    fetchAvaters, addAvaters, deleteAvaters,
    fetchTotalNumberOfUserAvaters, increaseTotalNumberOfUserAvaters, decreaseTotalNumberOfUserAvaters,
    fetchBlogpostImages, addBlogpostImages, deleteBlogpostImages,
} = userImage.actions;
export default userImage.reducer;
