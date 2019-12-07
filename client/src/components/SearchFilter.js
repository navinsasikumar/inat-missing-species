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
  padding-bottom: 10px;
`;

const MultiSelected = styled.div`
  color: white;
  display: inline-block;
  font-size: 65%;
  padding-right: 20px;
  &:empty {
    display:none;
  }
`;

const CheckboxesWrapper = styled.div`
  font-size: 75%;
  padding: 10px 0;
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
    handleAnnotationValueChange: PropTypes.func.isRequired,
    annotationValue: PropTypes.string,
  };

  createObsFieldValueElem = () => {
    const obsFieldTermObj = this.props.selectedObsFieldTerm
      .filter(e => e.name === this.props.currentlySelectedObsTerm)[0];
    let obsFieldValueInput = <Form.Control size="sm" type="text" placeholder="Observation Field Value" onChange={this.props.handleObsFieldValueChange} value={this.props.obsFieldValue} />;
    if (obsFieldTermObj) {
      if (obsFieldTermObj.datatype === 'text' && obsFieldTermObj.allowedValues) {
        const allowedValues = obsFieldTermObj.allowedValues.split('|');
        const selectOpts = allowedValues.map(val => <option key={`${obsFieldTermObj.id}-${val}`} value={val}>{val}</option>);
        obsFieldValueInput = (
          <Form.Control as="select" size="sm" onChange={this.props.handleObsFieldValueChange}>
            <option selected disabled>Select {obsFieldTermObj.name}</option>
            <option value="any">Any</option>
            {selectOpts}
          </Form.Control>
        );
      } else if (obsFieldTermObj.datatype === 'taxon') {
        // TODO Show species selection field here
      } else if (obsFieldTermObj.datatype === 'date') {
        // TODO Show date selector here
      } else if (obsFieldTermObj.datatype === 'numeric') {
        // TODO Enforce numeric values
      }
    }
    return obsFieldValueInput;
  }

  render() {
    const selectedSpeciesLabel = this.props.selectedSpecies.length > 0 ? 'Selected Taxa: ' : '';
    const excludedSpeciesLabel = this.props.excludedSpecies.length > 0 ? 'Excluded Taxa: ' : '';

    const selectedPlacesLabel = this.props.selectedPlaces.length > 0 ? 'Selected Places: ' : '';
    const excludedPlacesLabel = this.props.excludedPlaces.length > 0 ? 'Excluded Places: ' : '';

    const selectedUsersLabel = this.props.selectedUsers.length > 0 ? 'Selected Users: ' : '';
    const excludedUsersLabel = this.props.excludedUsers.length > 0 ? 'Excluded Users: ' : '';

    const selectedIdentUsersLabel = this.props.selectedIdentUsers.length > 0 ? 'Selected Users: ' : '';

    const selectedObsTermLabel = this.props.selectedObsFieldTerm.length > 0 ? 'Selected Terms: ' : '';

    const obsFieldValueInput = this.createObsFieldValueElem();

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
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <Form.Control size="sm" type="text" placeholder="Observing User" onChange={this.props.handleUsersChange} value={this.props.usersValue} />
                <AutoComplete type="users" matches={this.props.usersMatch} handleUsersSelect={this.props.handleUsersSelect}/>
                <MultiSelected>
                  {selectedUsersLabel}
                  {this.props.selectedUsers.map((user, index) => (
                    <SelectedFilters
                      key={user.id}
                      selectedIndex={index}
                      selectedValue={user}
                      selectedType="users"
                      handleSelectedClick={this.props.handleSelectedClick}
                    />
                  ))}
                </MultiSelected>
                <MultiSelected>
                  {excludedUsersLabel}
                  {this.props.excludedUsers.map((user, index) => (
                    <SelectedFilters
                      key={user.id}
                      selectedIndex={index}
                      selectedValue={user}
                      selectedType="usersExclude"
                      handleSelectedClick={this.props.handleSelectedClick}
                    />
                  ))}
                </MultiSelected>
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Form.Control size="sm" type="text" placeholder="Identifying User" onChange={this.props.handleIdentUsersChange} value={this.props.identUsersValue} />
                <AutoComplete type="identUsers" matches={this.props.identUsersMatch} handleIdentUsersSelect={this.props.handleIdentUsersSelect}/>
                <MultiSelected>
                  {selectedIdentUsersLabel}
                  {this.props.selectedIdentUsers.map((user, index) => (
                    <SelectedFilters
                      key={user.id}
                      selectedIndex={index}
                      selectedValue={user}
                      selectedType="identUsers"
                      handleSelectedClick={this.props.handleSelectedClick}
                    />
                  ))}
                </MultiSelected>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={4} md={2}>
              <Form.Control as="select" size="sm">
                <option selected disabled>Annotations</option>
                <option>Life Stage</option>
                <option>Sex</option>
                <option>Plant Phenology</option>
              </Form.Control>
            </Col>
            <Col xs={8} md={4}>
                <Form.Control size="sm" type="text" placeholder="Annotation Value" onChange={this.props.handleAnnotationValueChange} value={this.props.annotationValue} />
            </Col>
            <Col xs={12} md={6}>
              <Row>
                <Col xs={6} md={6}>
                    <Form.Control size="sm" type="text" placeholder="Observation Field" onChange={this.props.handleObsFieldTermChange} value={this.props.obsFieldTermValue} />
                    <AutoComplete type="obsFieldTerm" matches={this.props.obsFieldTermMatch} handleObsFieldTermSelect={this.props.handleObsFieldTermSelect}/>
                </Col>
                <Col xs={6} md={6}>
                    {obsFieldValueInput}
                </Col>
              </Row>
              <Row>
                <Col>
                    <MultiSelected>
                      {selectedObsTermLabel}
                      {this.props.selectedObsFieldTerm.map((term, index) => (
                        <SelectedFilters
                          key={term.id}
                          selectedIndex={index}
                          selectedValue={term}
                          selectedType="obsTerm"
                          handleSelectedClick={this.props.handleSelectedClick}
                        />
                      ))}
                    </MultiSelected>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <CheckboxesWrapper>
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'captive')} id="captive-check" label="Captive" checked={this.props.checkboxes && (this.props.checkboxes.captive === 'true' || this.props.checkboxes.captive === 'any')} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'wild')} id="wild-check" label="Wild" checked={this.props.checkboxes && (this.props.checkboxes.captive === 'false' || this.props.checkboxes.wild === 'true' || this.props.checkboxes.captive === 'any')} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'native')} id="native-check" label="Native" checked={this.props.checkboxes && this.props.checkboxes.native === 'true'} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'introduced')} id="introduced-check" label="Introduced" checked={this.props.checkboxes && this.props.checkboxes.introduced === 'true'} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'out_of_range')} id="oor-check" label="Out of Range" checked={this.props.checkboxes && this.props.checkboxes.out_of_range === 'true'} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'threatened')} id="threatened-check" label="Threatened" checked={this.props.checkboxes && this.props.checkboxes.threatened === 'true'} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'endemic')} id="endemic-check" label="Endemic" checked={this.props.checkboxes && this.props.checkboxes.endemic === 'true'} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'verifiable')} id="verifiable-check" label="Verifiable" checked={this.props.checkboxes && this.props.checkboxes.verifiable === 'true'} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'research')} id="rg-check" label="Research Grade" checked={this.props.checkboxes && (this.props.checkboxes.quality_grade === 'research')} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'needs_id')} id="needs-id-check" label="Needs ID" checked={this.props.checkboxes && (this.props.checkboxes.quality_grade === 'needs_id')} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'casual')} id="casual-check" label="Casual" checked={this.props.checkboxes && (this.props.checkboxes.quality_grade === 'casual')} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'photos')} id="photos-check" label="Has Photos" checked={this.props.checkboxes && this.props.checkboxes.photos === 'true'} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'sounds')} id="sounds-check" label="Has Sounds" checked={this.props.checkboxes && this.props.checkboxes.sounds === 'true'} />
                <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'popular')} id="popular-check" label="Popular" checked={this.props.checkboxes && this.props.checkboxes.popular === 'true'} />
              </CheckboxesWrapper>
            </Col>
          </Row>
        </Form>
      </SearchFilterWrapper>
    );
  }
}


export default SearchFilter;
