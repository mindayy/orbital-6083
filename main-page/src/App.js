import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Products from './Pages/Products';
import Auth from './Components/Auth/Auth';
import ProfilePage from './Components/ProfilePage/ProfilePage';
import Search from './Pages/Search'; 



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
