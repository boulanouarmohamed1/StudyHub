"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Chrome, Sparkles, AlertCircle } from "lucide-react"

// Password strength indicator component
const PasswordStrength = ({ password }) => {
  const getStrength = (password) => {
    if (!password) return { score: 0, text: "", color: "" }

    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    const levels = [
      { score: 0, text: "", color: "" },
      { score: 1, text: "Very Weak", color: "bg-red-500" },
      { score: 2, text: "Weak", color: "bg-orange-500" },
      { score: 3, text: "Fair", color: "bg-yellow-500" },
      { score: 4, text: "Good", color: "bg-blue-500" },
      { score: 5, text: "Strong", color: "bg-green-500" },
    ]

    return levels[score] || levels[0]
  }

  const strength = getStrength(password)

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded ${level <= strength.score ? strength.color : "bg-gray-700"}`}
          />
        ))}
      </div>
      <p className={`text-xs ${strength.color.replace("bg-", "text-")}`}>{strength.text}</p>
    </div>
  )
}

// Error message component
const ErrorMessage = ({ message }) => {
  if (!message) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 text-red-400 text-sm mt-1"
    >
      <AlertCircle className="w-4 h-4" />
      {message}
    </motion.div>
  )
}

export default function DynamicLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginMode, setLoginMode] = useState("signin")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Debounced mouse tracking for better performance
  const handleMouseMove = useCallback((e) => {
    const formContainer = document.querySelector(".form-container")
    if (formContainer) {
      const rect = formContainer.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }, [])

  useEffect(() => {
    const throttledMouseMove = (e) => {
      requestAnimationFrame(() => handleMouseMove(e))
    }

    window.addEventListener("mousemove", throttledMouseMove)
    return () => window.removeEventListener("mousemove", throttledMouseMove)
  }, [handleMouseMove])

  // Enhanced validation with better error messages
  const validateForm = useCallback(() => {
    const newErrors = {}

    if (loginMode === "signup" && !formData.name.trim()) {
      newErrors.name = "Full name is required"
    } else if (loginMode === "signup" && formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (loginMode === "signup" && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, loginMode])

  // Real-time validation on blur
  const handleBlur = useCallback(
    (field) => {
      setTouched((prev) => ({ ...prev, [field]: true }))

      if (touched[field]) {
        validateForm()
      }
    },
    [touched, validateForm],
  )

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }))
      }
    },
    [errors],
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({ name: true, email: true, password: true })

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call with better error handling
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random API failure for demo
          if (Math.random() > 0.8) {
            reject(new Error("Network error occurred"))
          } else {
            resolve()
          }
        }, 2000)
      })

      console.log("Form data:", formData)
      // Handle successful submission here
    } catch (error) {
      setErrors({ submit: error.message || "Something went wrong. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = useCallback(() => {
    setLoginMode((prev) => (prev === "signin" ? "signup" : "signin"))
    setFormData({ name: "", email: "", password: "" })
    setErrors({})
    setTouched({})
  }, [])

  const handleGoogleLogin = useCallback(() => {
    console.log("Google login clicked")
    // Implement Google OAuth here
  }, [])

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden form-container">
        {/* Interactive cursor glow */}
        <motion.div
          className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-gray-700/5 to-gray-600/5 blur-3xl pointer-events-none z-0"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-md mx-8"
        >
          {/* Glassmorphism card */}
          <div className="backdrop-blur-xl bg-gray-900/20 border border-gray-700/30 rounded-3xl p-8 shadow-2xl">
            {/* Header with animated logo */}
            <motion.div
              className="text-center mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl mb-4"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-8 h-8 text-gray-100" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                {loginMode === "signin" ? "Welcome Back" : "Join Us"}
              </h1>
              <p className="text-gray-400 mt-2">
                {loginMode === "signin" ? "Sign in to your account to continue" : "Create your account to get started"}
              </p>
            </motion.div>

            {/* Google login button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 text-gray-100 font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-700/25 mb-6 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-400">or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <AnimatePresence mode="wait">
                {loginMode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <input
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("name")}
                      className="w-full px-4 py-3 bg-gray-900/30 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    <AnimatePresence>
                      <ErrorMessage message={errors.name} />
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("email")}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/30 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                <AnimatePresence>
                  <ErrorMessage message={errors.email} />
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("password")}
                  className="w-full pl-12 pr-12 py-3 bg-gray-900/30 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <AnimatePresence>
                  <ErrorMessage message={errors.password} />
                </AnimatePresence>
                {loginMode === "signup" && <PasswordStrength password={formData.password} />}
              </motion.div>

              {loginMode === "signin" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center text-gray-400 cursor-pointer">
                    <input type="checkbox" className="mr-2 rounded bg-gray-800 border-gray-600 focus:ring-gray-600" />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded"
                  >
                    Forgot password?
                  </a>
                </motion.div>
              )}

              {/* Submit error */}
              <AnimatePresence>{errors.submit && <ErrorMessage message={errors.submit} />}</AnimatePresence>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-900 text-gray-100 font-semibold rounded-xl hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-gray-700/25"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-gray-100 border-t-transparent rounded-full mx-auto"
                  />
                ) : loginMode === "signin" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            {/* Toggle mode */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-6"
            >
              <p className="text-gray-400">
                {loginMode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={toggleMode}
                  className="text-gray-300 hover:text-gray-100 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded"
                >
                  {loginMode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-gray-700/10 to-gray-600/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-gray-800/10 to-gray-700/10 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.div>
      </div>

      {/* Right side - Video Background */}
      <div className="flex-1 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full h-full bg-black flex items-center justify-center"
        >
          {/* Placeholder for the video */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-400 text-center p-4">
            <p>Please provide a public URL for the video to display it here.</p>
            {/* Once you provide the URL, replace this div with the video tag: */}
            {
            <video
              src="../src/assets/A.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            }
          </div>
        </motion.div>
      </div>
    </div>
  )
}