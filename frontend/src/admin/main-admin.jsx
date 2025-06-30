import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "../App.jsx";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css"; // این خط رو اضافه کن

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
