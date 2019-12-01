/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ObservationImage from './ObservationImage';

const ObservationWrapper = styled.div`
  background-color: #17181C;
  margin: 5px;
  position: relative;
  clear: both;
  width: 165px;
  @media (min-width: 768px) {
    width: 210px;
  }
`;

class ObservationSquare extends Component {
  static propTypes= {
    observation: PropTypes.object.isRequired,
  };

  render() {
    return (
     <ObservationWrapper>
       <ObservationImage photos={this.props.observation.photos} />
       {this.props.observation.taxon ? this.props.observation.taxon.preferred_common_name : 'Unknown'}
     </ObservationWrapper>
    );
  }
}

export default ObservationSquare;
