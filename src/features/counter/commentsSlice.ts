/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createComment,
  deleteComment,
  getPostComments,
} from '../../api/comments';
import { Comment } from '../../types/Comment';

type CommentsState = {
  comments: Comment[];
  loading: boolean;
  error: string | null;
};

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchCommentsThunk = createAsyncThunk<Comment[], number>(
  'comments/fetch',
  async postId => {
    return getPostComments(postId);
  },
);

export const createCommentThunk = createAsyncThunk<
Comment,
Omit<Comment, 'id'>
>('comments/create', async data => {
  return createComment(data);
});

export const deleteCommentThunk = createAsyncThunk<number, number>(
  'comments/delete',
  async id => {
    await deleteComment(id);

    return id;
  },
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      // GET
      .addCase(fetchCommentsThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsThunk.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })
      .addCase(fetchCommentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      })

      // CREATE
      .addCase(createCommentThunk.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })

      // DELETE
      .addCase(deleteCommentThunk.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          comment => comment.id !== action.payload,
        );
      });
  },
});

export default commentsSlice.reducer;
