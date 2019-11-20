import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import { isAuthenticated } from '../services/auth';
import Input from './Input';


const PrivateRoute = ({ component: Component, ...rest }) => {
  const [state, setState] = useReducer((s, a) => ({...s, ...a}), {
    username:'',
    password: '',
  });

  const onChange = e => {
    setState({
      [e.target.id]: e.target.value,
    });
  };

  if (!isAuthenticated()) {
    return <form
      className="p-3 flex items-center justify-center"
      onSubmit={e => {
        e.preventDefault();
      }}>
      <div className="flex flex-col justify-center">
        <Input label="Usuario: " id="username" name="username" value={state.username} onChange={onChange} />
        <Input type="password" label="Contraseña: " id="password" name="password" value={state.password} onChange={onChange} />
        <button className="bg-blue-500 p-3 rounded text-white hover:bg-blue-600 focus:bg-blue-700">Iniciar sesión</button>
      </div>
    </form>;
  }
  return <Component {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PrivateRoute;
