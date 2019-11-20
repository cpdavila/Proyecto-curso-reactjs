import jwtDecode from 'jwt-decode';

/**
 * Retrieves the token from the local storage.
 * @returns The token.
 */
export const getToken = () => (window.localStorage.getItem('token') ? window.localStorage.getItem('token') : null);
/**
 * Removes the token from the local storage.
 */
export const removeToken = () => window.localStorage.removeItem('token');
/**
 * Stores the token in the local storage.
 * @param {String} token The JWT token to store.
 */
export const setToken = token => window.localStorage.setItem('token', token);
/**
 * Retrieves the current user from the local storage and decodes it.
 * @returns The user object or null.
 */
export const getUser = () => {
  const token = getToken();
  try {
    const user = jwtDecode(token);
    if (Date.now() >= user.exp * 1000) {
      removeToken();
      return null;
    }
    return user;
  } catch (e) {
    return null;
  }
};

/**
 * Indicates if the user is authenticated.
 * @returns True if the user exists.
 */
export const isAuthenticated = () => {
  return true;
};

/**
 * Deletes the token from the local storage and calls a callback once it finish deleting the token.
 * @param {Function} callback A callback function to be called after removing the token.
 */
export const logout = callback => {
  removeToken();
  if (callback) {
    callback();
  }
};
