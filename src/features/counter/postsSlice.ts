/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPosts } from '../../api/posts';
import { Post } from '../../types/Post';

type PostsState = {
  items: Post[];
  loaded: {
    allPosts: boolean;
  };
  hasError: string | null;
};

const initialState: PostsState = {
  items: [],
  loaded: {
    allPosts: false,
  },
  hasError: null,
};

export const fetchPostsThunk = createAsyncThunk<Post[]>(
  'posts/fetchAll',
  async () => {
    return getPosts();
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchPostsThunk.pending, state => {
        state.loaded.allPosts = true;
        state.hasError = null;
      })
      .addCase(fetchPostsThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loaded.allPosts = false;
      })
      .addCase(fetchPostsThunk.rejected, (state, action) => {
        state.loaded.allPosts = false;
        state.hasError = action.error.message || 'Failed to load posts';
      });
  },
});

export default postsSlice.reducer;
