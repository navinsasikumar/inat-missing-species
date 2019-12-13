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

    this.handleAnnotationTermSelect = this.handleAnnotationTermSelect.bind(this);
    this.handleAnnotationValueSelect = this.handleAnnotationValueSelect.bind(this);

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
      obsFieldValueMatch: [],
      selectedAnnotations: [],
      excludedAnnotations: [],
      annotationsInputValue: '',
      annotationsMatch: [],
      selectedAnnotationValues: [],
      excludedAnnotationValues: [],
      annotationValuesInputValue: '',
      annotationValuesMatch: [],
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

  makeAnnotationObj = (annotations, idStr) => {
    const ids = idStr.split(',').map(id => Number(id));
    if (!annotations.results) return [];
    return annotations.results.filter(obj => ids.includes(obj.id));
  }

  makeAnnotationValuesObj = (annotations, idStr) => {
    const ids = idStr.split(',').map(id => Number(id));
    return annotations.filter(obj => ids.includes(obj.id));
  }

  makeFlattenedAnnotationValues = (annotations) => {
    if (!annotations.results) return [];
    const annotationValuesArr = [];
    annotations.results
      .forEach(obj => obj.values.forEach((val) => {
        const newVal = { ...val };
        newVal.termId = obj.id;
        newVal.termLabel = obj.label;
        annotationValuesArr.push(newVal);
      }));
    return annotationValuesArr;
  }

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

    const checkboxFields = ['captive', 'native', 'endemic', 'threatened', 'out_of_range', 'introduced', 'verifiable', 'quality_grade', 'photos', 'sounds', 'popular'];
    const checkboxQueries = Object.keys(query).filter(key => checkboxFields.includes(key));
    if (!newState.checkboxes || typeof newState.checkboxes !== 'object') {
      newState.checkboxes = {};
    }
    checkboxQueries.forEach((key) => {
      newState.checkboxes[key] = query[key];
    });

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

    if (query.term_id
      || query.without_term_id
      || query.term_value_id
      || query.without_term_value_id
    ) {
      const getAnnotationsRes = await this.callApi('/api/annotations');
      const flattenedAnnotationValues = this.makeFlattenedAnnotationValues(getAnnotationsRes);
      if (query.term_id) {
        newState.selectedAnnotations = this.makeAnnotationObj(getAnnotationsRes, query.term_id);
      }
      if (query.without_term_id) {
        newState.excludedAnnotations = this.makeAnnotationObj(
          getAnnotationsRes,
          query.without_term_id,
        );
      }

      if (query.term_value_id) {
        newState.selectedAnnotationValues = this.makeAnnotationValuesObj(
          flattenedAnnotationValues,
          query.term_value_id,
        );
      }
      if (query.without_term_value_id) {
        newState.excludedAnnotationValues = this.makeAnnotationValuesObj(
          flattenedAnnotationValues,
          query.without_term_value_id,
        );
      }
    }

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


  handleSpeciesChange(event, matches = 'speciesMatch') {
    const searchStr = event.target.value;
    this.setState({ speciesInputValue: searchStr });
    const url = `/api/taxa/autocomplete?search=${searchStr}`;
    this.callApi(url)
      .then(res => this.setState({ [matches]: res.results }))
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
    if (searchStr === '') {
      return this.setState({ obsFieldTermMatch: [] });
    }
    const url = `/api/observation_fields/autocomplete?search=${searchStr}`;
    return this.callApi(url)
      .then(res => this.setState({ obsFieldTermMatch: res.results }))
      .catch(e => this.setState({ errors: e }));
  }

  handleObsFieldTermSelect(selectedObsFieldTerm, exclude = false) {
    if (exclude === false) {
      this.setState((prevState) => {
        if (prevState.selectedObsFieldTerm.length > 0
          && prevState.selectedObsFieldTerm
            .findIndex(e => e.name === selectedObsFieldTerm.name) >= 0
        ) {
          return {
            obsFieldTermValue: '',
            currentlySelectedObsTerm: selectedObsFieldTerm.name,
            obsFieldTermMatch: [],
          };
        }
        return {
          selectedObsFieldTerm: [...prevState.selectedObsFieldTerm, selectedObsFieldTerm],
          obsFieldTermValue: '',
          currentlySelectedObsTerm: selectedObsFieldTerm.name,
          obsFieldTermMatch: [],
        };
      });
    } else {
      this.setState(prevState => ({
        excludedObsFieldTerm: [...prevState.excludedObsFieldTerm, selectedObsFieldTerm],
        obsFieldTermValue: '',
        obsFieldTermMatch: [],
      }));
    }
  }

  handleObsFieldValueChange(selection) {
    let selectedValue = selection;
    if (selection.target && selection.target.value) { // For dropdown
      selectedValue = selection.target.value;
    }
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
        obsFieldValueMatch: [],
      };
    });
  }

  handleAnnotationTermSelect(selectedAnnotation, exclude = false) {
    if (exclude === false) {
      this.setState((prevState) => {
        if (prevState.selectedAnnotations
          .findIndex(elem => elem.id === selectedAnnotation.id) < 0
        ) {
          return {
            selectedAnnotations: [...prevState.selectedAnnotations, selectedAnnotation],
            annotationsInputValue: '',
            annotationsMatch: [],
          };
        }
        return {
          annotationsInputValue: '',
          annotationsMatch: [],
        };
      });
    } else {
      this.setState((prevState) => {
        if (prevState.excludedAnnotations
          .findIndex(elem => elem.id === selectedAnnotation.id) < 0
        ) {
          return {
            excludedAnnotations: [...prevState.excludedAnnotations, selectedAnnotation],
            annotationsInputValue: '',
            annotationsMatch: [],
          };
        }
        return {
          annotationsInputValue: '',
          annotationsMatch: [],
        };
      });
    }
  }

  handleAnnotationValueSelect(selectedAnnotationValue, exclude = false) {
    if (exclude === false) {
      this.setState(prevState => ({
        selectedAnnotationValues: [...prevState.selectedAnnotationValues, selectedAnnotationValue],
        annotationValuesInputValue: '',
        annotationValuesMatch: [],
      }));
    } else {
      this.setState(prevState => ({
        excludedAnnotationValues: [...prevState.excludedAnnotationValues, selectedAnnotationValue],
        annotationValuesInputValue: '',
        annotationValuesMatch: [],
      }));
    }
  }

  handleCheckbox = (e, clickedType) => {
    let type = clickedType;
    if (clickedType === 'research' || clickedType === 'needs_id' || clickedType === 'casual') {
      type = 'quality_grade';
    }

    if (e.target.checked === true) {
      const checkboxes = {};
      checkboxes[type] = type === 'quality_grade' ? clickedType : 'true';
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

  handleSelectedClick(index, type, value) {
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
      case 'obsTerm': {
        const selectedObsFieldTerm = [...this.state.selectedObsFieldTerm];
        selectedObsFieldTerm.splice(index, 1);
        this.setState({ selectedObsFieldTerm });
        break;
      }
      case 'annotationTerms': {
        const selectedAnnotations = [...this.state.selectedAnnotations];
        selectedAnnotations.splice(index, 1);
        this.setState({ selectedAnnotations });
        break;
      }
      case 'annotationTermsExclude': {
        const excludedAnnotations = [...this.state.excludedAnnotations];
        excludedAnnotations.splice(index, 1);
        this.setState({ excludedAnnotations });
        break;
      }
      case 'annotationValues': {
        if (value.termId) {
          // This is a value - remove value and check if any other values with that termId exists
          // If none do, remove the term as well
          const selectedAnnotationValues = [...this.state.selectedAnnotationValues];
          const selectedAnnotations = [...this.state.selectedAnnotations];

          selectedAnnotationValues.splice(index, 1);

          const matchedTerms = selectedAnnotationValues
            .findIndex(elem => elem.termId === value.termId) >= 0;

          if (!matchedTerms) {
            const matchedIndex = selectedAnnotations.findIndex(elem => elem.id === value.termId);
            selectedAnnotations.splice(matchedIndex, 1);
          }
          this.setState({ selectedAnnotationValues, selectedAnnotations });
        } else {
          // This is a term -  remove the term
          const selectedAnnotations = [...this.state.selectedAnnotations];
          const matchedIndex = selectedAnnotations.findIndex(elem => elem.id === value.id);
          selectedAnnotations.splice(matchedIndex, 1);
          this.setState({ selectedAnnotations });
        }
        break;
      }
      case 'annotationValuesExclude': {
        if (value.termId) {
          const excludedAnnotationValues = [...this.state.excludedAnnotationValues];
          const excludedAnnotations = [...this.state.excludedAnnotations];

          excludedAnnotationValues.splice(index, 1);

          const matchedTerms = excludedAnnotationValues
            .findIndex(elem => elem.termId === value.termId) >= 0;

          if (!matchedTerms) {
            const matchedIndex = excludedAnnotations.findIndex(elem => elem.id === value.termId);
            excludedAnnotations.splice(matchedIndex, 1);
          }
          this.setState({ excludedAnnotationValues, excludedAnnotations });
        } else {
          const excludedAnnotations = [...this.state.excludedAnnotations];
          const matchedIndex = excludedAnnotations.findIndex(elem => elem.id === value.id);
          excludedAnnotations.splice(matchedIndex, 1);
          this.setState({ excludedAnnotations });
        }
        break;
      }
      default:
    }
  }

  handlePageClick = (data) => {
    let page = data.selected + 1;
    if (page * this.state.perPage > 10000) {
      page = Math.floor(10000 / this.state.perPage);
      console.log('iNat API limitation'); // eslint-disable-line no-console
      console.log(page); // eslint-disable-line no-console
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

    const prevAnnotationIds = prevState.selectedAnnotations.map(annotation => annotation.id);
    const currAnnotationIds = this.state.selectedAnnotations.map(annotation => annotation.id);

    const prevExcludedAnnotationIds = prevState.excludedAnnotations
      .map(annotation => annotation.id);
    const currExcludedAnnotationIds = this.state.excludedAnnotations
      .map(annotation => annotation.id);

    const prevAnnotationValueIds = prevState.selectedAnnotationValues
      .map(annotationValue => annotationValue.id);
    const currAnnotationValueIds = this.state.selectedAnnotationValues
      .map(annotationValue => annotationValue.id);

    const prevExcludedAnnotationValueIds = prevState.excludedAnnotationValues
      .map(annotationValue => annotationValue.id);
    const currExcludedAnnotationValueIds = this.state.excludedAnnotationValues
      .map(annotationValue => annotationValue.id);

    return !this.isEqualArrays(prevTaxonIds, currTaxonIds)
      || !this.isEqualArrays(prevExcludedTaxonIds, currExcludedTaxonIds)
      || !this.isEqualArrays(prevPlaceIds, currPlaceIds)
      || !this.isEqualArrays(prevExcludedPlaceIds, currExcludedPlaceIds)
      || !this.isEqualArrays(prevUserIds, currUserIds)
      || !this.isEqualArrays(prevExcludedUserIds, currExcludedUserIds)
      || !this.isEqualArrays(prevIdentUserIds, currIdentUserIds)
      || !this.isEqualArrays(prevObsFieldTermIds, currObsFieldTermIds)
      || !this.isEqualArrays(prevObsFieldValueIds, currObsFieldValueIds)
      || !this.isEqualArrays(prevAnnotationIds, currAnnotationIds)
      || !this.isEqualArrays(prevExcludedAnnotationIds, currExcludedAnnotationIds)
      || !this.isEqualArrays(prevAnnotationValueIds, currAnnotationValueIds)
      || !this.isEqualArrays(prevExcludedAnnotationValueIds, currExcludedAnnotationValueIds)
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
      .forEach((e) => { queryObj[e.field] = (typeof e.value === 'object' ? e.value.id : e.value) || null; });

    return queryObj;
  }

  makeAnnotationsQuery = () => {
    const queryObj = {};
    const currAnnotationIds = this.state.selectedAnnotations.map(annotation => annotation.id);
    const currExcludedAnnotationIds = this.state.excludedAnnotations
      .map(annotation => annotation.id);

    if (currAnnotationIds.length > 0) queryObj.term_id = currAnnotationIds.join(',');
    if (currExcludedAnnotationIds.length > 0) queryObj.without_term_id = currExcludedAnnotationIds.join(',');

    return queryObj;
  }

  makeAnnotationValuesQuery = () => {
    const queryObj = {};
    const currAnnotationValueIds = this.state.selectedAnnotationValues
      .map(annotationValue => annotationValue.id);
    const currExcludedAnnotationValueIds = this.state.excludedAnnotationValues
      .map(annotationValue => annotationValue.id);

    if (currAnnotationValueIds.length > 0) queryObj.term_value_id = currAnnotationValueIds.join(',');
    if (currExcludedAnnotationValueIds.length > 0) queryObj.without_term_value_id = currExcludedAnnotationValueIds.join(',');

    return queryObj;
  }

  makeCaptiveQuery = () => {
    const queryObj = {};
    const { checkboxes } = this.state;
    if (checkboxes.captive === 'true' && checkboxes.wild === 'true') {
      queryObj.captive = 'any';
    } else if (checkboxes.captive === 'true' || checkboxes.wild === 'false') {
      queryObj.captive = 'true';
    } else if (checkboxes.wild === 'true' || checkboxes.captive === 'false') {
      queryObj.captive = 'false';
    }
    return queryObj;
  }

  makeCheckboxesQuery = () => {
    const { checkboxes } = this.state;
    const queryObj = this.makeCaptiveQuery();

    if (checkboxes.native) {
      queryObj.native = 'true';
    }

    if (checkboxes.introduced) {
      queryObj.introduced = 'true';
    }

    if (checkboxes.out_of_range) {
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

    if (checkboxes.quality_grade) {
      queryObj.quality_grade = checkboxes.quality_grade;
    }

    if (checkboxes.photos) {
      queryObj.photos = 'true';
    }

    if (checkboxes.sounds) {
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
        ...this.makeAnnotationsQuery(),
        ...this.makeAnnotationValuesQuery(),
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
          obsFieldValueMatch={this.state.obsFieldValueMatch}
          handleAnnotationTermSelect={this.handleAnnotationTermSelect}
          selectedAnnotations={this.state.selectedAnnotations}
          excludedAnnotations={this.state.excludedAnnotations}
          annotationsMatch={this.state.annotationsMatch}
          handleAnnotationValueSelect={this.handleAnnotationValueSelect}
          selectedAnnotationValues={this.state.selectedAnnotationValues}
          excludedAnnotationValues={this.state.excludedAnnotationValues}
          annotationValuesMatch={this.state.annotationValuesMatch}
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
