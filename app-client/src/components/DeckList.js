import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Deck from './Deck';

const DeckList = ({ data: { loading, error, getDeck } }) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <Deck key={getDeck.deckId} studySet={getDeck.studySet} />
    </div>
  );
};

DeckList.propTypes = {
  data: PropTypes.any.isRequired, // eslint-disable-line
};

export const DeckQuery = gql`
  query DeckQuery($deckId: String!) {
    getDeck(deckId: $deckId) {
      title
      authorId
      studySet
    }
  }
`;

export default graphql(DeckQuery, {
  options: () => ({
    variables: {
      deckId: 'cocotest',
    },
  }),
})(DeckList);
