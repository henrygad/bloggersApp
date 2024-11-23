import { createSlice } from "@reduxjs/toolkit";
import { Blogpostprops } from "../../entities";

type Initialstate = {
    archivedBlogposts: {
        data: Blogpostprops[]
        loading: boolean,
        error: string
    }
    publishedBlogposts: {
        data: Blogpostprops[]
        loading: boolean,
        error: string
    }
    totalNumberOfPublishedBlogposts: {
        data: number
        loading: boolean,
        error: string
    }
    unpublishedBlogposts: {
        data: Blogpostprops[]
        loading: boolean,
        error: string
    }
    savedsBlogposts: {
        data: Blogpostprops[]
        loading: boolean,
        error: string
    }
    timelineFeeds: {
        data: Blogpostprops[]
        loading: boolean,
        error: string
    }
};

const initialState: Initialstate = {
    archivedBlogposts: {
        data: [],
        loading: false,
        error: '',
    },
    publishedBlogposts: {
        data: [],
        loading: false,
        error: '',
    },
    totalNumberOfPublishedBlogposts: {
        data: 0,
        loading: false,
        error: '',
    },
    unpublishedBlogposts: {
        data: [],
        loading: false,
        error: '',
    },
    savedsBlogposts: {
        data: [],
        loading: false,
        error: '',
    },
    timelineFeeds: {
        data: [],
        loading: false,
        error: '',
    },

};

const userBlogposts = createSlice({
    name: 'userBlogposts',
    initialState,
    reducers: {
        fetchPublishedBlogposts: (state, action: {payload: Initialstate['publishedBlogposts']}) => {
            state.publishedBlogposts = action.payload;
        },
        publishBlogpost: (state, action: {payload: Blogpostprops} ) => {
            state.publishedBlogposts.data = [action.payload, ...state.publishedBlogposts.data];
        },
        editPublishedBlogpost: (state, action: {payload: Blogpostprops}) => { 
            state.publishedBlogposts.data = state.publishedBlogposts.data.map(
                (item) => item._id === action.payload._id ? { ...action.payload } : item
            );
        },
        deletePublishedBlogpost: (state, action: {payload: {_id: string}}) => {
            state.publishedBlogposts.data = state.publishedBlogposts.data.filter(
                (item) => item._id !== action.payload._id
            );
        },
        fetchUnpublishedBlogposts: (state, action: {payload: Initialstate['unpublishedBlogposts']}) => {
            state.unpublishedBlogposts = action.payload;
        },
        addUnpublishBlogposts: (state, action: {payload: Blogpostprops}) => {
            state.unpublishedBlogposts.data = [action.payload, ...state.unpublishedBlogposts.data];
        },
        deleteUnpublishedBlogposts: (state, action: {payload: {_id: string}}) => {
            state.unpublishedBlogposts.data = state.unpublishedBlogposts.data.filter(
                (item) => item._id !== action.payload._id
            );
        },
        fetchTotalNumberOfPublishedBlogposts: (state, action: {payload: Initialstate['totalNumberOfPublishedBlogposts']}) => {
            state.totalNumberOfPublishedBlogposts = action.payload;
        },
        increaseTotalNumberOfPublishedBlogposts: (state, action: {payload: number}) => {
            state.totalNumberOfPublishedBlogposts.data += action.payload;
        },
        decreaseTotalNumberOfPublishedBlogposts: (state, action: {payload: number}) => {
            state.totalNumberOfPublishedBlogposts.data -= action.payload;
        },
        fetchSavedsBlogpost: (state, action: {payload: Initialstate['savedsBlogposts']}) => {
            state.savedsBlogposts = action.payload;
        },
        saveBlogposts: (state, action: {payload: Blogpostprops}) => {
            state.savedsBlogposts.data = [action.payload, ...state.savedsBlogposts.data];
        },
        unSaveBlogpost: (state, action: {payload: {_id: string}}) => {
            state.savedsBlogposts.data = state.savedsBlogposts.data.filter((item) => item._id !== action.payload._id)
        },
        fetchTimelineFeeds: (state, action: {payload: Initialstate['timelineFeeds']}) => {
            state.timelineFeeds = action.payload;
        },
        removeTimelineFeeds: (state, action: {payload: {_id: string}}) => {
            state.timelineFeeds.data =  state.timelineFeeds.data.filter(item=> item._id !== action.payload._id );
        },
    },
});

export const {
    fetchPublishedBlogposts, publishBlogpost, editPublishedBlogpost, deletePublishedBlogpost, 
    fetchTotalNumberOfPublishedBlogposts, increaseTotalNumberOfPublishedBlogposts, decreaseTotalNumberOfPublishedBlogposts,
    fetchUnpublishedBlogposts, addUnpublishBlogposts, deleteUnpublishedBlogposts,
    fetchSavedsBlogpost, saveBlogposts, unSaveBlogpost,
    fetchTimelineFeeds, removeTimelineFeeds,
} = userBlogposts.actions;
export default userBlogposts.reducer;
