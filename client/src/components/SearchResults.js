/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SearchResultsWrapper = styled.div`
  color: white;
`;

class SearchResults extends Component {
  static propTypes= {
    results: PropTypes.array.isRequired,
  };

  render() {
    return (
      <SearchResultsWrapper>
        {this.props.results.map(obs => (
          <div key={obs.id}>{obs.taxon && obs.taxon.preferred_common_name}</div>
        ))}
      </SearchResultsWrapper>
    );
  }
}

export default SearchResults;
