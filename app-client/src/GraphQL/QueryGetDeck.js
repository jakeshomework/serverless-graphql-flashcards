import gql from 'graphql-tag';

export default gql(`
  query DeckQuery($deckId: String!) {
    getDeck(deckId: $deckId) {
      title
      author
      studySet
      cardSet {
        cardId
        front
        back
        hint
      }
    }
  }`);
