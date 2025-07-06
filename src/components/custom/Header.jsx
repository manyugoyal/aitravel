import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle
} from "../ui/dialog";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiPlus, FiMap, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => getUserProfile(tokenResponse),
    onError: (error) => console.error("Login Failed:", error),
  });

  const getUserProfile = async (token) => {
    try {
      const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          Accept: "application/json",
        },
      });
      const userData = res.data;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSignOut = () => {
    googleLogout();
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.a
          href="/"
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/logo4.png" alt="Logo" className="h-16 w-auto drop-shadow-md" />
          <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent hidden sm:block">
            AI Travel
          </span>
        </motion.a>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="hidden lg:block text-gray-700 dark:text-gray-300 font-medium">
                Welcome, <span className="font-semibold text-teal-600 dark:text-teal-400">{user.name}</span>
              </div>

              {/* Desktop Buttons */}
              <div className="hidden md:flex gap-3">
                <motion.a href="/create-trip" whileHover={{ scale: 1.03 }}>
                  <Button variant="default" className="gap-2 shadow bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500">
                    <FiPlus className="h-4 w-4" />
                    Create Trip
                  </Button>
                </motion.a>
                <motion.a href="/my-trips" whileHover={{ scale: 1.03 }}>
                  <Button variant="outline" className="gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <FiMap className="h-4 w-4" />
                    My Trips
                  </Button>
                </motion.a>
              </div>

              {/* Mobile Hamburger */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <GiHamburgerMenu className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
                    <DropdownMenuItem asChild className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <a href="/create-trip" className="w-full">
                        <Button className="w-full gap-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500">
                          <FiPlus className="h-4 w-4" /> Create Trip
                        </Button>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <a href="/my-trips" className="w-full">
                        <Button variant="outline" className="w-full gap-2 border-gray-300 dark:border-gray-600">
                          <FiMap className="h-4 w-4" /> My Trips
                        </Button>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Button
                        variant="ghost"
                        className="w-full gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={handleSignOut}
                      >
                        <FiLogOut className="h-4 w-4" /> Sign Out
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Profile */}
              <Popover>
                <PopoverTrigger asChild>
                  <motion.button
                    className="rounded-full h-10 w-10 overflow-hidden ring-2 ring-teal-500/20 hover:ring-teal-500/40 transition"
                    whileHover={{ scale: 1.1 }}
                  >
                    {user?.picture ? (
                      <img src={user.picture} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white flex items-center justify-center h-full w-full font-medium">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </motion.button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" align="end">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full h-10 w-10 overflow-hidden ring-2 ring-teal-500/30">
                        {user?.picture ? (
                          <img src={user.picture} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white flex items-center justify-center h-full w-full font-medium">
                            {user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2 mt-2 text-red-500 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleSignOut}
                    >
                      <FiLogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                onClick={() => setOpenDialog(true)}
                className="bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg hover:from-teal-500 hover:to-blue-500"
              >
                Sign In
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-800 dark:text-white">
              Welcome to AI Travel
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
              Sign in to create and manage your personalized trips
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 space-y-4">
            <motion.img
              src="/logo4.png"
              alt="Logo"
              className="h-24 w-auto rounded-xl shadow-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <Button
              onClick={login}
              className="w-full gap-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" />
              Sign in with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default Header;