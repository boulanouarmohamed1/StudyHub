"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { BookOpen, Lightbulb, HelpCircle, Send, LogIn, UserPlus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function LLMHomePage() {
  const [inputValue, setInputValue] = useState("")
  const [isInputFocused, setIsInputFocused] = useState(false)
  const sliderRef = useRef(null)
  const isInView = useInView(sliderRef, { amount: 0.5 })
  const controls = useAnimation()
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  }

  const inputVariants = {
    initial: { width: "200px", backgroundColor: "rgba(31, 41, 55, 0.5)" },
    focused: { width: "600px", backgroundColor: "rgba(31, 41, 55, 0.7)", transition: { duration: 0.5, ease: "easeInOut" } },
  }

  const slideVariants = {
    animate: {
      x: ["0%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "easeInOut",
        },
      },
    },
  }

  const featureCards = [
    {
      icon: BookOpen,
      title: "Past Exams & Solutions",
      description: "Access a vast library of past year exams with detailed solutions to prepare effectively.",
    },
    {
      icon: Lightbulb,
      title: "LLM Course Explanations",
      description: "Get clear, concise explanations for complex course topics from our intelligent language model.",
    },
    {
      icon: HelpCircle,
      title: "LLM Exam Explanations",
      description: "Get detailed explanations for exam questions you couldn’t understand, powered by our AI.",
    },
  ]

  const exampleQuestions = [
    "What is the difference between a stack and a queue?",
    "Can you explain how the binary search algorithm works?",
    "What is the time complexity of quicksort?",
    "How does a hash table work in data structures?",
    "What is the difference between TCP and UDP?",
    "Explain the concept of object-oriented programming with examples.",
    "What are the main types of machine learning algorithms?",
    "How does a compiler convert code into machine language?",
    "What is recursion, and when should it be used?",
    "Can you help me write a Python function to reverse a string?",
  ]

  useEffect(() => {
    if (isInView) {
      controls.start("animate")
    } else {
      controls.stop()
    }
  }, [isInView, controls])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted with input:", inputValue)
    if (inputValue.trim()) {
      try {
        const eventSource = new EventSource(
          `http://localhost:3001/chat?message=${encodeURIComponent(inputValue)}`
        )
        console.log("SSE connection initiated")
        eventSource.onopen = () => {
          console.log("SSE connection opened")
          eventSource.close()
          navigate(`/chat?message=${encodeURIComponent(inputValue)}`)
          setInputValue("")
        }
        eventSource.onerror = (err) => {
          console.error("SSE error:", err)
          alert("Failed to connect to chatbot. Redirecting to chat page.")
          eventSource.close()
          navigate(`/chat?message=${encodeURIComponent(inputValue)}`)
          setInputValue("")
        }
      } catch (error) {
        console.error("Error initiating SSE:", error)
        alert("Error sending message. Redirecting to chat page.")
        navigate(`/chat?message=${encodeURIComponent(inputValue)}`)
        setInputValue("")
      }
    } else {
      console.log("Input is empty, no action taken")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-black text-gray-100 font-sans relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
        initial={{ x: -100, y: -100 }}
        animate={{ x: 100, y: 100, rotate: 360 }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
        initial={{ x: 100, y: 100 }}
        animate={{ x: -100, y: -100, rotate: -360 }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 mb-12 lg:px-12">
        <motion.h1
          className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          StudyHub AI
        </motion.h1>
        <div className="flex space-x-4">
          <Link to="/LoginPage">
            <motion.button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium h-10 px-5 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </motion.button>
          </Link>
          <Link to="/SignUp">
            <motion.button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium h-10 px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-colors duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </motion.button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 lg:p-12 text-center pb-40">
        <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
          {/* Text Above Buttons */}
          <motion.div className="mb-8 space-y-2" variants={itemVariants}>
            <p className="text-6xl font-medium text-gray-300">Understand answers.</p>
            <p className="text-6xl font-medium text-gray-300">Master your courses.</p>
            <p className="text-6xl font-medium text-gray-300">Boost productivity.</p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div className="flex flex-col sm:flex-row gap-6 mb-8 justify-center" variants={containerVariants}>
            <Link to="/chat">
              <motion.button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-lg font-medium h-14 px-10 py-3 bg-white text-gray-900 hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                Try StudyHub
              </motion.button>
            </Link>
            <a
              href="https://drive.google.com/drive/folders/1IwKUdm8qoyTIY0BW1lLAZlWI90G--0sa?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-lg font-medium h-14 px-10 py-3 bg-transparent border border-gray-300 text-white hover:bg-white hover:text-gray-900 transition-colors duration-300 shadow-lg"
              onClick={(e) => {
                window.open(e.currentTarget.href, '_blank')
                e.preventDefault()
              }}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              See Past Exams
            </a>
          </motion.div>

          {/* Sliding Cards */}
          <motion.div className="mt-10 mb-20 w-full overflow-visible" variants={containerVariants} ref={sliderRef}>
            <motion.h3
              className="text-3xl lg:text-4xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-500"
              variants={itemVariants}
            >
              Ask StudyHub
            </motion.h3>
            <motion.div
              className="flex gap-4 w-full justify-center flex-nowrap"
              variants={slideVariants}
              animate={controls}
            >
              {[...exampleQuestions, ...exampleQuestions].map((question, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 flex-shrink-0 w-[20rem] text-center"
                  initial={{ opacity: 1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <p className="text-gray-300 text-sm">{question}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div className="mt-16 mb-20" variants={containerVariants}>
            <motion.h3
              className="text-3xl lg:text-4xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-500"
              variants={itemVariants}
            >
              Our Features
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featureCards.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 flex flex-col items-center text-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <feature.icon className="h-12 w-12 text-purple-400 mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

           {/* Fixed Input Field */}
           <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 w-full p-6 lg:p-8 flex justify-center bg-gradient-to-t from-black to-transparent"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <motion.div
          className="flex items-center rounded-full p-2 shadow-2xl border border-gray-700"
          variants={inputVariants}
          animate={isInputFocused ? "focused" : "initial"}
        >
          <form onSubmit={handleSubmit} className="flex items-center w-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Ask StudyHub..."
              className="flex-1 bg-transparent outline-none px-5 py-2 text-base text-gray-200 placeholder-gray-500"
            />
            <Link to={`/chat?message=${encodeURIComponent(inputValue)}`}>
              <motion.button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-medium h-10 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-colors duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </Link>
          </form>
        </motion.div>
      </motion.div>

      {/* Custom Tailwind Animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
