'use client'

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Hero from "@/screens/Hero";

// Lazy load CarrerGuid component with loading fallback
const CarrerGuid = dynamic(() => import("@/screens/Carrer-guid"), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20" />
        <div className="w-48 h-4 bg-white/10 rounded" />
        <div className="w-32 h-3 bg-white/5 rounded" />
      </div>
    </div>
  ),
  ssr: false
});

// Loading skeleton component
const SectionSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950">
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="animate-pulse space-y-8">
        <div className="flex justify-center">
          <div className="w-48 h-8 bg-white/10 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/10" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
   <div>
    <Hero/>
    <Suspense fallback={<SectionSkeleton />}>
      <CarrerGuid/>
    </Suspense>
   </div>
  );
}
