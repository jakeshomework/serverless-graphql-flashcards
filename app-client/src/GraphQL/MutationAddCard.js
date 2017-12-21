import gql from 'graphql-tag';

export default gql(`
mutation($front: String! $back: String! $hint: String!) {
  addCard(
    front: $front
    back: $back
    hint: $hint
  ) {
    cardId
    front
    back
    hint
    description
  }
}`);
