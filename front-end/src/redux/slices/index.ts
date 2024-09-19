import { configureStore } from "@reduxjs/toolkit";
import userProfileSlices from "./userProfileSlices";
import userBlogpostSlices from "./userBlogpostSlices";
import userCommentsSlices from "./userCommentsSlices";
import { useDispatch, useSelector } from "react-redux";
import userAdvaters from "./userAdvaters";

const store = configureStore({
    reducer: {
        userProfileSlices,
        userBlogpostSlices,
        userCommentsSlices,
        userAdvaters,
    },
});



type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export  default store;
