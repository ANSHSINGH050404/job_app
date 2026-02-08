'use client'

import React, { useState,useEffect } from 'react'
import { auth_services, useAppData } from '@/context/AppContext'
import { redirect, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const { isAuth, setIsAuth, setUser, loading, setLoading } = useAppData()
  const router = useRouter()

  useEffect(() => {
  if (isAuth) {
    router.push('/')
  }
}, [isAuth, router])

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    setBtnLoading(true)
    setLoading(true)

    try {
      const { data } = await axios.post(`${auth_services}/api/auth/login`, {
        email,
        password,
      })

      toast.success(data.message)
      Cookies.set('token', data.token, {
        expires: 15,
        secure: true,
        path: '/',
      })
      setUser(data.user)
      setIsAuth(true)
      router.push('/')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
      setLoading(false)
      setIsAuth(false)
    } finally {
      setBtnLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-[120px]"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />

        {/* Card */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/30"
            >
              <Rocket className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
            <p className="text-slate-400">Login to continue your job search</p>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm mt-4">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-300">
                Join 50,000+ Freshers
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={loginHandler} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
                />
                <span className="text-slate-400">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={btnLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl px-8 py-6 text-lg shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02] group border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {btnLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                <>
                  <span>Login to FreshHire</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform inline-block" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/50 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>

            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">Don&apos;t have an account? </span>
            <Link
              href="/signup"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Sign up for free
            </Link>
          </div>
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-slate-400 text-sm">
            🔒 Secure login • Trusted by 50,000+ freshers
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage