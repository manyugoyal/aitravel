import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { GiHamburgerMenu } from "react-icons/gi";

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
    <header className='sticky top-0 z-50 bg-white shadow-sm'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        {/* Logo */}
        <a href='/' className='flex items-center'>
          <img src='/logo1.svg' alt='Logo' className='h-10' />
        </a>

        {/* Right side */}
        <div className='flex items-center gap-4'>
          {isLoggedIn ? (
            <>
              {/* Welcome (Desktop Only) */}
              {user && <span className='hidden lg:block text-gray-700 font-medium'>Welcome, {user.name}</span>}

              {/* Nav Buttons (Desktop Only) */}
              <div className='hidden md:flex gap-3'>
                <a href='/create-trip'>
                  <Button variant='default'>+ Create Trip</Button>
                </a>
                <a href='/my-trips'>
                  <Button variant='outline'>My Trips</Button>
                </a>
              </div>

              {/* Mobile Hamburger */}
              <div className='md:hidden'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='h-9 w-9'>
                      <GiHamburgerMenu className='h-5 w-5' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56'>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href='/create-trip' className='w-full'>
                        <Button className='w-full justify-start'>Create Trip</Button>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href='/my-trips' className='w-full'>
                        <Button variant='outline' className='w-full justify-start'>
                          My Trips
                        </Button>
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Profile Picture */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className='rounded-full overflow-hidden h-10 w-10 ring-2 ring-gray-200 hover:ring-primary transition-all focus:outline-none focus:ring-primary'>{user?.picture ? <img src={user.picture} alt='Profile' className='h-full w-full object-cover' /> : <div className='h-full w-full bg-gray-300 flex items-center justify-center text-gray-600'>{user?.name?.charAt(0) || "U"}</div>}</button>
                </PopoverTrigger>
                <PopoverContent className='w-48 p-2' align='end'>
                  <div className='flex flex-col gap-2'>
                    <div className='text-sm text-gray-500 px-2 py-1'>{user?.email}</div>
                    <Button variant='destructive' className='w-full' onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <Button onClick={() => setOpenDialog(true)}>Sign in</Button>
          )}
        </div>
      </div>

      {/* Sign In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogDescription>
              <div className='flex flex-col items-center py-4 space-y-4'>
                <img src='/logo3.png' alt='Logo' className='rounded-xl h-24 w-auto' />
                <Button onClick={login}>Sign in with Google</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default Header;
