import React, { useReducer, useEffect } from "react";
import PropTypes from "prop-types";

import { isAuthenticated, setToken } from "../services/auth";
import Input from "./Input";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const SIGN_IN_MUTATION = gql`
  mutation SingIn($username: String!, $password: String!) {
    signIn(username: $username, password: $password)
  }
`;

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [signIn, signInData] = useMutation(SIGN_IN_MUTATION);
  const [state, setState] = useReducer((s, a) => ({ ...s, ...a }), {
    status: false,
    username: "",
    password: ""
  });

  useEffect(() => {
    if (signInData.data) {
      setToken(signInData.data.signIn);
      setState({ status: true });
    }
  }, [signInData.data]);

  const onChange = e => {
    setState({
      [e.target.id]: e.target.value
    });
  };

  if (!isAuthenticated()) {
    return (
      <form
        className="p-3 flex items-center justify-center"
        onSubmit={e => {
          e.preventDefault();
          signIn({
            variables: {
              username: state.username,
              password: state.password
            }
          });
        }}
      >
        <div className="flex flex-col justify-center">
          <Input
            label="Usuario: "
            id="username"
            name="username"
            value={state.username}
            onChange={onChange}
          />
          <Input
            type="password"
            label="Contraseña: "
            id="password"
            name="password"
            value={state.password}
            onChange={onChange}
          />
          <button className="bg-blue-500 p-3 rounded text-white hover:bg-blue-600 focus:bg-blue-700">
            Iniciar sesión
          </button>
        </div>
      </form>
    );
  }
  return <Component {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default PrivateRoute;
