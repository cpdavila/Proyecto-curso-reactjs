import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import utils from '../utils';
import MessageForm from '../components/MessageForm';

const MessageList = () => {
  const { loading, error, data, refetch } = useQuery(utils.MESSAGES_QUERY);
  const [approveMessage] = useMutation(utils.APPROVE_MESSAGE_MUTATION);
  const [rejectMessage] = useMutation(utils.REJECT_MESSAGE_MUTATION);
  const subscription = useSubscription(utils.MESSAGE_SUBSCRIPTION);

  const [messages, setMessages] = useState([]);

  const approveMessageOnClick = (e, id) => {
    approveMessage({variables: {id}});
  };

  const rejectMessageOnClick = (e, id) => {
    rejectMessage({variables: {id}});
  };

  useEffect(() => {
    setMessages(data ? data.messages: []);
  }, [data]);

  useEffect(() => {
    if (subscription.data) {
      refetch();
    }
    // eslint-disable-next-line
  }, [subscription.data]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <ul className="flex-col flex-1 justify-end h-full overflow-y-scroll">
      {messages.map(({id, content, approved})=>(
        <li key={id} className="border-t p-3 flex items-center justify-between">
          <p>{content}</p>
          {approved && <button onClick={e => rejectMessageOnClick(e, id)} className="bg-red-500 p-3 rounded border text-white hover:bg-red-600 focus:bg-red-700">Rechazar</button>}
          {!approved && <button onClick={e => approveMessageOnClick(e, id)} className="bg-white p-3 rounded border hover:bg-gray-100 focus:bg-gray-300" >Aprobar</button>}
        </li>
      ))}
    </ul>
  );
};

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <h1 className="text-center font-bold uppercase">
        Liveblog Admin
        </h1>
      </header>
      <section className="flex-1 flex flex-col">
        <section className="flex-1 flex p-3 overflow-y-scroll">
          <MessageList />
        </section>
        <section className="p-3">
          <MessageForm />
        </section>
      </section>
    </div>
  );
};

export default AdminPage;
