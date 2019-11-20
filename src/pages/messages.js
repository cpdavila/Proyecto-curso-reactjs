import React, { useState, useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import utils from '../utils';
import MessageForm from '../components/MessageForm';

const MessageList = () => {
  const { loading, error, data, refetch } = useQuery(utils.MESSAGES_QUERY);
  const subscription = useSubscription(utils.MESSAGE_SUBSCRIPTION);
  const [messages, setMessages] = useState([]);

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
        <li key={id}
          className={`border-t p-3 flex items-center justify-between ${approved ? 'bg-green-200' : ''}`}>
          <p>{content}</p>
        </li>
      ))}
    </ul>
  );
};

const MessagesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <h1 className="text-center font-bold uppercase">
        Liveblog
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

export default MessagesPage;
