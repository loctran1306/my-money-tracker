import { RootState } from '@/store';

// User selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserInitialized = (state: RootState) =>
  state.user.initialized;

// Computed selectors
export const selectIsAuthenticated = (state: RootState) => !!state.user.user;
export const selectUserId = (state: RootState) => state.user.user?.id;
export const selectUserEmail = (state: RootState) => state.user.user?.email;

// Auth status selector
export const selectAuthStatus = (state: RootState) => ({
  isAuthenticated: !!state.user.user,
  loading: state.user.loading,
  initialized: state.user.initialized,
  error: state.user.error,
});
