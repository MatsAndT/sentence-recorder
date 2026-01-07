import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import Task from "./components/Task";
import Tasks from "./components/Tasks";
import Finished from "./components/Finished";
import NoMatch from "./components/NoMatch";

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Tasks />} />
        <Route path="/task/:taskId" element={<Task />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/finished" element={<Finished />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
};

export default App;
