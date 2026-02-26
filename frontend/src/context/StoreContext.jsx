import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [blogData, setBlogData] = useState([]);

  // Base URL for API calls
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Parse the string back into an object
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const allBlogs = async () => {
      try {
        // Updated to use the dynamic API_URL
        const res = await axios.get(`${API_URL}/blog/all`);
        setBlogData(res.data.blogs);
      } catch (error) {
        console.log("error in all blogs api", error);
      }
    };
    allBlogs();
  }, [API_URL]); // Added dependency for safety

  const loginUser = (user, token) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const contextValue = { blogData, user, loginUser, logoutUser, API_URL };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;