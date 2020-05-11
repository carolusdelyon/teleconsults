import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    """
    every consult can have a answer cached.
    The consult parameter will indicate to which
    one this cached answer belongs.
    """
    answersCached: [Answer]!
  }

  extend type Consult {
    hasAnswerCahed: Boolean!
  }

  extend type Mutation {
    addOrRemoveAnswerFromCache(answer: Answer!): Answer!
  }
`;

export const resolvers = {
};
