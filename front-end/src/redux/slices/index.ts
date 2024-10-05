import { configureStore } from "@reduxjs/toolkit";
import userProfileSlices from "./userProfileSlices";
import userBlogpostSlices from "./userBlogpostSlices";
import userCommentsSlices from "./userCommentsSlices";
import userAdvatersSlices from "./userAdvatersSlices";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
    reducer: {
        userProfileSlices,
        userBlogpostSlices,
        userCommentsSlices,
        userAdvatersSlices,
    },
});



type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export  default store;
