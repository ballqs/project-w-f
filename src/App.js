import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './component/Login';
import Signup from './component/Signup';
import Stores from './component/Stores';
import Payment from './component/Payment';
import Success from './component/Success';
import Fail from './component/Fail';

// App 컴포넌트 asd
const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/payment/:storeId/:datetime" element={<Payment />} /> {/* 결제 화면 라우트 */}
          <Route path="/payment/success" element={<Success />} /> {/* 결제 화면 라우트 */}
          <Route path="/payment/fail" element={<Fail />} /> {/* 결제 화면 라우트 */}
        </Routes>
      </Router>
  );
};

export default App;
