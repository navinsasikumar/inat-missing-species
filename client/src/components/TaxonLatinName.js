/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TaxonLatinNameWrapper = styled.div`
  font-style: italic;
`;

class TaxonLatinName extends Component {
  static propTypes= {
    text: PropTypes.string.isRequired,
  };

  render() {
    return (
      <TaxonLatinNameWrapper>
        {this.props.text}
      </TaxonLatinNameWrapper>
    );
  }
}

export default TaxonLatinName;
