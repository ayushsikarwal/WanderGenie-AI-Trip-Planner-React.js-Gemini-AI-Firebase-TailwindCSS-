import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./components/ui/custom/Hero.jsx";
import Header from "./components/ui/custom/Header";

function App({logOut}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (logOut) {
      navigate("/"); // Redirect to the desired route on logout
    }
  }, [logOut, navigate]);

  return (
    <>
      <Header />
      <Hero />
    </>
  );
}

export default App;
