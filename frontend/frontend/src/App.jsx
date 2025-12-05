import { BrowserRouter, Routes, Route } from "react-router-dom";
import RFPChat from "./components/Chatcomponent";
import Proposal from "./components/proposalsComponent";
import Addvendors from "./components/AddVendors";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RFPChat />} />
        <Route path="/proposals" element={<Proposal />} />
        <Route path="/addvendors" element={<Addvendors />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
