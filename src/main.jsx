import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // This is the code I just gave you
import "./index.css"; // Your Tailwind/global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
