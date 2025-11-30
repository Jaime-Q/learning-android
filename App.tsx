import React, { useState } from 'react';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Splash from './src/screens/Splash';
import Home from './src/screens/Home';

export default function App() {

  const [showSplash, setShowSplash] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  if (isLoggedIn) {
    return <Home onLogout={() => setIsLoggedIn(false)} />;
  }

  if (showLogin) {
    return <Login onRegisterPress={() => setShowLogin(false)} onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return <Register onLoginPress={() => setShowLogin(true)} />;
}