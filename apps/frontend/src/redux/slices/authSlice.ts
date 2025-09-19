import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


type User = {
  id: string;
  username: string;
  email: string;
};

type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; }>) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload; 
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
