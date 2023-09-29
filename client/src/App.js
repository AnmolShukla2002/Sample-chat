import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage.js";
import ChatPage from "./pages/chatPage.js";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/chats" Component={ChatPage} />
      </Routes>
    </div>
  );
}

export default App;
