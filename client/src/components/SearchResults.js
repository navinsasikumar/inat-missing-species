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

const SearchResultsWrapper = styled.div`
  color: white;
`;

const ColOverride = styled.div``;

class SearchResults extends Component {
  static propTypes= {
    results: PropTypes.array.isRequired,
  };

  render() {
    return (
      <SearchResultsWrapper>
        <Container>
          <Row className="grid justify-content-center">
            {this.props.results.map(obs => (
              <ColOverride xs={true} key={obs.id} className="no-padding">
                <ObservationSquare observation={obs} />
              </ColOverride>
            ))}
          </Row>
        </Container>
      </SearchResultsWrapper>
    );
  }
}

export default SearchResults;
