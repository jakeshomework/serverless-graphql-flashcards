const schema = `

type Deck {
  title: String! 
  author: String!
  studySet: [Card]
}

type Card {
  front: String!
  back: String!
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
}`;

// eslint-disable-next-line import/prefer-default-export
export { schema };
