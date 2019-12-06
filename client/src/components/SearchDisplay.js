/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import SearchFilter from './SearchFilter';
import SearchResults from './SearchResults';

const SearchDisplayWrapper = styled.div``;


class SearchDisplay extends Component {
  constructor() {
    super();

    this.callApi = this.callApi.bind(this);
    this.isEqualArrays = this.isEqualArrays.bind(this);
    this.splitQueryStr = this.splitQueryStr.bind(this);
    this.setObservationResults = this.setObservationResults.bind(this);

    this.handleSpeciesChange = this.handleSpeciesChange.bind(this);
    this.handleSpeciesSelect = this.handleSpeciesSelect.bind(this);

    this.handlePlacesChange = this.handlePlacesChange.bind(this);
    this.handlePlacesSelect = this.handlePlacesSelect.bind(this);

    this.handleUsersChange = this.handleUsersChange.bind(this);
    this.handleUsersSelect = this.handleUsersSelect.bind(this);

    this.handleIdentUsersChange = this.handleIdentUsersChange.bind(this);
    this.handleIdentUsersSelect = this.handleIdentUsersSelect.bind(this);

    this.handleObsFieldTermChange = this.handleObsFieldTermChange.bind(this);
    this.handleObsFieldTermSelect = this.handleObsFieldTermSelect.bind(this);

    this.handleObsFieldValueChange = this.handleObsFieldValueChange.bind(this);

    this.handleSelectedClick = this.handleSelectedClick.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);

