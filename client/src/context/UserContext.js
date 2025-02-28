import React, { createContext, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { getUsers } from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState(null);
  
  // Fetch users from API
  const { data: users, isLoading, error } = useQuery('users', getUsers);
  
  // Set the first user as active when users are loaded
  useEffect(() => {
    if (users && users.length > 0 && !activeUser) {
      setActiveUser(users[0]);
    }
  }, [users, activeUser]);
  
  return (
    <UserContext.Provider value={{ 
      users, 
      activeUser, 
      setActiveUser, 
      isLoading, 
      error 
    }}>
      {children}
    </UserContext.Provider>
  );
};