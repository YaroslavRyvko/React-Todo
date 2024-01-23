import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import TodoList from "./pages/TodoList.js";
import Signup  from "./pages/SignUp.js";
import Login from "./pages/Login.js";
import Profile from "./pages/Profile.js";
import "./styles.css";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<TodoList />} />
        </Routes>
      </Router>
    </div>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);
