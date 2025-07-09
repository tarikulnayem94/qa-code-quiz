import React, { useState } from "react";
import accounts from "../../storage/account.json";

interface AuthAPI {
  user?: {
    name: string;
    favouriteFruit: string;
    favouriteMovie: string;
    favouriteNumber: string;
  };
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthAPI>({
  login() {
    return Promise.resolve();
  },
  logout() {},
});

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState();

  const login = (username: string, password: string) => {
    console.warn({ username, password });
    const accountsTyped = accounts as any;
    if (
      accountsTyped[username] &&
      accountsTyped[username].password === password
    ) {
      setUser(accountsTyped[username]);
      return Promise.resolve(accountsTyped[username]);
    } else {
      return Promise.reject("INVALID USER");
    }
  };

  const logout = () => {
    setUser(undefined);
  };

  const api = {
    user,
    logout,
    login,
  };

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
