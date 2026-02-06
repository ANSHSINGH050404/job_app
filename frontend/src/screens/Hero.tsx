'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Upload, Briefcase, Users, TrendingUp, CheckCircle2, FileText, Clock, Award } from 'lucide-react'

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 hero-glow" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">
          {/* Left Column - Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-white/80">Now Hiring for 2025</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="block text-white mb-2">Land Your</span>
              <span className="block text-gradient animate-gradient">
                First Dream Job
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              FreshHire connects ambitious freshers with top companies. 
              Upload your resume, track applications, and land interviews 
              at companies that value fresh talent.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-base font-semibold group transition-all duration-300 hover:scale-105"
              >
                <Upload className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Upload Resume
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Browse Jobs
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              {[
                { icon: Users, label: 'Active Users', value: '50K+' },
                { icon: CheckCircle2, label: 'Jobs Posted', value: '10K+' },
                { icon: TrendingUp, label: 'Success Rate', value: '85%' },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3 text-white/70">
                  <stat.icon className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main Dashboard Frame */}
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
              
              {/* Frame */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-1 glow-border">
                <div className="bg-black/50 rounded-xl overflow-hidden">
                  {/* Dashboard Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs text-white/60">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        FreshHire Dashboard
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6 space-y-4">
                    {/* Welcome Message */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-lg">Welcome back, Alex!</h3>
                        <p className="text-white/50 text-sm">You have 3 new notifications</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        A
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Applied', value: '12', color: 'from-blue-500/20 to-blue-600/20' },
                        { label: 'Interviews', value: '3', color: 'from-purple-500/20 to-purple-600/20' },
                        { label: 'Offers', value: '1', color: 'from-green-500/20 to-green-600/20' },
                      ].map((card, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg bg-gradient-to-br ${card.color} border border-white/10`}
                        >
                          <div className="text-2xl font-bold text-white">{card.value}</div>
                          <div className="text-xs text-white/60">{card.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-2">
                      <h4 className="text-white/80 text-sm font-medium">Recent Activity</h4>
                      {[
                        { icon: FileText, text: 'Applied to Google - SDE Intern', time: '2h ago' },
                        { icon: Clock, text: 'Interview scheduled at Meta', time: '5h ago' },
                        { icon: Award, text: 'Received offer from StartupX', time: '1d ago' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <activity.icon className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-white/90">{activity.text}</div>
                            <div className="text-xs text-white/50">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="absolute -left-8 top-20 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Application Sent!</div>
                    <div className="text-white/50 text-xs">to Microsoft</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: '1s' }}
                className="absolute -right-4 bottom-32 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">+250 Companies</div>
                    <div className="text-white/50 text-xs">hiring freshers</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: '2s' }}
                className="absolute left-10 -bottom-4 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-black"
                      />
                    ))}
                  </div>
                  <div className="text-white/80 text-xs">+1k joined today</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
