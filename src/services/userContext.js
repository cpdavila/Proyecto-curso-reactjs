import React from 'react';

const UserContext = React.createContext({ user: null, logout: () => {}, setToken: () => {} });

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;

export default UserContext;
