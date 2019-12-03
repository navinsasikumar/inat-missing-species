/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import {
  Col,
  Form,
  Row,
} from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AutoComplete from './AutoComplete';
import SelectedFilters from './SelectedFilters';

const SearchFilterWrapper = styled.div`
  padding: 10px;
  text-align: left;
`;

const FormGroup = styled.div`
  position: relative;
`;

const MultiSelected = styled.div`
  color: white;
  display: inline-block;
  font-size: 65%;
  padding-right: 20px;
`;

class SearchFilter extends Component {
  static propTypes= {
    handleSelectedClick: PropTypes.func.isRequired,
    excludedSpecies: PropTypes.array.isRequired,
    handleSpeciesChange: PropTypes.func.isRequired,
    handleSpeciesSelect: PropTypes.func.isRequired,
    speciesMatch: PropTypes.array.isRequired,
    selectedSpecies: PropTypes.array.isRequired,
    speciesValue: PropTypes.string,
    excludedPlaces: PropTypes.array.isRequired,
    handlePlacesChange: PropTypes.func.isRequired,
    handlePlacesSelect: PropTypes.func.isRequired,
    placesMatch: PropTypes.array.isRequired,
    selectedPlaces: PropTypes.array.isRequired,
    placesValue: PropTypes.string,
  };

  render() {
    const selectedSpeciesLabel = this.props.selectedSpecies.length > 0 ? 'Selected Taxa: ' : '';
    const excludedSpeciesLabel = this.props.excludedSpecies.length > 0 ? 'Excluded Taxa: ' : '';

    const selectedPlacesLabel = this.props.selectedPlaces.length > 0 ? 'Selected Places: ' : '';
    const excludedPlacesLabel = this.props.excludedPlaces.length > 0 ? 'Excluded Places: ' : '';

    return (
      <SearchFilterWrapper>
        <Form>
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <Form.Control size="sm" type="text" placeholder="Species" onChange={this.props.handleSpeciesChange} value={this.props.speciesValue} />
                <AutoComplete type="species" matches={this.props.speciesMatch} handleSpeciesSelect={this.props.handleSpeciesSelect}/>
                <MultiSelected>
                  {selectedSpeciesLabel}
                  {this.props.selectedSpecies.map((species, index) => (
                    <SelectedFilters
                      key={species.id}
                      selectedIndex={index}
                      selectedValue={species}
                      selectedType="species"
                      handleSelectedClick={this.props.handleSelectedClick}
                    />
                  ))}
                </MultiSelected>
                <MultiSelected>
                  {excludedSpeciesLabel}
                  {this.props.excludedSpecies.map((species, index) => (
                    <SelectedFilters
                      key={species.id}
                      selectedIndex={index}
                      selectedValue={species}
                      selectedType="speciesExclude"
                      handleSelectedClick={this.props.handleSelectedClick}
                    />
                  ))}
                </MultiSelected>
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Form.Control size="sm" type="text" placeholder="Location" onChange={this.props.handlePlacesChange} value={this.props.placesValue} />
                <AutoComplete type="places" matches={this.props.placesMatch} handlePlacesSelect={this.props.handlePlacesSelect}/>
                <MultiSelected>
                  {selectedPlacesLabel}
                  {this.props.selectedPlaces.map((place, index) => (
                    <SelectedFilters
                      key={place.id}
                      selectedIndex={index}
                      selectedValue={place}
                      selectedType="places"
                      handleSelectedClick={this.props.handleSelectedClick}
                    />
                  ))}
                </MultiSelected>
                <MultiSelected>
                  {excludedPlacesLabel}
                  {this.props.excludedPlaces.map((place, index) => (
                    <SelectedFilters
                      key={place.id}
                      selectedIndex={index}
                      selectedValue={place}
                      selectedType="placesExclude"
                      handleSelectedClick={this.props.handleSelectedClick}
                    />
                  ))}
                </MultiSelected>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </SearchFilterWrapper>
    );
  }
}


export default SearchFilter;