    this.state = {
      queryStr: '',
      results: [],
      loading: false,
      totalResults: 0,
      perPage: 0,
      page: 1,
      errors: '',
      selectedSpecies: [],
      excludedSpecies: [],
      speciesInputValue: '',
      speciesMatch: [],
      selectedPlaces: [],
      excludedPlaces: [],
      placesInputValue: '',
      placesMatch: [],
      selectedUsers: [],
      excludedUsers: [],
      usersInputValue: '',
      usersMatch: [],
      selectedIdentUsers: [],
      identUsersInputValue: '',
      identUsersMatch: [],
      checkboxes: {},
      selectedObsFieldTerm: [],
      currentlySelectedObsTerm: '',
      excludedObsFieldTerm: [],
      obsFieldTermValue: '',
      obsFieldTermMatch: [],
    };
  }

  static propTypes= {
    history: PropTypes.object.isRequired,
    location: PropTypes.object,
  };

  isEqualArrays(array1, array2) {
    return array1.length === array2.length
      && array1.every((value, index) => value === array2[index]);
  }

  makeTaxonObj = taxon => (
    {
      id: taxon.id,
      name: taxon.name,
      common: taxon.preferred_common_name,
    }
  )

  makePlaceObj = place => (
    {
      id: place.id,
      name: place.name,
      display: place.display_name,
    }
  )

  makeUserObj = user => (
    {
      id: user.id,
      name: user.name,
      login: user.login,
    }
  )

  splitQueryStr = async (queryStr) => {
    const query = queryString.parse(queryStr);
    const newState = {};

    if (query.taxon_ids) {
      const getTaxaRes = await this.callApi(`/api/taxa/${query.taxon_ids}`);
      newState.selectedSpecies = getTaxaRes.results.map(this.makeTaxonObj);
    }
    if (query.without_taxon_id) {
      const getTaxaRes = await this.callApi(`/api/taxa/${query.without_taxon_id}`);
      newState.excludedSpecies = getTaxaRes.results.map(this.makeTaxonObj);
    }

    if (query.place_id) {
      const getPlacesRes = await this.callApi(`/api/places/${query.place_id}`);
      newState.selectedPlaces = getPlacesRes.results.map(this.makePlaceObj);
    }
    if (query.not_in_place) {
      const getPlacesRes = await this.callApi(`/api/places/${query.not_in_place}`);
      newState.excludedPlaces = getPlacesRes.results.map(this.makePlaceObj);
    }

    if (query.user_id) {
      const getUsersRes = await this.callApi(`/api/users/${query.user_id}`);
      newState.selectedUsers = getUsersRes.results.map(this.makeUserObj);
    }
    if (query.not_user_id) {
      const getUsersRes = await this.callApi(`/api/users/${query.not_user_id}`);
      newState.excludedUsers = getUsersRes.results.map(this.makeUserObj);
    }

    if (query.ident_user_id) {
      const getIdentUsersRes = await this.callApi(`/api/users/${query.ident_user_id}`);
      newState.selectedIdentUsers = getIdentUsersRes.results.map(this.makeUserObj);
    }

    if (query.captive) {
      if (newState.checkboxes && typeof newState.checkboxes === 'object') {
        newState.checkboxes.captive = query.captive;
      } else {
        newState.checkboxes = {
          captive: query.captive,
        };
      }
    }

    const obsFields = Object.keys(query).filter(key => key.startsWith('field'))
      .map(e => e.substring('field:'.length));
    newState.selectedObsFieldTerm = obsFields.map((e) => {
      const obj = {
        name: e,
      };
      if (query[`field:${e}`]) {
        obj.selectedValue = query[`field:${e}`];
      }
      return obj;
    });

    if (query.page) {
      newState.page = Number(query.page);
    }
    this.setState(newState);
  }

  setObservationResults = (res) => {
    this.setState({
      results: res.results,
      loading: false,
      totalResults: res.total_results,
      perPage: res.per_page,
      page: res.page,
    });
  }

  callApi = async (url = '/api/observations') => {
    // console.log(`Querying: ${url}`);
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
    return data;
  }


  handleSpeciesChange(event) {
    const searchStr = event.target.value;
    this.setState({ speciesInputValue: searchStr });
    const url = `/api/taxa/autocomplete?search=${searchStr}`;
    this.callApi(url)
      .then(res => this.setState({ speciesMatch: res.results }))
      .catch(e => this.setState({ errors: e }));
  }

  handleSpeciesSelect(selectedSpecies, exclude = false) {
    if (exclude === false) {
      this.setState(prevState => ({
        selectedSpecies: [...prevState.selectedSpecies, selectedSpecies],
        speciesInputValue: '',
        speciesMatch: [],
      }));
    } else {
      this.setState(prevState => ({
        excludedSpecies: [...prevState.excludedSpecies, selectedSpecies],
        speciesInputValue: '',
        speciesMatch: [],
      }));
    }
  }


  handlePlacesChange(event) {
    const searchStr = event.target.value;
    this.setState({ placesInputValue: searchStr });
    const url = `/api/places/autocomplete?search=${searchStr}`;
    this.callApi(url)
      .then(res => this.setState({ placesMatch: res.results }))
      .catch(e => this.setState({ errors: e }));
  }

  handlePlacesSelect(selectedPlaces, exclude = false) {
    if (exclude === false) {
      this.setState(prevState => ({
        selectedPlaces: [...prevState.selectedPlaces, selectedPlaces],
        placesInputValue: '',
        placesMatch: [],
      }));
    } else {
      this.setState(prevState => ({
        excludedPlaces: [...prevState.excludedPlaces, selectedPlaces],
        placesInputValue: '',
        placesMatch: [],
      }));
    }
  }


  handleUsersChange(event) {
    const searchStr = event.target.value;
    this.setState({ usersInputValue: searchStr });
    const url = `/api/users/autocomplete?search=${searchStr}`;
    this.callApi(url)
      .then(res => this.setState({ usersMatch: res.results }))
      .catch(e => this.setState({ errors: e }));
  }

  handleUsersSelect(selectedUsers, exclude = false) {
    if (exclude === false) {
      this.setState(prevState => ({
        selectedUsers: [...prevState.selectedUsers, selectedUsers],
        usersInputValue: '',
        usersMatch: [],
      }));
    } else {
      this.setState(prevState => ({
        excludedUsers: [...prevState.excludedUsers, selectedUsers],
        usersInputValue: '',
        usersMatch: [],
      }));
    }
  }


  handleIdentUsersChange(event) {
    const searchStr = event.target.value;
    this.setState({ identUsersInputValue: searchStr });
    const url = `/api/users/autocomplete?search=${searchStr}`;
    this.callApi(url)
      .then(res => this.setState({ identUsersMatch: res.results }))
      .catch(e => this.setState({ errors: e }));
  }

  handleIdentUsersSelect(selectedIdentUsers, exclude = false) {
    if (exclude === false) {
      this.setState(prevState => ({
        selectedIdentUsers: [...prevState.selectedIdentUsers, selectedIdentUsers],
        identUsersInputValue: '',
        identUsersMatch: [],
      }));
    }
  }


  handleObsFieldTermChange(event) {
    const searchStr = event.target.value;
    this.setState({ obsFieldTermValue: searchStr });
    const url = `/api/observation_fields/autocomplete?search=${searchStr}`;
    this.callApi(url)
      .then(res => this.setState({ obsFieldTermMatch: res.results }))
      .catch(e => this.setState({ errors: e }));
  }

  handleObsFieldTermSelect(selectedObsFieldTerm, exclude = false) {
    if (exclude === false) {
      this.setState(prevState => ({
        selectedObsFieldTerm: [...prevState.selectedObsFieldTerm, selectedObsFieldTerm],
        obsFieldTermValue: '',
        currentlySelectedObsTerm: selectedObsFieldTerm.name,
        obsFieldTermMatch: [],
      }));
    } else {
      this.setState(prevState => ({
        excludedObsFieldTerm: [...prevState.excludedObsFieldTerm, selectedObsFieldTerm],
        obsFieldTermValue: '',
        obsFieldTermMatch: [],
      }));
    }
  }

  handleObsFieldValueChange(event) {
    const selectedValue = event.target.value;
    this.setState((prevState) => {
      const matchedIndex = prevState.selectedObsFieldTerm
        .findIndex(e => e.name === prevState.currentlySelectedObsTerm);
      const newObsArr = [...prevState.selectedObsFieldTerm];
      const matchedObjCopy = { ...newObsArr[matchedIndex] };
      matchedObjCopy.selectedValue = selectedValue;
      newObsArr[matchedIndex] = matchedObjCopy;
      return {
        currentlySelectedObsTerm: '',
        selectedObsFieldTerm: newObsArr,
      };
    });
  }

  handleCheckbox = (e, clickedType) => {
    let type = clickedType;
    if (clickedType === 'research' || clickedType === 'needs_id' || clickedType === 'casual') {
      type = 'qualityGrade';
    }

    if (e.target.checked === true) {
      const checkboxes = {};
      checkboxes[type] = type === 'qualityGrade' ? clickedType : 'true';
      this.setState(prevState => ({
        checkboxes: { ...prevState.checkboxes, ...checkboxes },
      }));
    } else {
      this.setState((prevState) => {
        const copy = Object.assign({}, prevState.checkboxes);
        delete copy[type];
        return { checkboxes: copy };
      });
    }
  }

  handleSelectedClick(index, type) {
    switch (type) {
      case 'species': {
        const selectedSpecies = [...this.state.selectedSpecies];
        selectedSpecies.splice(index, 1);
        this.setState({ selectedSpecies });
        break;
      }
      case 'speciesExclude': {
        const excludedSpecies = [...this.state.excludedSpecies];
        excludedSpecies.splice(index, 1);
        this.setState({ excludedSpecies });
        break;
      }
      case 'places': {
        const selectedPlaces = [...this.state.selectedPlaces];
        selectedPlaces.splice(index, 1);
        this.setState({ selectedPlaces });
        break;
      }
      case 'placesExclude': {
        const excludedPlaces = [...this.state.excludedPlaces];
        excludedPlaces.splice(index, 1);
        this.setState({ excludedPlaces });
        break;
      }
      case 'users': {
        const selectedUsers = [...this.state.selectedUsers];
        selectedUsers.splice(index, 1);
        this.setState({ selectedUsers });
        break;
      }
      case 'usersExclude': {
        const excludedUsers = [...this.state.excludedUsers];
        excludedUsers.splice(index, 1);
        this.setState({ excludedUsers });
        break;
      }
      case 'identUsers': {
        const selectedIdentUsers = [...this.state.selectedIdentUsers];
        selectedIdentUsers.splice(index, 1);
        this.setState({ selectedIdentUsers });
        break;
      }
      // TODO Field
      case 'obsTerm': {
        const selectedObsFieldTerm = [...this.state.selectedObsFieldTerm];
        selectedObsFieldTerm.splice(index, 1);
        this.setState({ selectedObsFieldTerm });
        break;
      }
      default:
    }
  }

  handlePageClick = (data) => {
    let page = data.selected + 1;
    if (page * this.state.perPage > 10000) {
      page = Math.floor(10000 / this.state.perPage);
      console.log('iNat API limitation');
      console.log(page);
    }
    this.setState({ page });
  }

  shouldUpdate = (prevProps, prevState) => {
    const prevTaxonIds = prevState.selectedSpecies.map(taxon => taxon.id);
    const currTaxonIds = this.state.selectedSpecies.map(taxon => taxon.id);

    const prevExcludedTaxonIds = prevState.excludedSpecies.map(taxon => taxon.id);
    const currExcludedTaxonIds = this.state.excludedSpecies.map(taxon => taxon.id);

    const prevPlaceIds = prevState.selectedPlaces.map(place => place.id);
    const currPlaceIds = this.state.selectedPlaces.map(place => place.id);

    const prevExcludedPlaceIds = prevState.excludedPlaces.map(place => place.id);
    const currExcludedPlaceIds = this.state.excludedPlaces.map(place => place.id);

    const prevUserIds = prevState.selectedUsers.map(user => user.id);
    const currUserIds = this.state.selectedUsers.map(user => user.id);

    const prevExcludedUserIds = prevState.excludedUsers.map(user => user.id);
    const currExcludedUserIds = this.state.excludedUsers.map(user => user.id);

    const prevIdentUserIds = prevState.selectedIdentUsers.map(user => user.id);
    const currIdentUserIds = this.state.selectedIdentUsers.map(user => user.id);

    const prevObsFieldTermIds = prevState.selectedObsFieldTerm.map(term => term.id);
    const currObsFieldTermIds = this.state.selectedObsFieldTerm.map(term => term.id);

    const prevObsFieldValueIds = prevState.selectedObsFieldTerm.map(term => term.selectedValue);
    const currObsFieldValueIds = this.state.selectedObsFieldTerm.map(term => term.selectedValue);

    return !this.isEqualArrays(prevTaxonIds, currTaxonIds)
      || !this.isEqualArrays(prevExcludedTaxonIds, currExcludedTaxonIds)
      || !this.isEqualArrays(prevPlaceIds, currPlaceIds)
      || !this.isEqualArrays(prevExcludedPlaceIds, currExcludedPlaceIds)
      || !this.isEqualArrays(prevUserIds, currUserIds)
      || !this.isEqualArrays(prevExcludedUserIds, currExcludedUserIds)
      || !this.isEqualArrays(prevIdentUserIds, currIdentUserIds)
      || !this.isEqualArrays(prevObsFieldTermIds, currObsFieldTermIds)
      || !this.isEqualArrays(prevObsFieldValueIds, currObsFieldValueIds)
      || JSON.stringify(prevState.checkboxes) !== JSON.stringify(this.state.checkboxes)
      || prevState.page !== this.state.page;
  }

  makeTaxaQuery = () => {
    const queryObj = {};
    const currTaxonIds = this.state.selectedSpecies.map(taxon => taxon.id);
    const currExcludedTaxonIds = this.state.excludedSpecies.map(taxon => taxon.id);

    if (currTaxonIds.length > 0) queryObj.taxon_ids = currTaxonIds.join(',');
    if (currExcludedTaxonIds.length > 0) queryObj.without_taxon_id = currExcludedTaxonIds.join(',');

    return queryObj;
  }

  makePlacesQuery = () => {
    const queryObj = {};
    const currPlaceIds = this.state.selectedPlaces.map(place => place.id);
    const currExcludedPlaceIds = this.state.excludedPlaces.map(place => place.id);

    if (currPlaceIds.length > 0) queryObj.place_id = currPlaceIds.join(',');
    if (currExcludedPlaceIds.length > 0) queryObj.not_in_place = currExcludedPlaceIds.join(',');

    return queryObj;
  }

  makeUsersQuery = () => {
    const queryObj = {};
    const currUserIds = this.state.selectedUsers.map(user => user.id);
    const currExcludedUserIds = this.state.excludedUsers.map(user => user.id);

    if (currUserIds.length > 0) queryObj.user_id = currUserIds.join(',');
    if (currExcludedUserIds.length > 0) queryObj.not_user_id = currExcludedUserIds.join(',');

    return queryObj;
  }

  makeIdentUsersQuery = () => {
    const queryObj = {};
    const currIdentUserIds = this.state.selectedIdentUsers.map(user => user.id);

    if (currIdentUserIds.length > 0) queryObj.ident_user_id = currIdentUserIds.join(',');

    return queryObj;
  }

  makeObsFieldQuery = () => {
    const queryObj = {};
    this.state.selectedObsFieldTerm.map(term => ({ field: `field:${term.name}`, value: term.selectedValue }))
      .forEach((e) => { queryObj[e.field] = e.value || null; });

    return queryObj;
  }

  makeCheckboxesQuery = () => { // TODO
    const queryObj = {};
    const { checkboxes } = this.state;
    if (checkboxes.captive === 'true' && checkboxes.wild === 'true') {
      queryObj.captive = 'any';
    } else if (checkboxes.captive === 'true' || checkboxes.wild === 'false') {
      queryObj.captive = 'true';
    } else if (checkboxes.wild === 'true' || checkboxes.captive === 'false') {
      queryObj.captive = 'false';
    }

    if (checkboxes.native) {
      queryObj.native = 'true';
    }

    if (checkboxes.introduced) {
      queryObj.introduced = 'true';
    }

    if (checkboxes.outOfRange) {
      queryObj.out_of_range = 'true';
    }

    if (checkboxes.threatened) {
      queryObj.threatened = 'true';
    }

    if (checkboxes.endemic) {
      queryObj.endemic = 'true';
    }

    if (checkboxes.verifiable) {
      queryObj.verifiable = 'true';
    }

    /*
    if (checkboxes.researchGrade) {
      queryObj.quality_grade = 'research';
    }

    if (checkboxes.needsId) {
      queryObj.quality_grade = 'needs_id';
    }

    if (checkboxes.casual) {
      queryObj.quality_grade = 'casual';
    } */

    if (checkboxes.qualityGrade) {
      queryObj.quality_grade = checkboxes.qualityGrade;
    }

    if (checkboxes.hasPhotos) {
      queryObj.photos = 'true';
    }

    if (checkboxes.hasSounds) {
      queryObj.sounds = 'true';
    }

    if (checkboxes.popular) {
      queryObj.popular = 'true';
    }

    return queryObj;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldUpdate(prevProps, prevState)) {
      const queryObj = {
        ...this.makeTaxaQuery(),
        ...this.makePlacesQuery(),
        ...this.makeUsersQuery(),
        ...this.makeIdentUsersQuery(),
        ...this.makeCheckboxesQuery(),
        ...this.makeObsFieldQuery(),
      };

      if (this.state.page !== 1) queryObj.page = this.state.page;

      const queryStr = queryString.stringify(queryObj);
      const url = queryStr ? `/api/observations?${queryStr}` : '/api/observations';

      this.setState({ loading: true, queryStr }, () => {
        this.props.history.push(`/search?${this.state.queryStr}`);
      });

      this.callApi(url)
        .then(res => this.setObservationResults(res))
        .catch(e => this.setState({ errors: e }))
        .finally(() => this.setState({ loading: false }));
    }
  }

  componentDidMount() {
    const queryStr = this.props.location.search;
    if (queryStr) {
      this.splitQueryStr(queryStr);
    } else {
      this.setState({ loading: true });
      this.callApi()
        .then(res => this.setObservationResults(res))
        .catch(e => this.setState({ errors: e }))
        .finally(() => this.setState({ loading: false }));
    }
    // const url = `/api/observations${queryStr}`;
  }

  render() {
    return (
      <SearchDisplayWrapper>
        <SearchFilter
          handleSelectedClick={this.handleSelectedClick}
          handleSpeciesChange={this.handleSpeciesChange}
          handleSpeciesSelect={this.handleSpeciesSelect}
          selectedSpecies={this.state.selectedSpecies}
          excludedSpecies={this.state.excludedSpecies}
          speciesValue={this.state.speciesInputValue}
          speciesMatch={this.state.speciesMatch}
          handlePlacesChange={this.handlePlacesChange}
          handlePlacesSelect={this.handlePlacesSelect}
          selectedPlaces={this.state.selectedPlaces}
          excludedPlaces={this.state.excludedPlaces}
          placesValue={this.state.placesInputValue}
          placesMatch={this.state.placesMatch}
          handleUsersChange={this.handleUsersChange}
          handleUsersSelect={this.handleUsersSelect}
          selectedUsers={this.state.selectedUsers}
          excludedUsers={this.state.excludedUsers}
          usersValue={this.state.usersInputValue}
          usersMatch={this.state.usersMatch}
          handleIdentUsersChange={this.handleIdentUsersChange}
          handleIdentUsersSelect={this.handleIdentUsersSelect}
          selectedIdentUsers={this.state.selectedIdentUsers}
          identUsersValue={this.state.identUsersInputValue}
          identUsersMatch={this.state.identUsersMatch}
          checkboxes={this.state.checkboxes}
          handleCheckbox={this.handleCheckbox}
          handleObsFieldTermChange={this.handleObsFieldTermChange}
          handleObsFieldTermSelect={this.handleObsFieldTermSelect}
          selectedObsFieldTerm={this.state.selectedObsFieldTerm}
          excludedObsFieldTerm={this.state.excludedObsFieldTerm}
          currentlySelectedObsTerm={this.state.currentlySelectedObsTerm}
          obsFieldTermValue={this.state.obsFieldTermValue}
          obsFieldTermMatch={this.state.obsFieldTermMatch}
          handleObsFieldValueChange={this.handleObsFieldValueChange}
        />
        <SearchResults
          results={this.state.results}
          loading={this.state.loading}
          errors={this.state.errors}
          totalResults={this.state.totalResults}
          perPage={this.state.perPage}
          page={this.state.page}
          handlePageClick={this.handlePageClick}
        />
      </SearchDisplayWrapper>
    );
  }
}

export default SearchDisplay;
