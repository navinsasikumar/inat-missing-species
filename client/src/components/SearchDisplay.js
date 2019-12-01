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
      speciesInputValue: '',
      speciesMatch: [],
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

  splitQueryStr = async (queryStr) => {
    const query = queryString.parse(queryStr);
    // console.log(query);
    const newState = {};
    if (query.taxon_ids) {
      const getTaxaRes = await this.callApi(`/api/taxa/${query.taxon_ids}`);
      newState.selectedSpecies = getTaxaRes.results.map(taxon => (
        {
          id: taxon.id,
          name: taxon.name,
          common: taxon.preferred_common_name,
        }
      ));
    }
    if (query.page) {
      newState.page = query.page;
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

  handleSpeciesSelect(selectedSpecies) {
    this.setState(prevState => ({
      selectedSpecies: [...prevState.selectedSpecies, selectedSpecies],
      speciesInputValue: '',
      speciesMatch: [],
    }));
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

  componentDidUpdate(prevProps, prevState) {
    const prevTaxonIds = prevState.selectedSpecies.map(taxon => taxon.id);
    const currTaxonIds = this.state.selectedSpecies.map(taxon => taxon.id);
    if (!this.isEqualArrays(prevTaxonIds, currTaxonIds) || prevState.page !== this.state.page) {
      const queryObj = {};
      if (currTaxonIds.length > 0) queryObj.taxon_ids = currTaxonIds.join(',');
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
          handleSpeciesChange={this.handleSpeciesChange}
          handleSpeciesSelect={this.handleSpeciesSelect}
          selectedSpecies={this.state.selectedSpecies}
          speciesValue={this.state.speciesInputValue}
          speciesMatch={this.state.speciesMatch}
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
