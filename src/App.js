import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import AdminPage from './pages/admin';
import IndexPage from './pages';
import MessagesPage from './pages/messages';
import PrivateRoute from './components/PrivateRoute';
import { UserProvider } from './services/userContext';
import { getUser, setToken, logout } from './services/auth';

const App = () => {
  const [currentUser, setUser] = useState(getUser());
  return (
    <UserProvider
      value={{
        user: currentUser,
        setToken: token => {
          console.log('Saving new token in app pages');
          setToken(token);
          setUser(getUser());
        },
        logout: callback => {
          setUser(null);
          logout(callback);
        },
      }}
    >
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <PrivateRoute path="/admin"  component={AdminPage} />
        <Route path="/messages"  component={MessagesPage} />
        <Route path="*">
          <div>
            <h1>404!</h1>
          </div>
        </Route>
      </Switch>
    </UserProvider>
  );
};

export default App;
