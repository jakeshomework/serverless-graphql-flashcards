// NOTE: Schema declares "shape" of data

const schema = `

type Deck {
  deckId: String!
  title: String! 
  author: String!
  studySet: [String]
  cardSet: [String]
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

type Tweets {   
  name: String!
  screen_name: String!
  location: String!
  description: String!
  followers_count: Int!
  friends_count: Int!
  favourites_count: Int!
  posts : [Tweet]
}

type Tweet {
  tweet : String
}

type Query {
  getTwitterFeed(handle: String!, consumer_key: String, consumer_secret: String) : Tweets
  getDeck(deckId: String!) : Deck
  getUser(userId: String!) : User
  getCard(cardId: String!) : Card
}`;

// eslint-disable-next-line import/prefer-default-export
export { schema };
