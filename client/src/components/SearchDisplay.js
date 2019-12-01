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
    this.handleSpeciesChange = this.handleSpeciesChange.bind(this);
    this.handleSpeciesSelect = this.handleSpeciesSelect.bind(this);

    this.state = {
      queryStr: '',
      results: [],
      loading: false,
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
    let selectedSpecies;
    if (query.taxon_ids) {
      const getTaxaRes = await this.callApi(`/api/taxa/${query.taxon_ids}`);
      selectedSpecies = getTaxaRes.map(taxon => (
        {
          id: taxon.id,
          name: taxon.name,
          common: taxon.preferred_common_name,
        }
      ));
    }
    this.setState({ selectedSpecies });
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
    return data.results;
  }


  handleSpeciesChange(event) {
    const searchStr = event.target.value;
    this.setState({ speciesInputValue: searchStr });
    const url = `/api/taxa/autocomplete?search=${searchStr}`;
    this.callApi(url)
      .then(res => this.setState({ speciesMatch: res }))
      .catch(e => this.setState({ errors: e }));
  }

  handleSpeciesSelect(selectedSpecies) {
    this.setState(prevState => ({
      selectedSpecies: [...prevState.selectedSpecies, selectedSpecies],
      speciesInputValue: '',
      speciesMatch: [],
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    const prevTaxonIds = prevState.selectedSpecies.map(taxon => taxon.id);
    const currTaxonIds = this.state.selectedSpecies.map(taxon => taxon.id);
    if (!this.isEqualArrays(prevTaxonIds, currTaxonIds)) {
      const queryStr = `taxon_ids=${currTaxonIds.join(',')}`;
      const url = `/api/observations?${queryStr}`;

      this.setState({ loading: true, queryStr }, () => {
        this.props.history.push(`/search?${this.state.queryStr}`);
      });

      this.callApi(url)
        .then(res => this.setState({ results: res, loading: false }))
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
        .then(res => this.setState({ results: res, loading: false }))
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
        />
      </SearchDisplayWrapper>
    );
  }
}

export default SearchDisplay;
