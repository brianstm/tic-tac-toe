import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import GameLayout from "./Pages/GameLayout";
import "./App.css";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:gameCode" element={<GameLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
