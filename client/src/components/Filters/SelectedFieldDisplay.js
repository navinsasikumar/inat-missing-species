/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SelectedFilters from '../SelectedFilters';

const MultiSelected = styled.div`
  color: white;
  display: inline-block;
  font-size: 65%;
  padding-right: 20px;
  &:empty {
    display:none;
  }
`;

class SelectedFieldsDisplay extends Component {
  static propTypes= {
    handleSelectedClick: PropTypes.func.isRequired,
    selectedArray: PropTypes.array.isRequired,
    selectedLabel: PropTypes.string.isRequired,
    selectedType: PropTypes.string.isRequired,
  };

  render() {
    return (
      <MultiSelected>
        {this.props.selectedLabel}
        {this.props.selectedArray.map((item, index) => (
          <SelectedFilters
            key={item.id}
            selectedIndex={index}
            selectedValue={item}
            selectedType={this.props.selectedType}
            handleSelectedClick={this.props.handleSelectedClick}
          />
        ))}
      </MultiSelected>
    );
  }
}

export default SelectedFieldsDisplay;
