/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
} from 'react-bootstrap';
import AutoComplete from '../AutoComplete';
import SelectedFieldDisplay from './SelectedFieldDisplay';

class PlacesFilter extends Component {
  static propTypes= {
    handleSelectedClick: PropTypes.func.isRequired,
    excludedPlaces: PropTypes.array.isRequired,
    handlePlacesChange: PropTypes.func.isRequired,
    handlePlacesSelect: PropTypes.func.isRequired,
    placesMatch: PropTypes.array.isRequired,
    selectedPlaces: PropTypes.array.isRequired,
    placesValue: PropTypes.string,
  };

  render() {
    const selectedPlacesLabel = this.props.selectedPlaces.length > 0 ? 'Selected Places: ' : '';
    const excludedPlacesLabel = this.props.excludedPlaces.length > 0 ? 'Excluded Places: ' : '';

    return (
      <div>
        <Form.Control size="sm" type="text" placeholder="Location" onChange={this.props.handlePlacesChange} value={this.props.placesValue} />
        <AutoComplete type="places" matches={this.props.placesMatch} handlePlacesSelect={this.props.handlePlacesSelect}/>
        <SelectedFieldDisplay
          handleSelectedClick={this.props.handleSelectedClick}
          selectedArray={this.props.selectedPlaces}
          selectedLabel={selectedPlacesLabel}
          selectedType="places"
        />
        <SelectedFieldDisplay
          handleSelectedClick={this.props.handleSelectedClick}
          selectedArray={this.props.excludedPlaces}
          selectedLabel={excludedPlacesLabel}
          selectedType="placesExclude"
        />
      </div>
    );
  }
}

export default PlacesFilter;
