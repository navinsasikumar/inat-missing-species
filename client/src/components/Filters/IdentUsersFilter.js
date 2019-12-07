/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
} from 'react-bootstrap';
import AutoComplete from '../AutoComplete';
import SelectedFieldDisplay from './SelectedFieldDisplay';

class IdentUsersFilter extends Component {
  static propTypes= {
    handleSelectedClick: PropTypes.func.isRequired,
    handleIdentUsersChange: PropTypes.func.isRequired,
    handleIdentUsersSelect: PropTypes.func.isRequired,
    identUsersMatch: PropTypes.array.isRequired,
    selectedIdentUsers: PropTypes.array.isRequired,
    identUsersValue: PropTypes.string,
  };

  render() {
    const selectedIdentUsersLabel = this.props.selectedIdentUsers.length > 0 ? 'Selected Users: ' : '';

    return (
      <div>
        <Form.Control size="sm" type="text" placeholder="Identifying User" onChange={this.props.handleIdentUsersChange} value={this.props.identUsersValue} />
        <AutoComplete type="identUsers" matches={this.props.identUsersMatch} handleIdentUsersSelect={this.props.handleIdentUsersSelect}/>
        <SelectedFieldDisplay
          handleSelectedClick={this.props.handleSelectedClick}
          selectedArray={this.props.selectedIdentUsers}
          selectedLabel={selectedIdentUsersLabel}
          selectedType="identUsers"
        />
      </div>
    );
  }
}

export default IdentUsersFilter;
