
"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, Chrome, Sparkles, AlertCircle } from "lucide-react"

// Password strength indicator component (re-used from login)
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

// Error message component (re-used from login)
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

export default function DynamicSignup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Track mouse position for interactive effects on the form side
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

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+$/i.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

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
      const { name, value, type, checked } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
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

    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeToTerms: true,
    })

    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.8) {
            reject(new Error("Signup failed. Please try again."))
          } else {
            resolve()
          }
        }, 2000)
      })
      console.log("Form data:", formData)
      // Handle successful signup here
    } catch (error) {
      setErrors({ submit: error.message || "Something went wrong. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left side - Signup Form */}
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
                Create Account
              </h1>
              <p className="text-gray-400 mt-2">Join us and start your journey today</p>
            </motion.div>

            {/* Google signup button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 text-gray-100 font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-700/25 mb-6"
            >
              <Chrome className="w-5 h-5" />
              Sign up with Google
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-400">or sign up with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("firstName")}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/30 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
                    aria-invalid={errors.firstName ? "true" : "false"}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  />
                  <AnimatePresence>
                    <ErrorMessage message={errors.firstName} />
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="relative"
                >
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("lastName")}
                    className="w-full px-4 py-3 bg-gray-900/30 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
                    aria-invalid={errors.lastName ? "true" : "false"}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  />
                  <AnimatePresence>
                    <ErrorMessage message={errors.lastName} />
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Email field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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

              {/* Password field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
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
                <PasswordStrength password={formData.password} />
              </motion.div>

              {/* Confirm Password field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className="w-full pl-12 pr-12 py-3 bg-gray-900/30 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 rounded"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <AnimatePresence>
                  <ErrorMessage message={errors.confirmPassword} />
                </AnimatePresence>
              </motion.div>

              {/* Terms and conditions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="flex items-start text-sm"
              >
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("agreeToTerms")}
                  className="mr-3 mt-0.5 rounded bg-gray-800 border-gray-600 text-gray-600 focus:ring-gray-600"
                  aria-invalid={errors.agreeToTerms ? "true" : "false"}
                  aria-describedby={errors.agreeToTerms ? "terms-error" : undefined}
                />
                <label className="text-gray-400 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-gray-300 hover:text-gray-100 transition-colors underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-gray-300 hover:text-gray-100 transition-colors underline">
                    Privacy Policy
                  </a>
                </label>
              </motion.div>
              <AnimatePresence>
                <ErrorMessage message={errors.agreeToTerms} />
              </AnimatePresence>

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
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            {/* Sign in link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-6"
            >
              <p className="text-gray-400">
                Already have an account?{" "}
                <a href="#" className="text-gray-300 hover:text-gray-100 font-medium transition-colors">
                  Sign in
                </a>
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
