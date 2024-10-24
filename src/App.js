import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './component/Login';
import Signup from './component/Signup';
import Map from './component/Map';

// App 컴포넌트 asd
const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </Router>
  );
};

export default App;
