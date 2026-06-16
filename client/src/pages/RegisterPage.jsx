import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').matches(/[A-Z]/, 'Must contain at least 1 uppercase letter').matches(/[0-9]/, 'Must contain at least 1 number').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      navigate('/');
    } catch { /* handled in hook */ }
  };

  return (
    <>
      <Helmet><title>Register — ShopNest</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-heading font-bold">Create Account</h1>
            <p className="text-textMuted text-sm mt-1">Join ShopNest today</p>
          </div>
          <div className="card p-6">
            {error && <Alert type="error" message={error} onClose={clearError} />}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input {...register('name')} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" placeholder="John Doe" />
                {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input {...register('email')} type="email" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" placeholder="you@example.com" />
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input {...register('password')} type={showPassword ? 'text' : 'password'} className="w-full px-4 py-2.5 pr-10 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-primary">
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
                <p className="text-xs text-textMuted mt-1">Min 6 chars, 1 uppercase, 1 number</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <input {...register('confirmPassword')} type={showConfirm ? 'text' : 'password'} className="w-full px-4 py-2.5 pr-10 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-primary">
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-textMuted">or sign up with</span></div>
            </div>
            <button type="button" onClick={() => alert('Google sign up coming soon!')} className="w-full flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors mb-4">
              <span role="img" aria-label="google">🔵</span> Google
            </button>
            <p className="text-center text-sm text-textMuted">Already have an account? <Link to="/login" className="text-secondary hover:underline font-medium">Sign in</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}
