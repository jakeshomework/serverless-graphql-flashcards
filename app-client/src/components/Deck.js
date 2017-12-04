import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function Deck({ deckId, studySet }) {
  return (
    <div>
      <h4 className="deckId">{deckId}</h4>
      <p className="studySet">{studySet.length}</p>
    </div>
  );
}

Deck.propTypes = {
  user: PropTypes.any.isRequired, // eslint-disable-line
};

export default Deck;
