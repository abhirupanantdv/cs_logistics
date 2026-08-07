//LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getFileUrl } from '@/config/constants'
import Navbar from '@/components/layout/Navbar'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await login(
        form.email,
        form.password
      )

      console.log('Login Response:', response)
      console.log('User:', response.user)

      navigate('/dashboard')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Invalid username or password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* Project Navbar */}
      <Navbar variant="auth" />

      {/* Main Content - Fits exactly in remaining viewport height */}
      <main className="flex-1 p-3 md:p-4 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">

          {/* Content Area */}
          <div className="flex-1 px-4 md:px-6 pt-4 pb-4 overflow-hidden">
            <div className="h-full bg-slate-50 rounded-[28px] overflow-hidden grid lg:grid-cols-[1.15fr_0.85fr]">


              {/* Left Image Section */}
              <div className="hidden lg:block h-full">
                {/* 
    Use the same light background color as the parent container
    so any transparent/empty area in the image blends seamlessly.
  */}
                <div className="h-full w-full rounded-3xl overflow-hidden bg-slate-50">
                  <img
                    src={getFileUrl('login_image.png')}
                    alt="CS Logistics"
                    className="w-full h-full rounded-3xl block"
                    style={{
                      /*
                        objectFit: cover
                        - Fills the entire available area.
                        - Removes the grey band at the top by eliminating unused space.
                        - Slightly crops the image if necessary.

                        objectPosition: center
                        - Keeps the image centered.

                        backgroundColor: transparent
                        - No background color behind the image.
                      */
                      objectFit: 'cover',
                      objectPosition: 'center',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
              </div>

              {/* Right Login Section */}
              <div className="bg-white px-8 lg:px-12 py-6 flex flex-col justify-center">
                {/* Inner Wrapper with max width for better alignment */}
                <div className="w-full max-w-[460px] mx-auto">
                  {/* Title */}
                  {/* <h1 className="text-5xl font-bold text-slate-900 mb-3 leading-tight">
          Welcome back
        </h1> */}

                  {/* Subtitle */}
                  {/* <p className="text-slate-500 text-lg mb-10">
          Sign in to continue to CS Logistics
        </p> */}

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px]
font-semibold">
                      {error}
                    </div>
                  )}
                  <div className="mb-8">
                    <h1 className="text-[30px] font-bold text-[#0B2257] leading-tight">
                      Welcome Back
                    </h1>

                    <p className="mt-2 text-[14px] text-slate-500">
                      Sign in to continue to CS Logistics
                    </p>
                  </div>
                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                      <label className="block text-[13px]
font-semibold font-medium text-slate-700 mb-2">
                        Email or username
                      </label>
                      <input
                        type="text"
                        placeholder="you@company.com"
                        className="
w-full
h-[52px]
border
border-slate-300
rounded-xl
px-4
text-[14px]
text-slate-700
placeholder-slate-400
focus:outline-none
focus:ring-2
focus:ring-[#0B2257]
focus:border-[#0B2257]
transition
"
                        value={form.email}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[13px]
font-semibold font-medium text-slate-700">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[13px] font-semibold text-[#006B82] hover:text-[#00596c] transition-colors"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>

                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="
w-full
h-[52px]
border
border-slate-300
rounded-xl
px-4
text-[14px]
text-slate-700
placeholder-slate-400
focus:outline-none
focus:ring-2
focus:ring-[#0B2257]
focus:border-[#0B2257]
transition
"
                        value={form.password}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Remember Me + Forgot Password */}
                    {/* <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 text-slate-600 text-[13px]
font-semibold">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-[13px]
font-semibold text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Forgot password?
            </button>
          </div> */}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="
    w-full
    h-[54px]
    bg-[#0B2257]
    hover:bg-[#07173D]
    disabled:opacity-50
    disabled:cursor-not-allowed
    text-white
    rounded-xl
    font-semibold
    text-[15px]
    shadow-md
    transition-all
  "
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-8 md:px-12 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-[13px]
font-semibold text-slate-500 shrink-0">
            <div>© 2026 CS Logistics — All rights reserved</div>

            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-700">
                Terms
              </a>
              <a href="#" className="hover:text-slate-700">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-700">
                Contact
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

