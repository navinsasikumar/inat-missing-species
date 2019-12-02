/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Col,
  Row,
} from 'react-bootstrap';

const AutoCompleteUL = styled.ul`
  background-color: #1B1D22;
  color: white;
  cursor: pointer;
  font-size: 65%;
  list-style-type: none;
  padding-left: 0;
  padding-top: 5px;
  position: absolute;
  text-align: left;
  width: 400px;
  z-index: 1000;
`;

const SpeciesItem = styled.div`
  border: solid 1px #333;
  padding: 1px;
`;

const IncludeSpeciesItem = styled.div`
  display: inline-block;
  width: 100%;
  :hover {
    color: grey;
  }
`;

const ExcludeSpeciesItem = styled.div`
  display: inline-block;
  :hover {
    color: grey;
  }
`;

const PhotoDiv = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 40px;
`;

const PhotoImg = styled.img`
  width: 40px;
  height: 40px;
`;

const Names = styled.div`
  display: inline-block;
  padding-left: 5px;
`;

const CommonName = styled.div`
  text-transform: capitalize;
`;

const Latin = styled.div``;

const LatinName = styled.div`
  display: inline-block;
`;
const Rank = styled.div`
  text-transform: capitalize;
  display: inline-block;
`;

class AutoComplete extends Component {
  constructor(props) {
    super(props);

    this.handleSpeciesSelect = this.handleSpeciesSelect.bind(this);
  }

  static propTypes= {
    matches: PropTypes.array.isRequired,
    handleSpeciesSelect: PropTypes.func.isRequired,
  };

  handleSpeciesSelect = (species, exclude) => {
    const selectedSpecies = {
      id: species.id,
      name: species.name,
      common: species.preferred_common_name,
    };
    this.props.handleSpeciesSelect(selectedSpecies, exclude);
  }

  render() {
    const speciesList = this.props.matches.map((species) => {
      let photoElem;
      if (species.default_photo && species.default_photo.square_url) {
        photoElem = <PhotoImg
          src={species.default_photo.square_url}
          alt={species.name}
        />;
      } else {
        photoElem = '';
      }

      return (
        <li key={species.id} data-id={species.id}>
            <SpeciesItem>
              <Row>
                <Col xs={9} className="trimText">
                  <IncludeSpeciesItem onClick={() => this.handleSpeciesSelect(species, false)}>
                    <PhotoDiv>
                      {photoElem}
                    </PhotoDiv>
                    <Names>
                      <CommonName>{species.preferred_common_name}</CommonName>
                      <Latin>
                        <Rank>{species.rank === 'species' ? '' : `${species.rank}\u00a0`}</Rank><LatinName>{species.name}</LatinName></Latin>
                    </Names>
                  </IncludeSpeciesItem>
                </Col>
                <Col xs={3} className="autocomplete-exclude-species">
                  <ExcludeSpeciesItem onClick={() => this.handleSpeciesSelect(species, true)}>
                    Exclude
                  </ExcludeSpeciesItem>
                </Col>
              </Row>
            </SpeciesItem>
        </li>
      );
    });

    return (
      <div>
        <AutoCompleteUL>
          {speciesList}
        </AutoCompleteUL>
      </div>
    );
  }
}


export default AutoComplete;
