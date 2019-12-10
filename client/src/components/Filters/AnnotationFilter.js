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

class AnnotationsFilter extends Component {
  constructor(props) {
    super(props);
    this.callApi = this.callApi.bind(this);

    this.state = {
      annotations: [],
      annotationFocus: false,
      annotationValueFocus: false,
      annotationMatches: [],
    };
  }

  static propTypes = {
    annotationTermValue: PropTypes.string,
    annotationValue: PropTypes.array,
    excludedAnnotations: PropTypes.array.isRequired,
    excludedAnnotationValues: PropTypes.array.isRequired,
    handleAnnotationTermSelect: PropTypes.func.isRequired,
    handleAnnotationValueSelect: PropTypes.func,
    handleSelectedClick: PropTypes.func.isRequired,
    selectedAnnotations: PropTypes.array.isRequired,
    selectedAnnotationValues: PropTypes.array.isRequired,
  };

  callApi = async () => {
    const url = '/api/annotations';
    const resp = await fetch(url);
    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      this.setState({ errors: e });
    }

    if (resp.status !== 200) {
      throw Error(data ? data.message : 'No data');
    }
    return data.results;
  }

  handleAnnotationTermFocus = () => {
    this.setState({ annotationFocus: true });
  };

  handleAnnotationTermBlur = () => {
    this.setState({ annotationFocus: false });
  };

  handleAnnotationValueFocus = () => {
    this.setState({ annotationValueFocus: true });
  };

  handleAnnotationValueBlur = () => {
    this.setState({ annotationValueFocus: false });
  };

  handleAnnotationTermSelect = (annotation, exclude) => {
    // TODO Add termId and termLabel to annotationMatches
    this.setState({ annotationMatches: annotation.values, annotationFocus: false });
    this.props.handleAnnotationTermSelect(annotation, exclude);
  }

  handleAnnotationValueSelect = (annotation, exclude) => {
    this.setState({ annotationValueFocus: false });
    this.props.handleAnnotationValueSelect(annotation, exclude);
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ annotations: res }))
      .catch(e => this.setState({ errors: e }));
  }

  render() {
    const selectedAnnotationTermLabel = this.props.selectedAnnotations.length > 0 ? 'Selected Annotations: ' : '';
    const excludedAnnotationTermLabel = this.props.excludedAnnotations.length > 0 ? 'Excluded Annotations: ' : '';

    return (
      <div>
        <Row>
          <Col xs={6} md={6} className="no-padding-right">
            <Form.Control size="sm" type="text" placeholder="Annotations" onFocus={this.handleAnnotationTermFocus} onBlur={this.handleAnnotationTermBlur} value={this.props.annotationTermValue} />
            {this.state.annotationFocus && <AutoComplete type="annotationTerm" matches={this.state.annotations} handleAnnotationTermSelect={this.handleAnnotationTermSelect}/>}
          </Col>
          <Col xs={6} md={6}>
            <Form.Control size="sm" type="text" placeholder="Annotation Value" onFocus={this.handleAnnotationValueFocus} onBlur={this.handleAnnotationValueBlur} value={this.props.annotationValue} />
            {this.state.annotationValueFocus && <AutoComplete type="annotationValue" matches={this.state.annotationMatches} handleAnnotationValueSelect={this.handleAnnotationValueSelect}/>}
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectedFieldDisplay
              handleSelectedClick={this.props.handleSelectedClick}
              selectedArray={this.props.selectedAnnotations}
              selectedLabel={selectedAnnotationTermLabel}
              selectedType="annotationTerms"
            />
            <SelectedFieldDisplay
              handleSelectedClick={this.props.handleSelectedClick}
              selectedArray={this.props.excludedAnnotations}
              selectedLabel={excludedAnnotationTermLabel}
              selectedType="annotationTermsExclude"
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AnnotationsFilter;
