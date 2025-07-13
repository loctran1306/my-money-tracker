import {
  checkAndRefreshSession,
  resetPassword,
  signIn,
  signInWithGoogle,
  signOutUser,
  signUp,
} from '@/lib/supabase-auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';

// Types
export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

// Initial state
const initialState: UserState = {
  user: null,
  loading: true,
  error: null,
  initialized: false,
};

// Async thunks
export const initializeAuth = createAsyncThunk(
  'user/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { user } = await checkAndRefreshSession();
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const loginWithEmail = createAsyncThunk(
  'user/loginWithEmail',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { user, error } = await signIn(email, password);
      if (error) {
        return rejectWithValue(error);
      }
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const registerWithEmail = createAsyncThunk(
  'user/registerWithEmail',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { user, error } = await signUp(email, password);
      if (error) {
        return rejectWithValue(error);
      }
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'user/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const { user, error } = await signInWithGoogle();
      if (error) {
        return rejectWithValue(error);
      }
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await signOutUser();
      if (error) {
        return rejectWithValue(error);
      }
      return null;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const sendPasswordReset = createAsyncThunk(
  'user/sendPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await resetPassword(email);
      if (error) {
        return rejectWithValue(error);
      }
      return 'Password reset email sent';
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false; // Tự động set loading false khi có user state change
      state.initialized = true; // Đánh dấu đã initialized
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.initialized = true;
        if (action.payload) {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.initialized = true;
      })

      // Login with email
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload) {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register with email
      .addCase(registerWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload) {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload) {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        localStorage.removeItem('user');
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Password reset
      .addCase(sendPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPasswordReset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError, setLoading, setInitialized } =
  userSlice.actions;
export default userSlice.reducer;
