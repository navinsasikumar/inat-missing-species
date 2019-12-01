/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TaxonName from './TaxonName';

const ObservationCaptionWrapper = styled.div`
  padding: 5px;
  font-size: 14px;
`;

class ObservationCaption extends Component {
  static propTypes= {
    observation: PropTypes.object.isRequired,
  };

  render() {
    return (
      <ObservationCaptionWrapper>
        <TaxonName observation={this.props.observation}/>
      </ObservationCaptionWrapper>
    );
  }
}

export default ObservationCaption;
