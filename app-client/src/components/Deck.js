import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function Deck({ deckId, title, studySet, author }) {
  return (
    <div>
      <h4 className="deckId">{title}</h4>
      <p className="studySet">There are {studySet.length} cards in this set.</p>
      <p className="author">Written by: {author}</p>
    </div>
  );
}

Deck.propTypes = {
  author: PropTypes.any.isRequired, // eslint-disable-line
};

export default Deck;
