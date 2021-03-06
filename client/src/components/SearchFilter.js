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
import TaxaFilter from './Filters/TaxaFilter';
import PlacesFilter from './Filters/PlacesFilter';
import UsersFilter from './Filters/UsersFilter';
import IdentUsersFilter from './Filters/IdentUsersFilter';
import ObservationFieldFilter from './Filters/ObservationFieldFilter';
import CheckboxesFilter from './Filters/CheckboxesFilter';
import AnnotationsFilter from './Filters/AnnotationFilter';

const SearchFilterWrapper = styled.div`
  padding: 10px;
  text-align: left;
`;

const FormGroup = styled.div`
  position: relative;
  padding-bottom: 10px;
`;

const FilterToggle = styled.div`
  cursor: pointer;
`;

class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilters: true,
    };
  }

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
    excludedUsers: PropTypes.array.isRequired,
    handleUsersChange: PropTypes.func.isRequired,
    handleUsersSelect: PropTypes.func.isRequired,
    usersMatch: PropTypes.array.isRequired,
    selectedUsers: PropTypes.array.isRequired,
    usersValue: PropTypes.string,
    handleIdentUsersChange: PropTypes.func.isRequired,
    handleIdentUsersSelect: PropTypes.func.isRequired,
    identUsersMatch: PropTypes.array.isRequired,
    selectedIdentUsers: PropTypes.array.isRequired,
    identUsersValue: PropTypes.string,
    checkboxes: PropTypes.object,
    handleCheckbox: PropTypes.func.isRequired,
    handleObsFieldTermChange: PropTypes.func.isRequired,
    handleObsFieldTermSelect: PropTypes.func.isRequired,
    obsFieldTermMatch: PropTypes.array.isRequired,
    selectedObsFieldTerm: PropTypes.array.isRequired,
    currentlySelectedObsTerm: PropTypes.string.isRequired,
    obsFieldTermValue: PropTypes.string,
    handleObsFieldValueChange: PropTypes.func.isRequired,
    obsFieldValue: PropTypes.string,
    obsFieldValueMatch: PropTypes.array.isRequired,
    handleAnnotationTermSelect: PropTypes.func.isRequired,
    excludedAnnotations: PropTypes.array.isRequired,
    annotationsMatch: PropTypes.array.isRequired,
    selectedAnnotations: PropTypes.array.isRequired,
    annotationsValue: PropTypes.string,
    excludedAnnotationValues: PropTypes.array.isRequired,
    handleAnnotationValueSelect: PropTypes.func.isRequired,
    selectedAnnotationValues: PropTypes.array.isRequired,
  };

  toggleFilters = () => {
    this.setState(prevState => ({
      showFilters: !prevState.showFilters,
    }));
  }

  render() {
    return (
      <SearchFilterWrapper>
        <Form>
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <TaxaFilter
                  handleSelectedClick={this.props.handleSelectedClick}
                  handleSpeciesChange={this.props.handleSpeciesChange}
                  handleSpeciesSelect={this.props.handleSpeciesSelect}
                  selectedSpecies={this.props.selectedSpecies}
                  excludedSpecies={this.props.excludedSpecies}
                  speciesValue={this.props.speciesValue}
                  speciesMatch={this.props.speciesMatch}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <PlacesFilter
                  handleSelectedClick={this.props.handleSelectedClick}
                  handlePlacesChange={this.props.handlePlacesChange}
                  handlePlacesSelect={this.props.handlePlacesSelect}
                  selectedPlaces={this.props.selectedPlaces}
                  excludedPlaces={this.props.excludedPlaces}
                  placesValue={this.props.placesValue}
                  placesMatch={this.props.placesMatch}
                />
              </FormGroup>
            </Col>
          </Row>
          {this.state.showFilters && <Row>
            <Col>
              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <UsersFilter
                      handleSelectedClick={this.props.handleSelectedClick}
                      handleUsersChange={this.props.handleUsersChange}
                      handleUsersSelect={this.props.handleUsersSelect}
                      selectedUsers={this.props.selectedUsers}
                      excludedUsers={this.props.excludedUsers}
                      usersValue={this.props.usersValue}
                      usersMatch={this.props.usersMatch}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <IdentUsersFilter
                      handleSelectedClick={this.props.handleSelectedClick}
                      handleIdentUsersChange={this.props.handleIdentUsersChange}
                      handleIdentUsersSelect={this.props.handleIdentUsersSelect}
                      selectedIdentUsers={this.props.selectedIdentUsers}
                      identUsersValue={this.props.identUsersValue}
                      identUsersMatch={this.props.identUsersMatch}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <AnnotationsFilter
                      handleSelectedClick={this.props.handleSelectedClick}
                      handleAnnotationTermSelect={this.props.handleAnnotationTermSelect}
                      selectedAnnotations={this.props.selectedAnnotations}
                      excludedAnnotations={this.props.excludedAnnotations}
                      annotationsValue={this.props.annotationsValue}
                      annotationsMatch={this.props.annotationsMatch}
                      handleAnnotationValueSelect={this.props.handleAnnotationValueSelect}
                      selectedAnnotationValues={this.props.selectedAnnotationValues}
                      excludedAnnotationValues={this.props.excludedAnnotationValues}
                      annotationsValuesMatch={this.props.annotationsMatch}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <ObservationFieldFilter
                      handleSelectedClick={this.props.handleSelectedClick}
                      handleObsFieldTermChange={this.props.handleObsFieldTermChange}
                      handleObsFieldTermSelect={this.props.handleObsFieldTermSelect}
                      selectedObsFieldTerm={this.props.selectedObsFieldTerm}
                      obsFieldTermValue={this.props.obsFieldTermValue}
                      obsFieldTermMatch={this.props.obsFieldTermMatch}
                      currentlySelectedObsTerm={this.props.currentlySelectedObsTerm}
                      handleObsFieldValueChange={this.props.handleObsFieldValueChange}
                      obsFieldValue={this.props.obsFieldValue}
                      handleSpeciesChange={this.props.handleSpeciesChange}
                      obsFieldValueMatch={this.props.obsFieldValueMatch}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <CheckboxesFilter
                    checkboxes={this.props.checkboxes}
                    handleCheckbox={this.props.handleCheckbox}
                  />
                </Col>
              </Row>
            </Col>
          </Row>}
          <Row>
            <Col>
              <FilterToggle onClick={this.toggleFilters}>
                {this.state.showFilters ? 'Hide filters' : 'Show Filters'}
              </FilterToggle>
            </Col>
          </Row>
        </Form>
      </SearchFilterWrapper>
    );
  }
}


export default SearchFilter;
