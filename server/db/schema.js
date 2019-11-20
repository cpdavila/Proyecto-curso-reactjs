export default `
  type Message {
    id: ID!
    content: String!
    approved: Boolean
  }

  type Query {
    messages: [Message!]
    approvedMessages: [Message!]
  }

  type Mutation {
    signIn(username: String!, password: String!): String!
    createMessage(content: String!): Message!
    approveMessage(id: ID!): Message!
    rejectMessage(id: ID!): Message!
  }

  type Subscription {
    messageCreated: Message
    messageApproved: Message
    messageRejected: Message
  }
`;