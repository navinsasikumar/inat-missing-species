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

const MatchItem = styled.div`
  border: solid 1px #333;
  padding: 1px;
`;

const IncludeMatchItem = styled.div`
  display: inline-block;
  width: 100%;
  :hover {
    color: grey;
  }
`;

const ExcludeMatchItem = styled.div`
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
    this.displaySpecies = this.displaySpecies.bind(this);

    this.handlePlacesSelect = this.handlePlacesSelect.bind(this);
    this.displayPlaces = this.displayPlaces.bind(this);

    this.handleUsersSelect = this.handleUsersSelect.bind(this);
    this.displayUsers = this.displayUsers.bind(this);

    this.handleIdentUsersSelect = this.handleIdentUsersSelect.bind(this);
    this.displayIdentUsers = this.displayIdentUsers.bind(this);
  }

  static propTypes= {
    type: PropTypes.string.isRequired,
    matches: PropTypes.array.isRequired,
    handleSpeciesSelect: PropTypes.func,
    handlePlacesSelect: PropTypes.func,
    handleUsersSelect: PropTypes.func,
    handleIdentUsersSelect: PropTypes.func,
    handleObsFieldTermSelect: PropTypes.func,
    noExclude: PropTypes.bool,
  };

  handleSpeciesSelect = (species, exclude) => {
    const selectedSpecies = {
      id: species.id,
      name: species.name,
      common: species.preferred_common_name,
    };
    this.props.handleSpeciesSelect(selectedSpecies, exclude);
  }

  displaySpecies = () => this.props.matches.map((species) => {
    let photoElem;
    if (species.default_photo && species.default_photo.square_url) {
      photoElem = <PhotoImg
        src={species.default_photo.square_url}
        alt={species.name}
      />;
    } else {
      photoElem = '';
    }
    const includeColLength = this.props.noExclude ? 12 : 9;

    return (
      <li key={species.id} data-id={species.id}>
          <MatchItem>
            <Row>
              <Col xs={includeColLength} className="trimText">
                <IncludeMatchItem onClick={() => this.handleSpeciesSelect(species, false)}>
                  <PhotoDiv>
                    {photoElem}
                  </PhotoDiv>
                  <Names>
                    <CommonName>{species.preferred_common_name}</CommonName>
                    <Latin>
                      <Rank>{species.rank === 'species' ? '' : `${species.rank}\u00a0`}</Rank><LatinName>{species.name}</LatinName>
                    </Latin>
                  </Names>
                </IncludeMatchItem>
              </Col>
              {this.props.noExclude !== true && <Col xs={3} className="autocomplete-exclude-matches">
                  <ExcludeMatchItem onClick={() => this.handleSpeciesSelect(species, true)}>
                    Exclude
                  </ExcludeMatchItem>
                </Col>
              }
            </Row>
          </MatchItem>
      </li>
    );
  });

  handlePlacesSelect = (place, exclude) => {
    const selectedPlaces = {
      id: place.id,
      name: place.name,
      display: place.display_name,
    };
    this.props.handlePlacesSelect(selectedPlaces, exclude);
  }

  displayPlaces = () => this.props.matches.map(place => (
    <li key={place.id} data-id={place.id}>
        <MatchItem>
          <Row>
            <Col xs={9} className="trimText">
              <IncludeMatchItem onClick={() => this.handlePlacesSelect(place, false)}>
                <Names>
                  <CommonName>{place.display_name}</CommonName>
                </Names>
              </IncludeMatchItem>
            </Col>
            <Col xs={3} className="autocomplete-exclude-matches">
              <ExcludeMatchItem onClick={() => this.handlePlacesSelect(place, true)}>
                Exclude
              </ExcludeMatchItem>
            </Col>
          </Row>
        </MatchItem>
    </li>
  ));

  handleUsersSelect = (user, exclude) => {
    const selectedUsers = {
      id: user.id,
      name: user.name,
      login: user.login,
    };
    this.props.handleUsersSelect(selectedUsers, exclude);
  }

  displayUsers = () => this.props.matches.map((user) => {
    let photoElem;
    if (user.icon) {
      photoElem = <PhotoImg
        src={user.icon}
        alt={user.login}
      />;
    } else {
      photoElem = '';
    }

    return (
      <li key={user.id} data-id={user.id}>
          <MatchItem>
            <Row>
              <Col xs={9} className="trimText">
                <IncludeMatchItem onClick={() => this.handleUsersSelect(user, false)}>
                  <PhotoDiv>
                    {photoElem}
                  </PhotoDiv>
                  <Names>
                    <CommonName>{user.name}</CommonName>
                    <Latin>
                      <LatinName>{user.login}</LatinName>
                    </Latin>
                  </Names>
                </IncludeMatchItem>
              </Col>
              <Col xs={3} className="autocomplete-exclude-matches">
                <ExcludeMatchItem onClick={() => this.handleUsersSelect(user, true)}>
                  Exclude
                </ExcludeMatchItem>
              </Col>
            </Row>
          </MatchItem>
      </li>
    );
  });

  handleIdentUsersSelect = (user, exclude) => {
    const selectedIdentUsers = {
      id: user.id,
      name: user.name,
      login: user.login,
    };
    this.props.handleIdentUsersSelect(selectedIdentUsers, exclude);
  }

  displayIdentUsers = () => this.props.matches.map((user) => {
    let photoElem;
    if (user.icon) {
      photoElem = <PhotoImg
        src={user.icon}
        alt={user.login}
      />;
    } else {
      photoElem = '';
    }

    return (
      <li key={user.id} data-id={user.id}>
          <MatchItem>
            <Row>
              <Col xs={12} className="trimText">
                <IncludeMatchItem onClick={() => this.handleIdentUsersSelect(user, false)}>
                  <PhotoDiv>
                    {photoElem}
                  </PhotoDiv>
                  <Names>
                    <CommonName>{user.name}</CommonName>
                    <Latin>
                      <LatinName>{user.login}</LatinName>
                    </Latin>
                  </Names>
                </IncludeMatchItem>
              </Col>
            </Row>
          </MatchItem>
      </li>
    );
  });

  handleObsFieldTermSelect = (obsFieldTerm, exclude) => {
    const selectedObsFieldTerm = {
      id: obsFieldTerm.id,
      name: obsFieldTerm.name,
      datatype: obsFieldTerm.datatype,
      allowedValues: obsFieldTerm.allowed_values,
      usageCount: obsFieldTerm.values_count,
    };
    this.props.handleObsFieldTermSelect(selectedObsFieldTerm, exclude);
  }

  displayObsFieldTerm = () => this.props.matches.map(obsFieldTerm => (
    <li key={obsFieldTerm.id} data-id={obsFieldTerm.id}>
        <MatchItem>
          <Row>
            <Col xs={12} className="trimText">
              <IncludeMatchItem onClick={() => this.handleObsFieldTermSelect(obsFieldTerm, false)}>
                <Names>
                  <CommonName>{obsFieldTerm.name}</CommonName>
                  <Latin>
                    <LatinName>
                      Type: {obsFieldTerm.datatype} (Used {obsFieldTerm.values_count} times)
                    </LatinName>
                  </Latin>
                </Names>
              </IncludeMatchItem>
            </Col>
          </Row>
        </MatchItem>
    </li>
  ));


  render() {
    let matchesList;
    if (this.props.type === 'species') {
      matchesList = this.displaySpecies();
    } else if (this.props.type === 'places') {
      matchesList = this.displayPlaces();
    } else if (this.props.type === 'users') {
      matchesList = this.displayUsers();
    } else if (this.props.type === 'identUsers') {
      matchesList = this.displayIdentUsers();
    } else if (this.props.type === 'obsFieldTerm') {
      matchesList = this.displayObsFieldTerm();
    }

    return (
      <div>
        <AutoCompleteUL>
          {matchesList}
        </AutoCompleteUL>
      </div>
    );
  }
}


export default AutoComplete;
