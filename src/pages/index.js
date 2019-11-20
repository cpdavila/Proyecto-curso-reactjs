import React, { useState, useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/react-hooks";
import { FaSyncAlt } from "react-icons/fa";
import utils from "../utils";

const ApprovedMessageList = ({ initialMessages }) => {
  const [messages, setMessages] = useState([...initialMessages]);
  const approvedSubscription = useSubscription(
    utils.APPROVED_MESSAGE_SUBSCRIPTION
  );

  const rejectSubscription = useSubscription(
    utils.REJECTED_MESSAGE_SUBSCRIPTION
  );

  useEffect(() => {
    if (rejectSubscription.data) {
      setMessages(
        messages.filter(e => e.id != rejectSubscription.data.messageRejected.id)
      );
    }
  }, [rejectSubscription.data]);

  useEffect(() => {
    if (
      approvedSubscription.data &&
      !messages
        .map(m => m.id)
        .find(m => m === approvedSubscription.data.messageApproved.id)
    ) {
      setMessages([
        { ...approvedSubscription.data.messageApproved },
        ...messages.slice()
      ]);
    }
    // eslint-disable-next-line
  }, [approvedSubscription.data]);

  return (
    <ul className="flex flex-col flex-1 justify-end h-full">
      {messages.map(({ id, content }) => (
        <li key={id} className="border-t p-3 flex items-center justify-between">
          <p>{content}</p>
        </li>
      ))}
    </ul>
  );
};

const IndexPage = () => {
  const { loading, error, data, refetch } = useQuery(
    utils.APPROVED_MESSAGES_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  );

  if (error) return <p>{error.message}</p>;

  return (
    <div className="min-h-screen flex flex-col p-3">
      <header className="flex justify-between items-center">
        <h1 className="text-center font-bold">Elecciones 2019</h1>
        <button
          disabled={loading}
          className={`p-3 rounded border ${
            loading
              ? "cursor-not-allowed bg-gray-500"
              : "bg-white hover:bg-gray-100 focus:bg-gray-300"
          }`}
          onClick={() => {
            refetch();
          }}
        >
          <FaSyncAlt />
        </button>
      </header>
      <section className="flex-1 flex flex-col">
        <section className="flex-1 flex p-3 overflow-y-scroll">
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <ApprovedMessageList initialMessages={data.approvedMessages} />
          )}
        </section>
      </section>
    </div>
  );
};

export default IndexPage;
