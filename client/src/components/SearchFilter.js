/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
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
    excludedSpecies: PropTypes.array.isRequired,
    handleSpeciesChange: PropTypes.func.isRequired,
    handleSelectedClick: PropTypes.func.isRequired,
    handleSpeciesSelect: PropTypes.func.isRequired,
    speciesMatch: PropTypes.array.isRequired,
    selectedSpecies: PropTypes.array.isRequired,
    speciesValue: PropTypes.string,
  };

  render() {
    const selectedSpeciesLabel = this.props.selectedSpecies.length > 0 ? 'Selected Taxa: ' : '';
    const excludedSpeciesLabel = this.props.excludedSpecies.length > 0 ? 'Excluded Taxa: ' : '';

    return (
      <SearchFilterWrapper>
        <Form>
          <FormGroup>
            <Form.Control size="md" type="text" placeholder="Species" onChange={this.props.handleSpeciesChange} value={this.props.speciesValue} />
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
          <Form.Control size="md" type="text" placeholder="Location" />
        </Form>
      </SearchFilterWrapper>
    );
  }
}


export default SearchFilter;
