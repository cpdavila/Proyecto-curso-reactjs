import React, { useEffect, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import { isAuthenticated } from '../services/auth';
import UserContext from '../services/userContext';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Input from './Input';


const SIGN_IN_MUTATION = gql`
  mutation SingIn($username: String!, $password: String!) {
    signIn(username: $username, password: $password)
  }
`;

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [signIn, signInData] = useMutation(SIGN_IN_MUTATION);
  const { setToken } = useContext(UserContext);
  const [state, setState] = useReducer((s, a) => ({...s, ...a}), {
    username:'',
    password: '',
  });

  const onChange = e => {
    setState({
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    if (signInData.data) {
      setToken(signInData.data.signIn);
    }
    // eslint-disable-next-line
  }, [signInData.data]);

  if (!isAuthenticated()) {
    return <form
      className="p-3 flex items-center justify-center"
      onSubmit={e => {
        e.preventDefault();
        signIn({
          variables: {
            username: state.username,
            password: state.password,
          },
        });
      }}>
      <div className="flex flex-col justify-center">
        <Input label="Usuario: " id="username" name="username" value={state.username} onChange={onChange} />
        <Input type="password" label="Contraseña: " id="password" name="password" value={state.password} onChange={onChange} />
        <button className="bg-blue-500 p-3 rounded text-white hover:bg-blue-600 focus:bg-blue-700">Iniciar sesión</button>
        {signInData.error && <div className="my-3 text-red-500">Ocurrió un error</div>}
      </div>
    </form>;
  }
  return <Component {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PrivateRoute;
