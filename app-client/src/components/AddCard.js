// Code standard taken from Amazon AppSync example

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { v4 as uuid } from 'uuid';
import { graphql, compose } from 'react-apollo';

// import QueryAllEvents from '../GraphQL/QueryAllEvents';
import MutationAddCard from '../GraphQL/MutationAddCard';
import MutationAddCardToDeck from '../GraphQL/MutationAddCardToDeck';

import QueryGetDeck from '../GraphQL/QueryGetDeck';
import gql from 'graphql-tag';

class AddCard extends Component {
  static defaultProps = {
    createEvent: () => null,
  };

  state = {
    card: {
      front: '',
      back: '',
      hint: '',
    },
  };

  handleChange(field, { target: { value } }) {
    const { card } = this.state;
    card[field] = value;
    this.setState({ card });
  }

  handleDateChange(field, value) {
    this.handleChange(field, { target: { value: value.format() } });
  }

  _addCard = async e => {
    /* what does this do? */
    e.stopPropagation();
    /* what does this do? */
    e.preventDefault();
    const { front, back, hint } = this.state.card;
    const cardId = uuid();
    console.log('front: ', front, ' -- back: ', back, ' -- hint: ', hint);
    console.log('cardId: ', cardId);
    await this.props.addCardMutation({
      variables: {
        front,
        back,
        hint,
        cardId: cardId,
      },
    });
    await this.props.addCardToDeckMutation({
      variables: {
        deckId: this.props.deckId.toString(),
        cardId: cardId,
      },
    });
  };

  render() {
    const { card } = this.state;

    return (
      <div className="ui container raised very padded segment">
        <h1 className="ui header">Add a card</h1>
        <div className="ui form">
          <div className="field required eight wide">
            <label htmlFor="front">Front</label>
            <input
              type="text"
              id="front"
              value={card.front}
              onChange={this.handleChange.bind(this, 'front')}
            />
          </div>
          <div className="field required eight wide">
            <label htmlFor="back">Back</label>
            <input
              type="text"
              id="back"
              value={card.back}
              onChange={this.handleChange.bind(this, 'back')}
            />
          </div>
          <div className="field required eight wide">
            <label htmlFor="hint">Hint</label>
            <input
              type="text"
              id="hint"
              value={card.hint}
              onChange={this.handleChange.bind(this, 'hint')}
            />
          </div>
          <div className="ui buttons">
            <button className="ui button">Cancel</button>
            <div className="or" />
            {/*<button className="ui positive button" onClick={this.handleSave}>
              Add
            </button>*/}
            <button className="ui positive button" onClick={this._addCard}>
              Add
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// export default graphql(MutationAddCard, { name: 'addCardMutation' })(AddCard);

export default compose(
  graphql(MutationAddCard, { name: 'addCardMutation' }),
  graphql(MutationAddCardToDeck, { name: 'addCardToDeckMutation' })
)(AddCard);

// export default graphql(MutationAddCard, {
//   options: {
//     refetchQueries: [{ query: QueryGetDeck }],
//     update: (proxy, { data: { addCard } }) => {
//       const query = QueryGetDeck;
//       const data = proxy.readQuery({ query });

//       // data.listEvents.items.push(addCard);

//       proxy.writeQuery({ query, data });
//     },
//   },
//   props: props => ({
//     addCard: card => {
//       return props.mutate({
//         variables: card,
//         optimisticResponse: () => ({
//           addCard: {
//             ...card,
//             // cardId: uuid(),
//             cardId: '50',
//             __typename: 'Card',
//           },
//         }),
//       });
//     },
//   }),
// })(AddCard);
