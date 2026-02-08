"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { useState, useEffect } from "react";
import { User, LogOut, Briefcase, Menu, X, Sparkles, ChevronDown } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAuth = true;
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "" 
  };

  // Track scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutHandler = () => {
    console.log("Logging out...");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Find Jobs" },
    { href: "/companies", label: "Companies" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled 
          ? "bg-gradient-to-br from-indigo-950/95 via-slate-900/95 to-purple-950/95 backdrop-blur-xl border-b border-white/10" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-40" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                PathForge
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button 
                  variant="ghost" 
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4 text-sm font-medium transition-all duration-300"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
 
          

            {/* Auth Section */}
            {isAuth ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 pl-2 pr-3 rounded-full hover:bg-white/10 border border-white/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 ring-2 ring-white/20 group-hover:ring-blue-500/50 transition-all">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 bg-black/90 backdrop-blur-xl border-white/10" align="end">
                  <div className="flex flex-col">
                    {/* User Info */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-white/20">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-white/50">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="p-2">
                      <Link href="/profile">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Button>
                      </Link>
                      <Link href="/my-jobs">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                        >
                          <Briefcase className="h-4 w-4" />
                          My Applications
                        </Button>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-white/10">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                        onClick={logoutHandler}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    className="bg-white text-black hover:bg-white/90 rounded-full px-6 font-semibold"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={link.href} onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                    >
                      {link.label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
              
              {!isAuth && (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10 rounded-full"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button 
                      className="w-full bg-white text-black hover:bg-white/90 rounded-full font-semibold"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
