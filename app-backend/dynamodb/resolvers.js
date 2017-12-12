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
    // console.log('holy fruit', typeof args);
    // console.log('cardEndpoint', args);
    // console.log('bananas', args.cardId);
    return promisify(callback =>
      docClient.query(
        {
          TableName: 'cards',
          KeyConditionExpression: 'cardId = :v1',
          ExpressionAttributeValues: {
            // ':v1': '3',
            ':v1': args.cardId,
          },
        },
        callback
      )
    )
      .then(result => {
        const card = {
          cardId: result.Items[0].cardId,
          front: result.Items[0].front,
          back: result.Items[0].back,
          hint: result.Items[0].hint,
        };
        // console.log('current card', card);
        return card;
      })
      .catch(err => console.log('ERROR HERE', err));
  },
};

let deck = {};
const cardSet = [];

const deckEndpoint = {
  getDeck(args) {
    // console.log('args', args);
    return (
      promisify(callback =>
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
      )
        .then(result => {
          // console.log('cardSet', cardSet);
          // console.log('result', result);

          deck = {
            deckId: result.Items[0].deckId,
            title: result.Items[0].title,
            author: result.Items[0].author,
            studySet: result.Items[0].studySet,
            cardSet,
          };
          return deck;
        })

        // /* ===== get the cards based on deck.studySet ===== */
        // .then(deck => {
        //   console.log('first call to dynamodb', deck);

        //   cardSet = deck.studySet.map(item =>
        //     cardEndpoint.getCard({ cardId: item.toString() })
        //   );

        //   return deck;
        // })

        /* ===== https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html ===== */
        .then(currentDeck =>
          Promise.all(
            currentDeck.studySet.map(item =>
              cardEndpoint.getCard({ cardId: item.toString() })
            )
          )
        )
        .then(
          cardList =>
            // console.log('did this work?', cardList);
            cardList
        )

        /* ===== assign cardSet to deck ===== */
        .then(cardList => {
          deck.cardSet = cardList;
          console.log('FINAL DECK:', deck);
          return deck;
        })
    );
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

// function getCardSet(cardSetArray) {
//   console.log('cardSetArray', cardSetArray);
//   const cardSet = cardSetArray.map(item => {
//     console.log(item);
//     docClient.query(
//       {
//         TableName: 'cards',
//         KeyConditionExpression: 'cardId = :v1',
//         ExpressionAttributeValues: {
//           // ':v1': args.cardId,
//           ':v1': item,
//         },
//       },
//       (err, data) => {
//         if (err) console.log('ERROR HERE', err);
//         else console.log(data);
//       }
//     );
//     return 'hello';
//   });
// }

//   ).then(result => {
//     console.log(result);
//     const cardSet = {
//       cardId: result.Items[0].cardId,
//       front: result.Items[0].front,
//       back: result.Items[0].back,
//       hint: result.Items[0].hint,
//     };
//     return cardSet;
//   });
// }

/* =========== FOR STACK OVERFLOW ========== */

// const promisify = foo =>
//   new Promise((resolve, reject) => {
//     foo((error, result) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(result);
//       }
//     });
//   });

// function getCard(args) {
//   return promisify(callback =>
//     // console.log('cally bally', callback);
//     docClient.query(
//       {
//         TableName: 'cards',
//         KeyConditionExpression: 'cardId = :v1',
//         ExpressionAttributeValues: {
//           ':v1': args.cardId,
//         },
//       },
//       callback
//     )
//   )
//     .then(result => {
//       const card = {
//         cardId: result.Items[0].cardId,
//         front: result.Items[0].front,
//         back: result.Items[0].back,
//         hint: result.Items[0].hint,
//       };
//       console.log('My Card Object--should be #1', card);
//       return card;
//     })
//     .catch(err => console.log('ERROR', err));
// }

// const item = 5;
// getCard({ cardId: item.toString() }).then(
//   console.log('Finished--Should be #2')
// );
