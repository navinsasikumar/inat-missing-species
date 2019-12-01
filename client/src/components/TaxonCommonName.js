/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TaxonCommonNameWrapper = styled.div`
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
  white-space: nowrap;
  width: 100%;
`;

class TaxonCommonName extends Component {
  static propTypes= {
    text: PropTypes.string.isRequired,
  };

  render() {
    return (
      <TaxonCommonNameWrapper>
        {this.props.text}
      </TaxonCommonNameWrapper>
    );
  }
}

export default TaxonCommonName;
