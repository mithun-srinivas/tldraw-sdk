import { BrowserRouter, Route, Routes } from "react-router";
import Error from "./pages/404/Error";
import Collab from "./pages/collab/Collab";
import Home from "./pages/home/Home";
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collab" element={<Error />} />
      <Route path="/collab/:key" element={<Collab />} />
    </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
