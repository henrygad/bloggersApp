import { configureStore } from "@reduxjs/toolkit";
import userProfileSlices from "./userProfileSlices";
import userBlogpostSlices from "./userBlogpostSlices";

const store = configureStore({
    reducer: {
        userProfileSlices,
        userBlogpostSlices,
    },
});


export  default store;
