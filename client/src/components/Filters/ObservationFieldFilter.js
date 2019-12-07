/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Form,
  Row,
} from 'react-bootstrap';
import AutoComplete from '../AutoComplete';
import SelectedFieldDisplay from './SelectedFieldDisplay';

class ObservationFieldFilter extends Component {
  static propTypes= {
    handleSelectedClick: PropTypes.func.isRequired,
    handleObsFieldTermChange: PropTypes.func.isRequired,
    handleObsFieldTermSelect: PropTypes.func.isRequired,
    obsFieldTermMatch: PropTypes.array.isRequired,
    selectedObsFieldTerm: PropTypes.array.isRequired,
    currentlySelectedObsTerm: PropTypes.string.isRequired,
    obsFieldTermValue: PropTypes.string,
    handleObsFieldValueChange: PropTypes.func.isRequired,
    obsFieldValue: PropTypes.string,
    handleSpeciesChange: PropTypes.func.isRequired,
    obsFieldValueMatch: PropTypes.array.isRequired,
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
            {selectOpts}
          </Form.Control>
        );
      } else if (obsFieldTermObj.datatype === 'taxon') {
        obsFieldValueInput = (
          <div>
            <Form.Control size="sm" type="text" placeholder="Species" onChange={e => this.props.handleSpeciesChange(e, 'obsFieldValueMatch')} value={this.props.obsFieldValue} />
            <AutoComplete type="species" matches={this.props.obsFieldValueMatch} handleSpeciesSelect={this.props.handleObsFieldValueChange} noExclude={true} />
          </div>
        );
      } else if (obsFieldTermObj.datatype === 'date') {
        // TODO Show date selector here
      } else if (obsFieldTermObj.datatype === 'numeric') {
        // TODO Enforce numeric values
      }
    }
    return obsFieldValueInput;
  }

  render() {
    const selectedObsTermLabel = this.props.selectedObsFieldTerm.length > 0 ? 'Selected Terms: ' : '';
    const obsFieldValueInput = this.createObsFieldValueElem();

    return (
      <div>
        <Row>
          <Col xs={6} md={6} className="no-padding-right">
              <Form.Control size="sm" type="text" placeholder="Observation Field" onChange={this.props.handleObsFieldTermChange} value={this.props.obsFieldTermValue} />
              <AutoComplete type="obsFieldTerm" matches={this.props.obsFieldTermMatch} handleObsFieldTermSelect={this.props.handleObsFieldTermSelect}/>
          </Col>
          <Col xs={6} md={6}>
              {obsFieldValueInput}
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectedFieldDisplay
              handleSelectedClick={this.props.handleSelectedClick}
              selectedArray={this.props.selectedObsFieldTerm}
              selectedLabel={selectedObsTermLabel}
              selectedType="obsTerm"
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ObservationFieldFilter;
