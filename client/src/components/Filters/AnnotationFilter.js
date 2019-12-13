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
    const annotationValues = JSON.parse(JSON.stringify(annotation.values));
    annotationValues.forEach((value) => {
      const annotationVal = value;
      annotationVal.termId = annotation.id;
      annotationVal.termLabel = annotation.label;
    });
    this.setState({
      annotationMatches: annotationValues,
      annotationFocus: false,
      excludeTerm: exclude,
    });
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

  diff = (arr1, arr2) => arr1.filter(x => !arr2.map(y => y.termId).includes(x.id))

  render() {
    const selectedAnnotations = [
      ...this.props.selectedAnnotationValues,
      ...this.diff(this.props.selectedAnnotations, this.props.selectedAnnotationValues),
    ];
    const excludedAnnotations = [
      ...this.props.excludedAnnotationValues,
      ...this.diff(this.props.excludedAnnotations, this.props.excludedAnnotationValues),
    ];
    const selectedAnnotationTermLabel = selectedAnnotations.length > 0 ? 'Selected Annotations: ' : '';
    const excludedAnnotationTermLabel = excludedAnnotations.length > 0 ? 'Excluded Annotations: ' : '';

    return (
      <div>
        <Row>
          <Col xs={6} md={6} className="no-padding-right">
            <Form.Control size="sm" type="text" placeholder="Annotations" onFocus={this.handleAnnotationTermFocus} onBlur={this.handleAnnotationTermBlur} value={this.props.annotationTermValue} />
            {this.state.annotationFocus && <AutoComplete type="annotationTerm" matches={this.state.annotations} handleAnnotationTermSelect={this.handleAnnotationTermSelect}/>}
          </Col>
          <Col xs={6} md={6}>
            <Form.Control size="sm" type="text" placeholder="Annotation Value" onFocus={this.handleAnnotationValueFocus} onBlur={this.handleAnnotationValueBlur} value={this.props.annotationValue} />
            {this.state.annotationValueFocus && <AutoComplete type="annotationValue" matches={this.state.annotationMatches} handleAnnotationValueSelect={this.handleAnnotationValueSelect} noExclude={this.state.excludeTerm} />}
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectedFieldDisplay
              handleSelectedClick={this.props.handleSelectedClick}
              selectedArray={selectedAnnotations}
              selectedLabel={selectedAnnotationTermLabel}
              selectedType="annotationValues"
            />
            <SelectedFieldDisplay
              handleSelectedClick={this.props.handleSelectedClick}
              selectedArray={excludedAnnotations}
              selectedLabel={excludedAnnotationTermLabel}
              selectedType="annotationValuesExclude"
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AnnotationsFilter;
