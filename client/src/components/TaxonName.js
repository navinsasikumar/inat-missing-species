/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TaxonCommonName from './TaxonCommonName';
import TaxonLatinName from './TaxonLatinName';

const TaxonNameWrapper = styled.div`
  text-align: left;
`;

class TaxonName extends Component {
  static propTypes= {
    observation: PropTypes.object.isRequired,
  };

  render() {
    const commonName = this.props.observation.taxon ? this.props.observation.taxon.preferred_common_name : 'Unknown';
    const latinName = this.props.observation.taxon ? `(${this.props.observation.taxon.name})` : '';

    return (
      <TaxonNameWrapper>
        <TaxonCommonName text={commonName} />
        <TaxonLatinName text={latinName} />
      </TaxonNameWrapper>
    );
  }
}

export default TaxonName;
