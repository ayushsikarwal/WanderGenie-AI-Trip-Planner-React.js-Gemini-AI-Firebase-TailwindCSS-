import React, { useState } from "react";
import { Button } from "../button.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { toast } from "@/hooks/use-toast.js";

function Header() {
  const [signUp, setSignUp] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const signIn = useGoogleLogin({
    onSuccess: (tokenResponse) => getUserInfo(tokenResponse),
    onError: (error) => console.log(error),
    flow: "implicit", // Make sure this is correct for your setup
    // redirect_uri: "https://sikarwalstripplanner.vercel.app/", // Ensure this matches your Google Console config
  });

  const getUserInfo = (tokenResponse) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((response) => {
        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData); // Update user state
        setSignUp(false);
        toast.success("Signed up successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Sign-up failed. Please try again.");
      });
  };

  const logOut = () => {
    googleLogout();
    localStorage.clear();
    setUser(null); // Clear user state
    toast.info("Logged out successfully.");
  };

  return (
    <div className="p-3 flex items-center px-5 justify-between shadow-md">
      <img src="/logo.svg" alt="Logo" />

      <Dialog open={signUp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign up to proceed</DialogTitle>
            <DialogDescription>
              <h2>Please sign up to continue</h2>
              <Button onClick={signIn}>
                <FcGoogle />
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {!user ? (
        <div>
          <Button
            onClick={() => setSignUp(true)}
            className="rounded-full"
          >
            Sign Up
          </Button>
        </div>
      ) : (
        <div className="flex gap-3">
          <a href="/create-trip">
          <Button variant='outline' className="rounded-full bg-white text-black border-l-red-600 font-extrabold">
            + Create Trip
          </Button>
          </a>
          <a href="/my-trips">
          <Button variant='outline' className="rounded-full bg-white text-black border-l-red-600 font-extrabold">
            My Trips
          </Button>
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <img
                className="rounded-full w-[40px] h-[40px] cursor-pointer"
                src={user.picture}
                alt="User Avatar"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={logOut}><a href="/">Log Out</a></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

export default Header;
