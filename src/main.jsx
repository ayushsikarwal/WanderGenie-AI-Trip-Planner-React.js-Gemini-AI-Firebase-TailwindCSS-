import { StrictMode, useEffect, useState } from "react";
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
import BudgetingTool from "./budgetingtool/BudgetingTool.jsx";
import NewBudgetingTool from "./budgetingtool/NewBudgetingTool.jsx";
import Hotels from "./viewTrip/components/Hotes.jsx";
import BookingMain from "./booking/BookingMain.jsx" 
import HotelBooking from "./booking/HotelBooking.jsx";
import FlightBooking from "./booking/FlightBooking.jsx";
import SightSeeing from "./booking/SightSeeing.jsx";
import ViewDetailOfHotel from "./booking/ViewDetailOfHotel.jsx";
import Schedule from "./schedule/Schedule.jsx";
function Root() {

  // if (!data) return <div>Loading...</div>;

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/create-trip",
      element: <CreateTrip />,
    },
    {
      path: "/view-trip/:tripId",
      element: <ViewTrip />,
    },
    {
      path: "/my-trips",
      element: <Mytrips />,
    },
    {
      path: "/my-schedule/:tripId",
      element: <Schedule />,
    },
    {
      path: "/chat-room/:tripId",
      element: <ChatRoom />,
    },
    {
      path: "/budgeting-tool/:tripId",
      element: (
        <NewBudgetingTool/>
      ),
    },
    {
      path: "/booking/:tripId",
      element: (
        <BookingMain/>
      ),
    },
    {
      path: "/booking/hotels/:hotelId",
      element: (
        <ViewDetailOfHotel />
      ),
    },
    {
      path: "/booking/flight/:tripId",
      element: (
        <FlightBooking/>
      ),
    },
  ]);

  return (
    <StrictMode>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_AUTHETICATION_ID}
      >
        <RouterProvider router={routes} />
        {/* <Footer/> */}
      </GoogleOAuthProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
