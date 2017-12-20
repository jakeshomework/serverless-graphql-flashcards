// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({ region: 'us-east-1' });

const docClient = new AWS.DynamoDB.DocumentClient();

console.log('Importing movies into DynamoDB. Please wait.');

const allDecks = JSON.parse(fs.readFileSync('decks.json', 'utf8'));
const allCards = JSON.parse(fs.readFileSync('cards.json', 'utf8'));

allDecks.forEach(deck => {
  const params = {
    TableName: 'decks',
    Item: {
      deckId: deck.deckId,
      title: deck.title,
      author: deck.author,
      studySet: deck.studySet,
    },
  };

  docClient.put(params, (err, data) => {
    if (err) {
      console.error(
        'Unable to add deck',
        deck.deckId,
        '. Error JSON:',
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log('PutItem succeeded:', deck.deckId);
    }
  });
});

allCards.forEach(card => {
  const params = {
    TableName: 'cards',
    Item: {
      cardId: card.cardId,
      front: card.front,
      back: card.back,
      hint: card.hint,
    },
  };

  docClient.put(params, (err, data) => {
    if (err) {
      console.error(
        'Unable to add deck',
        card.cardId,
        '. Error JSON:',
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log('PutItem succeeded:', card.cardId);
    }
  });
});
