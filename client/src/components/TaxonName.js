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
    const { taxon } = this.props.observation;
    let commonName;
    let latinName;
    if (taxon) {
      latinName = taxon.name;
      if (taxon.preferred_common_name) {
        commonName = taxon.preferred_common_name;
      } else {
        commonName = taxon.name;
      }
    } else {
      commonName = 'Unknown';
      latinName = '';
    }

    return (
      <TaxonNameWrapper>
        <TaxonCommonName text={commonName} />
        <TaxonLatinName text={latinName} />
      </TaxonNameWrapper>
    );
  }
}

export default TaxonName;
