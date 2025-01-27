import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import CreateTrip from "./ai-trip-planner/CreateTrip.jsx";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ViewTrip from "./viewTrip/Viewtrip.jsx";
import Mytrips from "./mytrips/Mytrips.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import Footer from "./components/ui/custom/Footer.jsx";
import ChatRoom from "./chattingroom/ChatRoom.jsx";

function Root() {

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/create-trip",
      element: <CreateTrip/>,
    },
    {
      path: "/view-trip/:tripId",
      element: <ViewTrip  />,
    },
    {
      path: "/my-trips",
      element: <Mytrips  />,
    },
    {
      path : "/chat-room/:tripId",
      element: <ChatRoom  />
    }
  ]);
  

  return (
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTHETICATION_ID}>
        <RouterProvider router={routes} />
        <Footer/>
      </GoogleOAuthProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
