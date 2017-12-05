import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Deck from './Deck';

// ===== get deckId to fetch from URL path ===== //
const holyPath = window.location.href.substr(
  window.location.href.lastIndexOf('/') + 1
);

const DeckList = ({ data: { loading, error, getDeck } }) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <Deck
        key={getDeck.deckId}
        title={getDeck.title}
        deckId={getDeck.deckId}
        studySet={getDeck.studySet}
        author={getDeck.author}
      />
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
      author
      studySet {
        front
        back
        hint
      }
    }
  }
`;

export default graphql(DeckQuery, {
  options: () => ({
    variables: {
      deckId: holyPath,
    },
  }),
})(DeckList);
