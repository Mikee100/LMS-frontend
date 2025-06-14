
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Mainpage/AuthContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
 
   <GoogleOAuthProvider clientId="100008764333-it4ngqjeqjdo0dq7ul4lkrrn3okmbbq5.apps.googleusercontent.com">
  <AuthProvider>
    <App />
  </AuthProvider>
</GoogleOAuthProvider>
)
