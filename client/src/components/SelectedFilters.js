/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SelectedFilterWrapper = styled.div`
  border: solid 1px #333;
  border-radius: 1px;
  cursor: pointer;
  display: inline-block;
  margin: 3px 5px;
  padding: 3px 5px;
`;

const SelectedFilterDisplay = styled.div`
  display: inline-block;
`;

const SelectedFilterClose = styled.div`
  display: inline-block;
  margin-left: 5px;
`;

class SelectedFilters extends Component {
  static propTypes= {
    handleSelectedClick: PropTypes.func.isRequired,
    selectedIndex: PropTypes.number.isRequired,
    selectedType: PropTypes.string.isRequired,
    selectedValue: PropTypes.object.isRequired,
  };

  toTitleCase = str => str.replace(
    /\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );

  render() {
    let selectedDisplay;
    const type = this.props.selectedType;
    if (type === 'species' || type === 'speciesExclude') {
      selectedDisplay = this.toTitleCase(this.props.selectedValue.common);
    } else if (type === 'places' || type === 'placesExclude') {
      selectedDisplay = this.props.selectedValue.display;
    } else if (type === 'users' || type === 'usersExclude') {
      selectedDisplay = this.props.selectedValue.login;
    }

    return (
      <SelectedFilterWrapper onClick={() => this.props.handleSelectedClick(
        this.props.selectedIndex,
        this.props.selectedType,
        this.props.selectedValue,
      )}>
        <SelectedFilterDisplay>{selectedDisplay}</SelectedFilterDisplay>
        <SelectedFilterClose>x</SelectedFilterClose>
      </SelectedFilterWrapper>
    );
  }
}


export default SelectedFilters;
