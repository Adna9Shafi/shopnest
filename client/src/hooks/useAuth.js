import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, logoutUser, fetchProfile, updateProfile, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);

  const login = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.name}!`);
      return result.payload;
    } else {
      toast.error(result.payload || 'Login failed');
      throw new Error(result.payload);
    }
  };

  const register = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      return result.payload;
    } else {
      toast.error(result.payload || 'Registration failed');
      throw new Error(result.payload);
    }
  };

  const logout = () => {
    dispatch(logoutUser());
    toast.success('Logged out');
  };

  const getProfile = async () => {
    const result = await dispatch(fetchProfile());
    if (fetchProfile.fulfilled.match(result)) return result.payload;
  };

  const update = async (data) => {
    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated');
      return result.payload;
    } else {
      toast.error(result.payload || 'Update failed');
      throw new Error(result.payload);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    register,
    logout,
    fetchProfile: getProfile,
    updateProfile: update,
    clearError: () => dispatch(clearError()),
  };
}
