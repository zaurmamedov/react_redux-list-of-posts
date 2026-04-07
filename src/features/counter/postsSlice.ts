/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPosts, getUserPosts } from '../../api/posts';
import { Post } from '../../types/Post';

type PostsState = {
  allPosts: Post[];
  postsByUser: Post[];
  loading: {
    allPosts: boolean;
    postsByUser: boolean;
  };
  error: string | null;
};

const initialState: PostsState = {
  allPosts: [],
  postsByUser: [],
  loading: {
    allPosts: false,
    postsByUser: false,
  },
  error: null,
};

export const fetchPostsThunk = createAsyncThunk<Post[]>(
  'posts/fetchAll',
  async () => {
    return getPosts();
  },
);

export const fetchUserPostsThunk = createAsyncThunk<Post[], number>(
  'posts/fetchByUser',
  async userId => {
    return getUserPosts(userId);
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<Post[]>) => {
      state.postsByUser = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchPostsThunk.pending, state => {
        state.loading.allPosts = true;
        state.error = null;
      })
      .addCase(fetchPostsThunk.fulfilled, (state, action) => {
        state.allPosts = action.payload;
        state.loading.allPosts = false;
      })
      .addCase(fetchPostsThunk.rejected, (state, action) => {
        state.loading.allPosts = false;
        state.error = action.error.message || 'Failed to load posts';
      })

      .addCase(fetchUserPostsThunk.pending, state => {
        state.loading.postsByUser = true;
        state.error = null;
      })
      .addCase(fetchUserPostsThunk.fulfilled, (state, action) => {
        state.postsByUser = action.payload;
        state.loading.postsByUser = false;
      })
      .addCase(fetchUserPostsThunk.rejected, (state, action) => {
        state.loading.postsByUser = false;
        state.error = action.error.message || 'Failed to load posts';
      });
  },
});

export default postsSlice.reducer;
export const { setPost } = postsSlice.actions;
