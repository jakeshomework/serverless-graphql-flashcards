import gql from 'graphql-tag';

export default gql(`
mutation($deckId: String! $cardId: String!) {
  addCardToDeck(
    cardId: $cardId
    deckId: $deckId
  ) {
    deckId
    title
    studySet
  }
}`);
