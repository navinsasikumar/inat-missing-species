/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Container,
  Row,
} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import ObservationSquare from './ObservationSquare';
import LoadingSpinner from './LoadingSpinner';

const SearchResultsWrapper = styled.div`
  color: white;
`;

const ColOverride = styled.div``;

const PaginateRow = styled.div`
  li {
    margin: 10px 0;
    padding: 5px 10px;
    cursor: pointer;
  }

  li.disabled {
    color: #333;
    cursor: not-allowed;
  }

  li.break-me {
    color: #333;
  }

  li.active {
    background-color: rgb(41, 97, 145);
  }
`;

class SearchResults extends Component {
  static propTypes= {
    results: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    page: PropTypes.number,
    perPage: PropTypes.number,
    totalResults: PropTypes.number,
    handlePageClick: PropTypes.func.isRequired,
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

    const pages = Math.ceil(this.props.totalResults / this.props.perPage);

    return (
      <SearchResultsWrapper>
        <Container>
          <Row className="grid justify-content-center">
            {rowContent}
          </Row>
          <Row className="grid justify-content-center">
            <PaginateRow>
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                forcePage={this.props.page - 1}
                onPageChange={this.props.handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            </PaginateRow>
          </Row>
        </Container>
      </SearchResultsWrapper>
    );
  }
}

export default SearchResults;
