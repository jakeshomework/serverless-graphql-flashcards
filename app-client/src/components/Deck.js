import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AddCard from './AddCard';

function Deck({ deckId, title, studySet, author, cardSet }) {
  return (
    <div>
      <h4 className="deckId">{title}</h4>
      <p className="studySet">There are {studySet.length} cards in this set.</p>
      <p className="author">Written by: {author}</p>
      {cardSet.map(card => (
        <div>
          front: {card.front} // back: {card.back}
        </div>
      ))}
      <AddCard deckId={deckId} />
    </div>
  );
}

Deck.propTypes = {
  author: PropTypes.any.isRequired, // eslint-disable-line
};

export default Deck;
