import "./App.css";
import Home from "./Pages/Home.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Home />
    </>
  );
}

export default App;
