import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/css/index.css'
import App from './App.tsx'
import ReactDOM from "react-dom/client";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children:[
      
    ]
  },
  {
    path: "/mobile",
    element: <h1>under construction</h1>
  }
]);


const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <RouterProvider router={router} />,
);