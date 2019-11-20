import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import utils from '../utils';

const MessageForm = () => {
  const [content, setContent] = useState('');
  const [addMessage] = useMutation(utils.ADD_MESSAGE_MUTATION);
  const onChange = e => {
    setContent(e.target.value);
  };
  return (
    <form onSubmit={e => {
      e.preventDefault();
      addMessage({
        variables: {
          content,
        },
      });
      setContent('');
    }}
    className="flex items-center"
    >
      <textarea className="border resize-none flex-1 mr-3" name="content" id="content" value={content} onChange={onChange}></textarea>
      <button className="bg-blue-500 p-3 rounded text-white hover:bg-blue-600 focus:bg-blue-700">Enviar</button>
    </form>
  );
};

export default MessageForm;
