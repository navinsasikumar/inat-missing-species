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
  &:empty {
    display:none;
  }
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
  };

  render() {
    const selectedSpeciesLabel = this.props.selectedSpecies.length > 0 ? 'Selected Taxa: ' : '';
    const excludedSpeciesLabel = this.props.excludedSpecies.length > 0 ? 'Excluded Taxa: ' : '';

    const selectedPlacesLabel = this.props.selectedPlaces.length > 0 ? 'Selected Places: ' : '';
    const excludedPlacesLabel = this.props.excludedPlaces.length > 0 ? 'Excluded Places: ' : '';

    const selectedUsersLabel = this.props.selectedUsers.length > 0 ? 'Selected Users: ' : '';
    const excludedUsersLabel = this.props.excludedUsers.length > 0 ? 'Excluded Users: ' : '';

    const selectedIdentUsersLabel = this.props.selectedIdentUsers.length > 0 ? 'Selected Users: ' : '';

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
            <Col>
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'captive')} id="captive-check" label="Captive" checked={this.props.checkboxes && (this.props.checkboxes.captive === 'true' || this.props.checkboxes.captive === 'any')} />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'wild')} id="wild-check" label="Wild" checked={this.props.checkboxes && (this.props.checkboxes.captive === 'false' || this.props.checkboxes.wild === 'true' || this.props.checkboxes.captive === 'any')} />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'native')} id="native-check" label="Native" />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'introduced')} id="introduced-check" label="Introduced" />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'outOfRange')} id="oor-check" label="Out of Range" />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'threatened')} id="threatened-check" label="Threatened" />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'endemic')} id="endemic-check" label="Endemic" />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'verifiable')} id="verifiable-check" label="Verifiable" />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'research')} id="rg-check" label="Research Grade" checked={this.props.checkboxes && (this.props.checkboxes.qualityGrade === 'research')} />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'needs_id')} id="needs-id-check" label="Needs ID" checked={this.props.checkboxes && (this.props.checkboxes.qualityGrade === 'needs_id')} />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'casual')} id="casual-check" label="Casual" checked={this.props.checkboxes && (this.props.checkboxes.qualityGrade === 'casual')} />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'hasPhotos')} id="photos-check" label="Has Photos" />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'hasSounds')} id="sounds-check" label="Has Sounds" />
              <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'popular')} id="popular-check" label="Popular" />
            </Col>
          </Row>
        </Form>
      </SearchFilterWrapper>
    );
  }
}


export default SearchFilter;
