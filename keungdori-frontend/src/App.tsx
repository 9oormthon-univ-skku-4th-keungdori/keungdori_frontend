import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import GlobalStyles from './styles/GlobalStyles';

const App: React.FC = () => (
  <>
  <GlobalStyles></GlobalStyles>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
    </Routes>
  </>

);

export default App;
