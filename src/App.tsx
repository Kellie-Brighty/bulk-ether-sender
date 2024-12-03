import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BulkSenderPage from "./pages/BulkSender";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/bulk-sender" element={<BulkSenderPage />} />
        </Routes>
      </Router>
    </>
  );
}
