'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, FileCheck, CheckCircle2, Lightbulb, Star } from 'lucide-react'

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

interface ResumeAnalysisModalProps {
  analysisResult: AnalysisResult
  onClose: () => void
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'from-green-400 to-emerald-400'
  if (score >= 60) return 'from-yellow-400 to-orange-400'
  if (score >= 40) return 'from-orange-400 to-red-400'
  return 'from-red-400 to-red-600'
}

const getScoreText = (score: number) => {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Needs Improvement'
  return 'Poor'
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/20 text-red-300 border-red-500/30'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    case 'low':
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
  }
}

export default function ResumeAnalysisModal({ analysisResult, onClose }: ResumeAnalysisModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Resume Analysis</h2>
              <p className="text-sm text-slate-400">AI-powered ATS evaluation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 space-y-8">
          {/* Overall Score */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreColor(analysisResult.atsScore)} p-1`}>
                <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{analysisResult.atsScore}</span>
                  <span className="text-xs text-slate-400">/100</span>
                </div>
              </div>
              <span className={`mt-3 text-lg font-semibold bg-gradient-to-r ${getScoreColor(analysisResult.atsScore)} bg-clip-text text-transparent`}>
                {getScoreText(analysisResult.atsScore)}
              </span>
            </div>
            <p className="mt-4 text-slate-300 max-w-2xl mx-auto">{analysisResult.summary}</p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analysisResult.scoreBreakdown).map(([key, value]) => (
              <div key={key} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400 capitalize">{key}</span>
                  <span className={`text-lg font-bold bg-gradient-to-r ${getScoreColor(value.score)} bg-clip-text text-transparent`}>
                    {value.score}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{value.feedback}</p>
              </div>
            ))}
          </div>

          {/* Strengths */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {analysisResult.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Suggestions for Improvement</h3>
            </div>
            <div className="space-y-3">
              {analysisResult.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority}
                        </span>
                        <span className="text-sm font-medium text-slate-300">{suggestion.category}</span>
                      </div>
                      <p className="text-white font-medium mb-1">{suggestion.issue}</p>
                      <p className="text-sm text-slate-400">{suggestion.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 px-8 py-6 bg-gradient-to-r from-slate-900 to-slate-950 border-t border-white/10">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl py-4 text-lg"
          >
            Got it!
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
