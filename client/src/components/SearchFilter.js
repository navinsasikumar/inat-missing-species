/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AutoComplete from './AutoComplete';
import SelectedFilters from './SelectedFilters';

const MultiSelected = styled.div`
  text-align: left;
  color: white;
  font-size: 65%;
`;

class SearchFilter extends Component {
  static propTypes= {
    handleSpeciesSelect: PropTypes.func.isRequired,
    handleSpeciesChange: PropTypes.func.isRequired,
    handleSelectedClick: PropTypes.func.isRequired,
    selectedSpecies: PropTypes.array.isRequired,
    speciesValue: PropTypes.string,
    speciesMatch: PropTypes.array.isRequired,
  };

  render() {
    return (
      <div className="SearchFilter">
        <Form>
          <Form.Control size="md" type="text" placeholder="Species" onChange={this.props.handleSpeciesChange} value={this.props.speciesValue} />
          <MultiSelected>
            {this.props.selectedSpecies.map((species, index) => (
              <SelectedFilters
                key={species.id}
                selectedValue={species}
                selectedType="species"
                selectedIndex={index}
                handleSelectedClick={this.props.handleSelectedClick}
              />
            ))}
          </MultiSelected>
          <Form.Control size="md" type="text" placeholder="Location" />
        </Form>
        <AutoComplete type="species" matches={this.props.speciesMatch} handleSpeciesSelect={this.props.handleSpeciesSelect}/>
      </div>
    );
  }
}


export default SearchFilter;
