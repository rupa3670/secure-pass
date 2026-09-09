import React from "react";
import { Button } from "@heroui/react";
import { FaShieldAlt, FaArrowRight, FaInfoCircle } from "react-icons/fa";
import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="relative min-h-screen bg-[#090d16] text-white flex flex-col justify-between overflow-hidden">
      
      {/* Navbar / Header */}

      {/* Hero Banner Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        
        {/* Left Side: Text & Actions */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6">
          
          {/* Title Badge as requested */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-semibold tracking-wider uppercase shadow-inner shadow-cyan-900/50">
            <FaShieldAlt className="text-cyan-400" />
            <span>Secure Pass</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Guardians of Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Digital Identity.</span>
          </h1>

          {/* Description */}
          <p className="text-slate-400 text-base sm:text-lg max-w-lg leading-relaxed">
            Robust security infrastructure ensuring seamless and protected user authentication across all your digital platforms.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all flex items-center gap-2"
              endContent={<FaArrowRight className="text-xs" />}
            >
              Get Started
            </Button>

            <Button 
              variant="bordered" 
              className="border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 font-medium px-6 py-3 rounded-xl transition-all flex items-center gap-2 bg-slate-900/40"
              startContent={<FaInfoCircle className="text-slate-400" />}
            >
              Learn More
            </Button>
          </div>

        </div>

        {/* Right Side: Security Graphic / Image Banner */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          {/* Glowing backdrop effect */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden border border-cyan-900/40 shadow-2xl shadow-cyan-950">
            <Image 
              src="/assets/hero.png" 
              alt="Secure Pass Cybersecurity Illustration" 
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

      </div>

      {/* Decorative Bottom Curve/Fade */}
      <div className="w-full h-12 bg-gradient-to-t from-[#05080f] to-transparent z-10" />
    </section>
  );
}