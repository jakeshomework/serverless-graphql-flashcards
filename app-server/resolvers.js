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

const cardEndpoint = {
  getAllCards(args) {
    console.log(args);
    return promisify(callback =>
      docClient.scan(
        {
          TableName: 'cards',
          Limit: args.numCards,
        },
        callback
      )
    ).then(result => {
      const cardList = {
        cardSet: result.Items,
      };
      console.log('cardList', cardList);
      return cardList;
    });
  },

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
  addCard(card) {
    const params = {
      TableName: 'cards',
      Item: {
        cardId: card.cardId,
        front: card.front,
        back: card.back,
        hint: card.hint,
      },
    };
    console.log(card);

    /* ----- PUT item with callback return -----*/
    // docClient.put(params, (err, data) => {
    //   if (err) console.log(err);
    //   else console.log(data);
    // });
    // return card;

    /* ----- PUT item with promise return -----*/
    return promisify(callback => docClient.put(params, callback))
      .then(result => {
        console.log('SUCCESS ON PUT', card);
        return card;
      })
      .catch(err => console.log('ERROR ON PUT', err));
  },
  addCardToDeck(args) {
    console.log(args);
    return args;
  },
};

let deck = {};
const cardSet = [];

const deckEndpoint = {
  getAllDecks(args) {
    return promisify(callback =>
      docClient.scan(
        {
          TableName: 'decks',
          Limit: args.numDecks,
        },
        callback
      )
    ).then(result => {
      const deckList = {
        deckSet: result.Items,
      };
      console.log('deckList', deckList);
      return deckList;
    });
  },
  getDeck(args) {
    // console.log('args', args);
    return (
      promisify(callback =>
        docClient.query(
          {
            TableName: 'decks',
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
    getDeck: (root, args) => deckEndpoint.getDeck(args),
    getCard: (root, args) => cardEndpoint.getCard(args),
    getAllCards: (root, args) => cardEndpoint.getAllCards(args),
    getAllDecks: (root, args) => deckEndpoint.getAllDecks(args),
  },
  Mutation: {
    addCard: (root, args) => cardEndpoint.addCard(args),
    addCardToDeck: (root, args) => cardEndpoint.addCardToDeck(args),
  },
};
