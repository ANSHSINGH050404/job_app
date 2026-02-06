'use client'

import { useState, useRef, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Upload, Briefcase, Users, TrendingUp, CheckCircle2, FileText, Clock, Award, Sparkles, ArrowRight, Zap, Target, Rocket, Loader2, AlertCircle } from 'lucide-react'

// Lazy load ResumeAnalysisModal - only loaded when needed
const ResumeAnalysisModal = lazy(() => import('@/components/ResumeAnalysisModal'))

// Types for resume analysis response
interface ScoreBreakdown {
  formatting: { score: number; feedback: string }
  keywords: { score: number; feedback: string }
  structure: { score: number; feedback: string }
  readability: { score: number; feedback: string }
}

interface Suggestion {
  category: string
  issue: string
  recommendation: string
  priority: 'high' | 'medium' | 'low'
}

interface AnalysisResult {
  atsScore: number
  scoreBreakdown: ScoreBreakdown
  suggestions: Suggestion[]
  strengths: string[]
  summary: string
}

const Hero = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showModal, setShowModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  }

  // Upload handlers
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file only')
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      // Call the resume analyzer API
      const response = await fetch('http://localhost:5001/api/utils/resume-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64: base64 }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze resume')
      }

      const data: AnalysisResult = await response.json()
      setAnalysisResult(data)
      setShowModal(true)
    } catch (error: any) {
      setUploadError(error.message || 'Failed to analyze resume. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }

        /* Grid background pattern */
        .grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          {/* Energetic Gradient Orbs */}
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
          <motion.div 
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-[100px]"
          />
          
          {/* Grid Pattern - Fixed for Next.js */}
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
            
            {/* Left Column - Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              {/* Energetic Badge */}
              <motion.div 
                variants={itemVariants} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm mb-6"
              >
                <Rocket className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-sm font-semibold text-green-300">
                  🎓 Join 50,000+ Freshers Getting Hired
                </span>
              </motion.div>

              {/* Powerful Headline for Freshers */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
              >
                <span className="block text-white mb-2">
                  Your First Job
                </span>
                <span className="block">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    Starts Here
                  </span>
                  <motion.span
                    animate={{
                      rotate: [0, 14, -8, 14, -4, 10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    className="inline-block ml-3 text-5xl"
                  >
                    🚀
                  </motion.span>
                </span>
              </motion.h1>

              {/* Fresher-Focused Description */}
              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                Fresh graduate? No experience? <span className="text-cyan-400 font-semibold">No problem!</span> 
                {' '}Connect with 250+ companies actively hiring freshers. Upload your resume, 
                get instant matches, and land your dream role in 2025.
              </motion.p>

              {/* Clear CTAs */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
              >
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,application/pdf"
                  className="hidden"
                />

                <Button
                  size="lg"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-2xl px-8 py-6 text-lg shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02] group border-0 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      Upload Resume - It&apos;s Free
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/40 rounded-2xl px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Browse Entry-Level Jobs
                </Button>

                {/* Error Message */}
                <AnimatePresence>
                  {uploadError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-red-300">{uploadError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Trust Indicators for Freshers */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-8 justify-center lg:justify-start items-center"
              >
                {[
                  { icon: Users, label: 'Freshers Hired', value: '50K+', gradient: 'from-blue-400 to-cyan-400' },
                  { icon: Briefcase, label: 'Entry Jobs', value: '10K+', gradient: 'from-purple-400 to-pink-400' },
                  { icon: Zap, label: 'Avg. Response', value: '24hrs', gradient: 'from-green-400 to-emerald-400' },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main Dashboard */}
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                
                {/* Dashboard Frame */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-1 shadow-2xl">
                  <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-xl overflow-hidden">
                    
                    {/* Browser Header */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs text-white/70">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          freshhire.com/dashboard
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="p-6 space-y-5">
                      
                      {/* Welcome Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-bold text-lg">Hey Priya! 👋</h3>
                          <p className="text-slate-400 text-sm">Ready to apply today?</p>
                        </div>
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                            P
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-1 border-2 border-slate-900">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Application Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Applied', value: '8', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', emoji: '📝' },
                          { label: 'Shortlisted', value: '2', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', emoji: '⭐' },
                          { label: 'Interview', value: '1', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', emoji: '🎯' },
                        ].map((card, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-xl bg-gradient-to-br ${card.color} border ${card.border} hover:scale-105 transition-transform cursor-default`}
                          >
                            <div className="text-2xl mb-1">{card.emoji}</div>
                            <div className="text-2xl font-bold text-white">{card.value}</div>
                            <div className="text-xs text-white/70">{card.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Recent Applications */}
                      <div className="space-y-2">
                        <h4 className="text-white/80 text-sm font-semibold">Recent Activity</h4>
                        {[
                          { 
                            company: 'Google', 
                            role: 'Software Engineer - Fresher', 
                            time: '2 hours ago', 
                            status: 'Applied',
                            logo: '🔵',
                            statusColor: 'blue'
                          },
                          { 
                            company: 'Razorpay', 
                            role: 'Frontend Developer - Entry', 
                            time: '5 hours ago', 
                            status: 'Shortlisted',
                            logo: '💙',
                            statusColor: 'purple'
                          },
                          { 
                            company: 'Zomato', 
                            role: 'Product Intern', 
                            time: '1 day ago', 
                            status: 'Interview',
                            logo: '🔴',
                            statusColor: 'green'
                          },
                        ].map((job, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xl flex-shrink-0">
                              {job.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                                {job.company}
                              </div>
                              <div className="text-xs text-slate-400 truncate">{job.role}</div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                job.statusColor === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                                job.statusColor === 'purple' ? 'bg-purple-500/20 text-purple-300' :
                                'bg-green-500/20 text-green-300'
                              }`}>
                                {job.status}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">{job.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Success Cards */}
                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  className="absolute -left-8 top-20 bg-gradient-to-br from-green-500/90 to-emerald-500/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl max-w-[200px]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Congrats! 🎉</div>
                      <div className="text-white/90 text-xs mt-1">You got an interview at Flipkart!</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  style={{ animationDelay: '1s' }}
                  className="absolute -right-6 bottom-32 bg-gradient-to-br from-cyan-500/90 to-blue-500/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">250+ Companies</div>
                      <div className="text-white/90 text-xs">hiring freshers now</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  style={{ animationDelay: '2s' }}
                  className="absolute left-8 -bottom-6 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['🧑‍💼', '👨‍💻', '👩‍💼'].map((emoji, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-slate-900 flex items-center justify-center text-xs"
                        >
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <div className="text-white text-xs font-semibold">+500 joined today</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Resume Analysis Modal - Lazy Loaded */}
      <AnimatePresence>
        {showModal && analysisResult && (
          <Suspense fallback={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin" />
                <p className="text-white font-medium">Loading analysis...</p>
              </div>
            </motion.div>
          }>
            <ResumeAnalysisModal 
              analysisResult={analysisResult} 
              onClose={() => setShowModal(false)} 
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  )
}

export default Hero