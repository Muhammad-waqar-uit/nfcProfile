import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ProfilePage from "./pages/profile";
import HomePage from "./pages/homepage";
import ProfilePage from "./pages/Profile-card";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:profileId" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
