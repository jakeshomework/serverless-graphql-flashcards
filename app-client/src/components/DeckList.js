import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Deck from './Deck';
import DeckQuery from '../GraphQL/QueryGetDeck';

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
        deckId={holyPath}
        studySet={getDeck.studySet}
        author={getDeck.author}
        cardSet={getDeck.cardSet}
      />
    </div>
  );
};

DeckList.propTypes = {
  data: PropTypes.any.isRequired, // eslint-disable-line
};

export default graphql(DeckQuery, {
  options: () => ({
    // fetchPolicy: 'cache-and-network',
    fetchPolicy: 'cache-and-network',
    variables: {
      deckId: holyPath,
    },
  }),
})(DeckList);
