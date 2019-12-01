/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ObservationImage from './ObservationImage';
import ObservationCaption from './ObservationCaption';

const ObservationWrapper = styled.div`
  background-color: #17181C;
  margin: 5px;
  position: relative;
  clear: both;
  width: 165px;
  a {
    color: white;
  }
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
       <a href={this.props.observation.uri} target="_blank" rel="noopener noreferrer">
         <ObservationImage photos={this.props.observation.photos} />
         <ObservationCaption observation={this.props.observation} />
       </a>
     </ObservationWrapper>
    );
  }
}

export default ObservationSquare;
