import Navbar from "./Navbar"
import Search from "./pages/Search"
import Favorites from "./pages/Favorites"
import { Route, Routes, Navigate } from "react-router-dom"


function App() {

  return (
    <>
      <Navbar />
      <br></br>
      <br></br>

      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/search" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
