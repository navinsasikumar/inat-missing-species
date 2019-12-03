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

    this.handleSelectedClick = this.handleSelectedClick.bind(this);
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

  splitQueryStr = async (queryStr) => {
    const query = queryString.parse(queryStr);
    // console.log(query);
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
      case 'user':
        break;
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

    return !this.isEqualArrays(prevTaxonIds, currTaxonIds)
      || !this.isEqualArrays(prevExcludedTaxonIds, currExcludedTaxonIds)
      || !this.isEqualArrays(prevPlaceIds, currPlaceIds)
      || !this.isEqualArrays(prevExcludedPlaceIds, currExcludedPlaceIds)
      || prevState.page !== this.state.page;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldUpdate(prevProps, prevState)) {
      const currTaxonIds = this.state.selectedSpecies.map(taxon => taxon.id);
      const currExcludedTaxonIds = this.state.excludedSpecies.map(taxon => taxon.id);

      const currPlaceIds = this.state.selectedPlaces.map(place => place.id);
      const currExcludedPlaceIds = this.state.excludedPlaces.map(place => place.id);

      const queryObj = {};

      if (currTaxonIds.length > 0) queryObj.taxon_ids = currTaxonIds.join(',');
      if (currExcludedTaxonIds.length > 0) queryObj.without_taxon_id = currExcludedTaxonIds.join(',');

      if (currPlaceIds.length > 0) queryObj.place_id = currPlaceIds.join(',');
      if (currExcludedPlaceIds.length > 0) queryObj.not_in_place = currExcludedPlaceIds.join(',');

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
