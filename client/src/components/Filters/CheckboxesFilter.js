/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
} from 'react-bootstrap';
import styled from 'styled-components';

const CheckboxesWrapper = styled.div`
  font-size: 75%;
  padding: 10px 0;
`;

class Checkbox extends Component {
  static propTypes= {
    checkboxes: PropTypes.object,
    handleCheckbox: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  };

  render() {
    const qualityGrades = ['research', 'needs_id', 'casual'];
    const { type } = this.props;
    let newType = type;
    let value = 'true';
    if (qualityGrades.includes(type)) {
      value = type;
      newType = 'quality_grade';
    }
    return (
      <Form.Check
        inline size="sm"
        type="checkbox"
        onChange={e => this.props.handleCheckbox(e, type)}
        id={`${type}-check`}
        label={this.props.label}
        checked={this.props.checkboxes && this.props.checkboxes[newType] === value}
      />
    );
  }
}

class CheckboxesFilter extends Component {
  static propTypes= {
    checkboxes: PropTypes.object,
    handleCheckbox: PropTypes.func.isRequired,
  };

  render() {
    const checkboxes = [
      { type: 'native', label: 'Native' },
      { type: 'introduced', label: 'Introduced' },
      { type: 'out_of_range', label: 'Out of Range' },
      { type: 'threatened', label: 'Threatened' },
      { type: 'endemic', label: 'Endemic' },
      { type: 'verifiable', label: 'Verifiable' },
      { type: 'research', label: 'Research Grade' },
      { type: 'needs_id', label: 'Needs ID' },
      { type: 'casual', label: 'Casual' },
      { type: 'photos', label: 'Has Photos' },
      { type: 'sounds', label: 'Has Sounds' },
      { type: 'popular', label: 'Popular' },
    ];

    const checkboxElems = checkboxes.map(checkbox => (
      <Checkbox
        key={`checkbox-${checkbox.type}`}
        checkboxes={this.props.checkboxes}
        handleCheckbox={this.props.handleCheckbox}
        type={checkbox.type}
        label={checkbox.label}
      />
    ));

    return (
      <CheckboxesWrapper>
        <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'captive')} id="captive-check" label="Captive" checked={this.props.checkboxes && (this.props.checkboxes.captive === 'true' || this.props.checkboxes.captive === 'any')} />
        <Form.Check inline size="sm" type="checkbox" onChange={e => this.props.handleCheckbox(e, 'wild')} id="wild-check" label="Wild" checked={this.props.checkboxes && (this.props.checkboxes.captive === 'false' || this.props.checkboxes.wild === 'true' || this.props.checkboxes.captive === 'any')} />
        {checkboxElems}
      </CheckboxesWrapper>
    );
  }
}

export default CheckboxesFilter;
