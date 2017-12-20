// NOTE: Schema declares "shape" of data

const schema = `

type Deck {
  deckId: String!
  title: String! 
  author: String!
  studySet: [String]
  cardSet: [Card]
}

type Card {
  cardId: String!
  front: String
  back: String
  hint: String
}

type User {
  name: String
  email: String
}

type Query {
  getDeck(deckId: String!) : Deck
  getUser(userId: String!) : User
  getCard(cardId: String!) : Card
}

type Mutation {
    addCard(cardId: String!, front: String, back: String, hint: String): Card!
}
`;

// eslint-disable-next-line import/prefer-default-export
export { schema };
