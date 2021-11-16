import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"
import { handleFetch } from "../../common/requestUtils";
import { async } from 'regenerator-runtime';

const initialState = {
    addPostPending: false,
    addPostSuccess: false,
    addPostError: null,
    getPostsPending: false,
    getPostsSuccess: false,
    getPostsError: null,
    getPostPending: false,
    getPostSuccess: false,
    getPostError: false,
    deletePostPending: false,
    deletePostSuccess: false,
    deletePostError: null,
    addPostCommentPending: false,
    addPostCommentSuccess: false,
    addPostCommentError: null,
    addPostLikePending: false,
    addPostLikeSuccess: false,
    addPostLikeError: null,
    removePostLikePending: false,
    removePostLikeSuccess: false,
    removePostLikeError: null,
    feed: [],
}

//Actions
const ADD_POST = 'post/ADD_POST';
const GET_POSTS = 'post/GET_POSTS';
const GET_POST = 'post/GET_POST';
const DELETE_POST = 'post/DELETE_POST';
const ADD_POST_COMMENT = 'post/ADD_POST_COMMENT';
const ADD_POST_LIKE = 'post/ADD_POST_LIKE';
const REMOVE_POST_LIKE = 'post/REMOVE_POST_LIKE';

export const addPost = createAsyncThunk(
    ADD_POST,
    async (payload, store) => {
        const { token } = store.getState().authentication;
        return await handleFetch('POST', '/posts', payload, token);
    }
);

export const getPosts = createAsyncThunk(
    GET_POSTS,
    async (params, store) => {
        const { token } = store.getState().authentication;
        return await handleFetch('GET', '/posts', params, token);
    }
)

export const getPost = createAsyncThunk(
    GET_POST,
    async (post_id, store) => {
        const { token } = store.getState().authentication;
        return await handleFetch('GET', `/posts/${post_id}`, null, token);
    }
)

export const deletePost = createAsyncThunk(
    DELETE_POST,
    async (post_id, store) => {
        const { token } = store.getState().authentication;
        return await handleFetch('DELETE', `posts/${post_id}`, null, token);
    } 
)

export const addPostComment = createAsyncThunk(
    ADD_POST_COMMENT,
    async (payload, store) => {
        const { token } = store.getState().authentication;
        return await handleFetch('POST', `posts/${payload['post_id']}/comments`, payload, token);
    }
)

export const addPostLike = createAsyncThunk(
    ADD_POST_LIKE,
    async (post_id, store) => {
        const { token, user } = store.getState().authentication;
        const payload = {
            user_id: user.user_id,
        };
        return await handleFetch('POST', `posts/${post_id}/likes`, payload, token);
    }
)

export const removePostLike = createAsyncThunk(
    REMOVE_POST_LIKE,
    async (post_id, store) => {
        const { token, user } = store.getState().authentication;
        const payload = {
            user_id: user.user_id,
        };
        return await handleFetch('DELETE', `posts/${post_id}/likes`, payload, token);
    }
)

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: {
        [addPost.pending]: (state, action) => {
            state.addPostPending = true;
            state.addPostSuccess = false;
            state.addPostError = null;
        },
        [addPost.fulfilled]: (state, action) => {
            state.addPostPending = false;
            state.addPostSuccess = true;
            state.addPostError = null;
            state.feed.unshift(action.payload.post);
        },
        [addPost.rejected]: (state, action) => {
            state.addPostPending = false;
            state.addPostSuccess = false;
            state.addPostError = action.error;
        },
        [getPosts.pending]: (state, action) => {
            state.getPostsPending = true;
            state.getPostsSuccess = false;
            state.getPostsError = null;
        }, 
        [getPosts.fulfilled]: (state, action) => {
            state.getPostsPending = false;
            state.getPostsSuccess = true;
            state.getPostsError = null;
            console.log(action);
            state.feed = action.payload.posts;
        },
        [getPosts.rejected]: (state, action) => {
            state.getPostsPending = false;
            state.getPostsSuccess = false;
            state.getPostsError = action.payload;
        },
        [getPost.pending]: (state, action) => {
            state.getPostPending = true;
            state.getPostSuccess = false;
            state.getPostError = null;
        },
        [getPost.fulfilled]: (state, action) => {
            state.getPostPending = false;
            state.getPostSuccess = true;
            state.getPostError = null;

            //updating the feed
            const updatedPost = action.payload.post;
            const index = state.feed.findIndex(_post => _post.post_id == updatedPost.post_id);
            if (index || index === 0) {
                state.feed[index] = updatedPost;
            }
        },
        [getPost.rejected]: (state, action) => {
            state.getPostPending = false;
            state.getPostSuccess = false;
            state.getPostError = action.error;
        },
        [deletePost.pending]: (state, action) => {
            state.deletePostPending = true;
            state.deletePostSuccess = false;
            state.deletePostError = null;
        },
        [deletePost.fulfilled]: (state, action) => {
            state.deletePostPending = false;
            state.deletePostSuccess = true;
            state.deletePostError = null;
            state.feed = state.feed.filter(post => post.post_id != action.meta.arg);
        }, 
        [deletePost.rejected]: (state, action) => {
            state.deletePostPending = false;
            state.deletePostSuccess = false;
            state.deletePostError = action.error;
        },
        [addPostComment.pending]: (state, action) => {
            state.addPostCommentPending = true;
            state.addPostCommentSuccess = false;
            state.addPostCommentError = null;
        },
        [addPostComment.fulfilled]: (state, action) => {
            state.addPostCommentPending = false;
            state.addPostCommentSuccess = true;
            state.addPostCommentError = null;
        },
        [addPostComment.rejected]: (state, action) => {
            state.addPostCommentPending = false;
            state.addPostCommentSuccess = false;
            state.addPostCommentError = action.error;
        },
        [addPostLike.pending]: (state, action) => {
            state.addPostLikePending = true;
            state.addPostLikeSuccess = false;
            state.addPostLikeError = null;
        },
        [addPostLike.fulfilled]: (state, action) => {
            state.addPostLikePending = false;
            state.addPostLikeSuccess = true;
            state.addPostLikeError = null;
        }, 
        [addPostLike.rejected]: (state, action) => {
            state.addPostLikePending = false;
            state.addPostLikeSuccess = false;
            state.addPostLikeError = action.error;
        },
        [removePostLike.pending]: (state, action) => {
            state.removePostLikePending = true;
            state.removePostLikeSuccess = false;
            state.removePostLikeError = null;
        },
        [removePostLike.fulfilled]: (state, action) => {
            state.removePostLikePending = false;
            state.removePostLikeSuccess = true;
            state.removePostLikeError = null;
        },
        [removePostLike.rejected]: (state, action) => {
            state.removePostLikePending = false;
            state.removePostLikeSuccess = false;
            state.removePostLikeError = action.error;
        }
    }
});

export default postSlice.reducer;