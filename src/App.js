import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Inventory from './Components/Inventory'
import Customer from './Components/Customers'
import Orders from './Components/Orders'



function App() {
  return (
    <div className="App">
       <div className="overlay"></div>
      <h1 className='title'>Shopify Store Admin Panel</h1>
      <div className='content'>
        <Router>
                <ul className='button_container'>
                    <li>
                        <Link to="/inventory" className='buttons'> Products </Link>
                    </li>
                    <li>
                        <Link to="/customer" className='buttons'> Customers </Link>
                    </li>
                    <li>
                        <Link to="/order" className='buttons'> Orders </Link>
                    </li>
                </ul>
                <Routes>
                    <Route path="/inventory" exact element={<Inventory />} />
                    <Route path="/customer" exact element={<Customer />} />
                    <Route path="/order" exact element={<Orders />} />
                </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
