/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserPosts } from '../../api/posts';
import { Post } from '../../types/Post';

type PostsByUser = {
  postsByUser: Post[];
  loading: {
    postsByUser: boolean;
  };
  error: string | null;
};

const initialState: PostsByUser = {
  postsByUser: [],
  loading: {
    postsByUser: false,
  },
  error: null,
};

export const fetchUserPostsThunk = createAsyncThunk<Post[], number>(
  'posts/fetchByUser',
  async userId => {
    return getUserPosts(userId);
  },
);

const postsByUserSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<Post[]>) => {
      state.postsByUser = action.payload;
    },
  },

  extraReducers: builder => {
    builder
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

export default postsByUserSlice.reducer;
export const { setPost } = postsByUserSlice.actions;
