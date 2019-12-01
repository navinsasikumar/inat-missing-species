/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import '../compiled/App.css';

const ObservationImageWrapper = styled.div`
  line-height: 165px;
  @media (min-width: 768px) {
    line-height: 210px;
  }
`;

class ObservationImage extends Component {
  static propTypes= {
    photos: PropTypes.array.isRequired,
  };

  render() {
    let dispPhoto = this.props.photos.length > 0 ? this.props.photos[0].url : '';
    dispPhoto = dispPhoto.replace(/square/, 'medium');

    if (dispPhoto) {
      return (
       <ObservationImageWrapper className="crop">
         <img src={dispPhoto} alt="test"/>
       </ObservationImageWrapper>
      );
    }

    return (
     <ObservationImageWrapper className="crop">
       No Image
     </ObservationImageWrapper>
    );
  }
}

export default ObservationImage;
