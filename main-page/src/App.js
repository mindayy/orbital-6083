import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Products from './Pages/Products';
import Auth from './Components/Auth';
import Navbar from './Components/Navbar';
import './Components/Form.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/auth" element={<Auth/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
