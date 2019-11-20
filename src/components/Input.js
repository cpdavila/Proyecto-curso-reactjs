import React from 'react';

const Input = ({id, type, name, label, onChange, value}) => {
  return (
    <div className="mb-3 flex">
      <label htmlFor={id}>{label}</label>
      <input
        className="border flex-1 ml-3"
        id={id}
        type={type}
        name={name}
        onChange={onChange}
        value={value}   
      />
    </div>
  );
};

Input.defaultProps ={
  type: 'text',
};

export default Input;
