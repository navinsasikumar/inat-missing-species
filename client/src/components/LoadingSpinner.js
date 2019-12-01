/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import Loader from 'react-loader-spinner';

class LoadingSpinner extends Component {
  render() {
    return (
      <Loader
       type="Plane"
       color="#ffb733"
       height={300}
       width={300}
       timeout={30000} // 3 secs
      />
    );
  }
}

export default LoadingSpinner;
