import React from "react";
import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

import { Route as rootRoute } from "./routes/__root";
import { Route as homeRoute } from "./routes/home";
import { Route as roadmapRoute } from "./routes/index";
import { Route as trackerRoute } from "./routes/tracker";
const routeTree = rootRoute.addChildren([homeRoute, roadmapRoute, trackerRoute]);

const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
