/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
} from 'react-bootstrap';
import AutoComplete from '../AutoComplete';
import SelectedFieldDisplay from './SelectedFieldDisplay';

class UsersFilter extends Component {
  static propTypes= {
    handleSelectedClick: PropTypes.func.isRequired,
    excludedUsers: PropTypes.array.isRequired,
    handleUsersChange: PropTypes.func.isRequired,
    handleUsersSelect: PropTypes.func.isRequired,
    usersMatch: PropTypes.array.isRequired,
    selectedUsers: PropTypes.array.isRequired,
    usersValue: PropTypes.string,
  };

  render() {
    const selectedUsersLabel = this.props.selectedUsers.length > 0 ? 'Selected Users: ' : '';
    const excludedUsersLabel = this.props.excludedUsers.length > 0 ? 'Excluded Users: ' : '';

    return (
      <div>
        <Form.Control size="sm" type="text" placeholder="Observing User" onChange={this.props.handleUsersChange} value={this.props.usersValue} />
        <AutoComplete type="users" matches={this.props.usersMatch} handleUsersSelect={this.props.handleUsersSelect}/>
        <SelectedFieldDisplay
          handleSelectedClick={this.props.handleSelectedClick}
          selectedArray={this.props.selectedUsers}
          selectedLabel={selectedUsersLabel}
          selectedType="users"
        />
        <SelectedFieldDisplay
          handleSelectedClick={this.props.handleSelectedClick}
          selectedArray={this.props.excludedUsers}
          selectedLabel={excludedUsersLabel}
          selectedType="usersExclude"
        />
      </div>
    );
  }
}

export default UsersFilter;
