// add to handler.js
import dynamodb from 'serverless-dynamodb-client';

const docClient = dynamodb.doc; // return an instance of new AWS.DynamoDB.DocumentClient()

// add to handler.js
const promisify = foo =>
  new Promise((resolve, reject) => {
    foo((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

const twitterEndpoint = {
  getRawTweets(args) {
    return promisify(callback =>
      docClient.query(
        {
          TableName: 'users',
          KeyConditionExpression: 'screen_name = :v1',
          ExpressionAttributeValues: {
            ':v1': args.handle,
          },
        },
        callback
      )
    ).then(result => {
      const tweets = [];
      let listOfTweets;

      if (result.Items.length >= 1) {
        listOfTweets = {
          name: result.Items[0].name,
          screen_name: result.Items[0].screen_name,
          location: result.Items[0].location,
          description: result.Items[0].description,
          followers_count: result.Items[0].followers_count,
          friends_count: result.Items[0].friends_count,
          favourites_count: result.Items[0].favourites_count,
          posts: [],
        };
      }

      for (let i = 0; i < result.Items[0].posts.length; i += 1) {
        tweets.push({ tweet: result.Items[0].posts[i].tweet });
      }

      listOfTweets.posts = tweets;

      return listOfTweets;
    });
  },
};

const cardEndpoint = {
  getCard(args) {
    return promisify(callback =>
      docClient.query(
        {
          TableName: 'cards',
          KeyConditionExpression: 'cardId = :v1',
          ExpressionAttributeValues: {
            // ':v1': args.cardId,
            ':v1': args.cardId,
          },
        },
        callback
      )
    ).then(result => {
      console.log(result);
      const card = {
        cardId: result.Items[0].cardId,
        front: result.Items[0].front,
        back: result.Items[0].back,
        hint: result.Items[0].hint,
      };
      return card;
    });
  },
};

const deckEndpoint = {
  getDeck(args) {
    console.log('args', args);
    return promisify(callback =>
      docClient.query(
        {
          TableName: 'decks-by-apollo',
          KeyConditionExpression: 'deckId = :v1',
          ExpressionAttributeValues: {
            ':v1': args.deckId,
          },
        },
        callback
      )
    ).then(result => {
      console.log('result', result);

      const deck = {
        deckId: result.Items[0].deckId,
        title: result.Items[0].title,
        author: result.Items[0].author,
        studySet: result.Items[0].studySet,
      };
      return deck;
    });
  },
};

// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    getTwitterFeed: (root, args) => twitterEndpoint.getRawTweets(args),
    getDeck: (root, args) => deckEndpoint.getDeck(args),
    getCard: (root, args) => cardEndpoint.getCard(args),
  },
};
