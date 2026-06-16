import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (location.state?.from) clearError();
  }, [location, clearError]);

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch { /* handled in hook */ }
  };

  return (
    <>
      <Helmet><title>Login — ShopNest</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-heading font-bold">Welcome Back</h1>
            <p className="text-textMuted text-sm mt-1">Sign in to your account</p>
          </div>
          <div className="card p-6">
            {error && <Alert type="error" message={error} onClose={clearError} />}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input {...register('email')} type="email" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary" placeholder="you@example.com" />
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input {...register('password')} type={showPassword ? 'text' : 'password'} className="w-full px-4 py-2.5 pr-10 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-primary">
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-border text-secondary focus:ring-secondary" />
                  <span className="text-textMuted">Remember me</span>
                </label>
                <button type="button" className="text-secondary hover:underline" onClick={() => alert('Password reset coming soon!')}>Forgot password?</button>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-textMuted">or continue with</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => alert('Google login coming soon!')} className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <span role="img" aria-label="google">🔵</span> Google
              </button>
              <button type="button" onClick={() => alert('Facebook login coming soon!')} className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <span role="img" aria-label="facebook">🔷</span> Facebook
              </button>
            </div>
            <p className="text-center text-sm text-textMuted mt-6">Don't have an account? <Link to="/register" className="text-secondary hover:underline font-medium">Register</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}
