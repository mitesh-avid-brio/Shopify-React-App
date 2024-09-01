import './App.css';
import { useState } from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Inventory from './Components/Inventory'
import Customer from './Components/Customers'
import Search from './Components/Search'
import Orders from './Components/Orders'
import faqicon from './faq.png'
import Faq from './Components/FAQ'



function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFaq, setShowFaq] = useState(false);


  const showfaq = () => {
    setShowFaq(prevState => !prevState);
  }

  return (
    <div className="App">
      <div className="overlay"></div>
      <div className='header'>
          <h1 className='title'>Shopify Store Admin Panel</h1>
            <Search onSearch={(query) => setSearchQuery(query)} />
      </div>

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
              <Route path="/inventory" exact element={<Inventory searchQuery={searchQuery}/>} />
              <Route path="/customer" exact element={<Customer searchQuery={searchQuery}/>} />
              <Route path="/order" exact element={<Orders searchQuery={searchQuery}/>} />
          </Routes>
        </Router>
      </div>
    
      <div className='faq' onClick={showfaq}>
        <img src={faqicon} alt='faq' height={100} width={100}/>
      </div>

      {showFaq && <Faq showFaq={showFaq} setShowFaq={setShowFaq} />}
    </div>
  );
}

export default App;
