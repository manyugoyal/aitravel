import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import CreateTrip from "./create-trip/index.jsx";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ViewTrip from "./view-trip/[tripId]";
import MyTrips from "./my-trips";
import NotFound from "./404";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create-trip",
    element: <CreateTrip />,
  },
  {
    path: "/view-trip/:id",
    element: <ViewTrip />,
  },
  {
    path: "/my-trips",
    element: <MyTrips />,
  },
  {
    path: "/*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="12733916714-234kro0dvnh83snpt1o5n66av2utrle6.apps.googleusercontent.com">
    <Header />
    <Toaster />
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
);
