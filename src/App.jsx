import { Route, Routes } from "react-router-dom";
import Login from "./componets/Login";
import HomePage from "./page/HomePage";
import { ProtectedRoute } from "./ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
