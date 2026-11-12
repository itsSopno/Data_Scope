import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserRole } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
}

const initialUser: User = {
  id: "usr_admin_101",
  name: "Alex Vance",
  email: "alex.vance@datascope.enterprise",
  role: "admin",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
};

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: true,
  role: "admin",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        state.role = action.payload.role;
      }
    },
    switchRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
      if (state.user) {
        state.user.role = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = "viewer";
    },
  },
});

export const { setUser, switchRole, logout } = authSlice.actions;
export default authSlice.reducer;

