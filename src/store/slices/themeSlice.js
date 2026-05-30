import { createSlice } from '@reduxjs/toolkit';

const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial = stored || (prefersDark ? 'dark' : 'light');

if (initial === 'dark') document.documentElement.classList.add('dark');

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: initial },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode);
      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
