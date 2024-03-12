import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GetWeather from "./pages/GetWeather";
import Weather from "./pages/Weather";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetWeather />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
