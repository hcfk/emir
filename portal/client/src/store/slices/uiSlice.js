import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  unfoldable: false, // Added to manage unfoldable state
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarShow = !state.sidebarShow
    },
    setSidebarVisibility: (state, action) => {
      state.sidebarShow = action.payload
    },
    toggleUnfoldable: (state) => {
      state.unfoldable = !state.unfoldable
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarVisibility, toggleUnfoldable, setTheme } = uiSlice.actions
export default uiSlice.reducer
