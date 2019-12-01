/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Container,
  Row,
} from 'react-bootstrap';
import ObservationSquare from './ObservationSquare';
import LoadingSpinner from './LoadingSpinner';

const SearchResultsWrapper = styled.div`
  color: white;
`;

const ColOverride = styled.div``;

class SearchResults extends Component {
  static propTypes= {
    results: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  render() {
    let rowContent;
    if (this.props.loading /* && this.props.results.length === 0 */) {
      rowContent = (
        <LoadingSpinner />
      );
    } else {
      rowContent = this.props.results.map(obs => (
        <ColOverride xs={true} key={obs.id} className="no-padding">
          <ObservationSquare observation={obs} />
        </ColOverride>
      ));
    }

    return (
      <SearchResultsWrapper>
        <Container>
          <Row className="grid justify-content-center">
            {rowContent}
          </Row>
        </Container>
      </SearchResultsWrapper>
    );
  }
}

export default SearchResults;
