// Code standard taken from Amazon AppSync example

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { v4 as uuid } from 'uuid';
import { graphql } from 'react-apollo';
// import QueryAllEvents from '../GraphQL/QueryAllEvents';
import MutationAddCard from '../GraphQL/MutationAddCard';
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

  handleSave = async e => {
    e.stopPropagation();
    e.preventDefault();

    const { createEvent, history } = this.props;
    const { card } = this.state;

    await createEvent(card);

    // history.push('/');
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

  _addCard = async () => {
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
  };
}

const ADD_CARD = gql(`
mutation AddCardMutation($front: String! $back: String! $hint: String! $cardId: String!) {
  addCard(
    front: $front
    back: $back
    hint: $hint
    cardId: $cardId
  ) {
    cardId
    front
    back
    hint
  }
}`);

export default graphql(ADD_CARD, { name: 'addCardMutation' })(AddCard);

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
