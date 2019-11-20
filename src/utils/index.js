import gql from "graphql-tag";

const MESSAGE_STRUCTURE = `
  id
  content
  approved
`;

const MESSAGES_QUERY = gql`
  {
    messages {
      ${MESSAGE_STRUCTURE}
    }
  }
`;

const ADD_MESSAGE_MUTATION = gql`
  mutation CreateMessage($content: String!) {
    createMessage(content: $content) {
      ${MESSAGE_STRUCTURE}
    }
  }
`;
const APPROVE_MESSAGE_MUTATION = gql`
  mutation ApproveMessage($id: ID!) {
    approveMessage(id: $id) {
      ${MESSAGE_STRUCTURE}
    }
  }
`;
const REJECT_MESSAGE_MUTATION = gql`
  mutation RejectMessage($id: ID!) {
    rejectMessage(id: $id) {
      ${MESSAGE_STRUCTURE}
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription onMessageCreated {
    messageCreated {
      ${MESSAGE_STRUCTURE}
    }
  }
`;

const APPROVED_MESSAGES_QUERY = gql`
  {
    approvedMessages {
      ${MESSAGE_STRUCTURE}
    }
  }
`;

const APPROVED_MESSAGE_SUBSCRIPTION = gql`
  subscription onMessageApproved {
    messageApproved {
      ${MESSAGE_STRUCTURE}
    }
  }
`;
const REJECTED_MESSAGE_SUBSCRIPTION = gql`
  subscription onMessageRejected {
    messageRejected {
      ${MESSAGE_STRUCTURE}
    }
  }
`;

export default {
  APPROVED_MESSAGES_QUERY,
  APPROVED_MESSAGE_SUBSCRIPTION,
  REJECTED_MESSAGE_SUBSCRIPTION,
  MESSAGES_QUERY,
  ADD_MESSAGE_MUTATION,
  MESSAGE_SUBSCRIPTION,
  APPROVE_MESSAGE_MUTATION,
  REJECT_MESSAGE_MUTATION
};
