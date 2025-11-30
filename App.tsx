import React, { useState } from 'react';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Splash from './src/screens/Splash';
import Home from './src/screens/Home';

// Definir la interfaz del usuario para usarla en el estado
interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile_number: string;
}

export default function App() {

  const [showSplash, setShowSplash] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  // Estado para almacenar los datos del usuario logueado
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  // Si hay un usuario en el estado, muestra la pantalla Home
  if (currentUser) {
    // Pasamos los datos del usuario y la función de logout a Home
    return <Home user={currentUser} onLogout={() => setCurrentUser(null)} />;
  }

  if (showLogin) {
    // onLoginSuccess ahora recibe el objeto 'user' y lo guarda en el estado
    return <Login onRegisterPress={() => setShowLogin(false)} onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return <Register onLoginPress={() => setShowLogin(true)} />;
}