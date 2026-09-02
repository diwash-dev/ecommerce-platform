import { createSlice } from "@reduxjs/toolkit";

const getStoredAuthState = () => {
  try {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userRaw = localStorage.getItem("user");

    if (
      !token ||
      token === "undefined" ||
      token === "null" ||
      !role ||
      !userRaw
    ) {
      return {
        role: "",
        User: null,
        isAuthenticated: false,
      };
    }

    const user = JSON.parse(userRaw);

    if (!user || user.role !== role) {
      return {
        role: "",
        User: null,
        isAuthenticated: false,
      };
    }

    return {
      role,
      User: user,
      isAuthenticated: true,
    };
  } catch {
    return {
      role: "",
      User: null,
      isAuthenticated: false,
    };
  }
};

const initialAuthState = getStoredAuthState();

const authSlice = createSlice({
  name: "auth",

  initialState: initialAuthState,

  reducers: {
    setUserLogin: (state, action) => {
      const userData = action.payload.user || action.payload.admin;
      const token = action.payload.token;

      if (!userData || !token) {
        state.role = "";
        state.User = null;
        state.isAuthenticated = false;
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return;
      }

      state.role = userData.role;
      state.User = userData;
      state.isAuthenticated = true;
      localStorage.setItem("role", userData.role);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
    },
    setUserLogout: (state) => {
      state.role = "";
      state.User = null;
      state.isAuthenticated = false;
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUserLogin, setUserLogout } = authSlice.actions;
export default authSlice.reducer;
