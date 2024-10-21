import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Home from './screens/home';
import Discover from './screens/discover';
import Login from './screens/login';
import Signup from './screens/signup';
import Challenge from './screens/challenge';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/discover" element={<Discover />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/challenge/:id" element={<Challenge />} />
          {/* Add other routes as needed */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
