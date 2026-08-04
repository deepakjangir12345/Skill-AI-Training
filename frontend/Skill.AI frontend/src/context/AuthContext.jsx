import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import WhatsAppFloating from '../components/WhatsAppFloating'
import LoadingSpinner from "../components/LoadingSpinner";
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token");

if (token) {
  verifyToken(token);
} else {
  setLoading(false);
}
  }, [])

  const verifyToken = async (token) => {
    try {
      const response = await api.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(response.data.user)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token } = response.data;

    localStorage.setItem("token", token);

    // Login ke turant baad full profile lao
    const profileRes = await api.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const fullUser = profileRes.data.user;

    localStorage.setItem("user", JSON.stringify(fullUser));

    setUser(fullUser);

    toast.success("Login successful!");

    return { success: true };

  } catch (error) {

    const message =
      error.response?.data?.message ||
      "Login failed";

    toast.error(message);

    return {
      success: false,
      error: message,
    };
  }
};

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }
  if (loading) {
  return <LoadingSpinner />;
}

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <WhatsAppFloating />
    </AuthContext.Provider>
  )
}


