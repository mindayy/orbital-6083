import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Products from './Pages/Products';
import Auth from './Components/Auth/Auth';
import Profile from './Pages/Profile';
import Search from './Pages/Search'; 
import AdvancedSearchForm from './Components/AdvancedSearchForm/AdvancedSearchForm'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/advanced-search" element={<AdvancedSearchForm />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
