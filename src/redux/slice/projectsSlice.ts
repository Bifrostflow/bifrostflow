import { url } from '@/lib/path';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProjects = createAsyncThunk('projects/fetch', async () => {
  const endpoint = `${url}/apps`;
  const res = await fetch(endpoint);
  return await res.json();
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { projects: [], loading: false },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, state => {
        state.loading = false;
      });
  },
});

export default projectsSlice.reducer;
