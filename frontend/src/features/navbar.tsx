"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { useState } from "react";
import { User, LogOut, Briefcase } from "lucide-react";
import { ModeToggle } from "./toggle-mode";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const isAuth = true;
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "" 
    // Add avatar URL if available
  };
  ;
  

  const logoutHandler = () => {
    // Perform logout logic here
    console.log("Logging out...");
  };

  return (
    <nav className="fixed w-full z-50 top-0 bg-background/80 border-b backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="shrink-0">
              <Link href="/">
                <h1 className="text-xl font-bold cursor-pointer">Job Portal</h1>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/jobs"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Jobs
            </Link>
          </div>

          {/* Auth Section */}
          {isAuth ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Link href="/profile">
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/my-jobs">
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Briefcase className="h-4 w-4" />
                        My Jobs
                      </Button>
                    </Link>
                  </div>

                  <div className="border-t pt-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            
            </div>
             
          )}

          <div>
              <ModeToggle/>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;