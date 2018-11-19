import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ReactTooltip from 'react-tooltip'
import { Switch, Route } from 'react-router-dom'
//import queryString from 'query-string'
import './compiled/App.css';

class TaxonImageLarge extends Component {
  render() {
    return (
      <div className="crop-center">
        <img src={this.props.img && this.props.img.medium_url} alt={this.props.alt}/>
      </div>
    );
  }
}

class TaxonImage extends Component {
  render() {
    return (
      <div className="crop">
        <img src={this.props.img && this.props.img.medium_url} alt={this.props.alt}/>
      </div>
    );
  }
}

class TaxonText extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="taxon-text">
          <div className="taxon-info">
            <a href={'https://www.inaturalist.org/observations?place_id=2983&subview=grid&view=&taxon_id=' + this.props.taxon.taxon.id + '&page='} target="_blank">
              {this.props.taxon.count} Observations
            </a>
            <div className="copyright-info">
              <div data-effect="solid" data-delay-show='500' data-delay-hide='500' data-tip={'Photo: ' + this.props.taxon.taxon.default_photo.attribution}>CC</div>
              <ReactTooltip />
            </div>
          </div>
          <div className="taxon-names">
            <a href="">
              <div className="common-name">
                {this.props.taxon.taxon.preferred_common_name || this.props.taxon.taxon.name}
              </div>
              <div className="latin-name">
                ({this.props.taxon.taxon.name})
              </div>
            </a>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

class TaxonLarge extends Component {
  render() {
    return (
      <React.Fragment>
        <TaxonImageLarge img={this.props.taxon.taxon.default_photo} alt={this.props.taxon.taxon.name}/>
        <TaxonText taxon={this.props.taxon} />
      </React.Fragment>
    );
  }
}

class Taxon extends Component {
  render() {
    return (
      <div className="taxon-square">
        <a href={'https://www.inaturalist.org/taxa/' + this.props.taxon.taxon.id} target="_blank">
          <TaxonImage img={this.props.taxon.taxon.default_photo} alt={this.props.taxon.taxon.name}/>
        </a>
        <TaxonText taxon={this.props.taxon} />
      </div>
    );
  }
}

class ResultsDisplay extends Component {
  constructor(props) {
    super(props);
    this.loadItems = this.loadItems.bind(this);
    this.state = {
      results: [],
      hasMore: true
    };
  }

  loadItems(page) {
    console.log('Loading items: ' + page);
    let dispCount = this.props.dispCount || 25;
    let smallResults = this.props.results.slice(0, page * dispCount || dispCount);
    let hasMore = this.props.results.length > page * dispCount;
    let resultsDisp = this.props.count > 0 ? smallResults : <div className='col'>Loading ...</div>;
    this.setState({ results: resultsDisp, hasMore: hasMore });
    return resultsDisp;
  }

  render() {
    const loader = <div key={this.props.results.length} className="loader">Loading ...</div>;
    //let resultsDisp = this.loadItems(1);

    if (this.props.count > 0) {
      return (
        <InfiniteScroll
                  pageStart={0}
                  loadMore={this.loadItems}
                  hasMore={this.state.hasMore}
                  loader={loader}>
          <div className="container">
            <div className="row grid">{this.state.results}</div>
          </div>
        </InfiniteScroll>
      );
    } else {
      return (
        <div className="container">
          <div className="row grid"><div className="col">Loading ... </div></div>
        </div>
      )
    }
  }

}

class StatusBar extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col dark-grey-bg">Total: {this.props.results.length}</div>
        </div>
      </div>
    )
  }
}

class FormCheckBox extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onFilterChange(e.target.value, e.target.checked);
  }

  render () {
    return (
      <div className="form-group form-check form-check-inline">
        <input className="form-check-input" type="checkbox" id="{this.props.type}-check" name={this.props.type} value={this.props.type} onChange={this.handleChange} />
        <label className="form-check-label" htmlFor="{this.props.type}-check"><span className="Iconic-taxa-name">{this.props.type}</span></label>
      </div>
    )
  }
}

class FilterBar extends Component {
  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(type, checked) {
    this.props.onFilterBarChange(type, checked);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row white-bg">
          <div className="col">
            <form>
              <FormCheckBox type="plants" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="mammals" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="birds" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="insects" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="reptiles" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="amphibians" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="fungi" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="fishes" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="molluscs" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="arachnids" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="protozoa" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="diatoms" onFilterChange={this.handleFilterChange} />
              <FormCheckBox type="other" onFilterChange={this.handleFilterChange} />
            </form>
          </div>
        </div>
      </div>
    )
  }
}

class Display extends Component {
  constructor() {
    super();

    this.state = {
      results: []
    };
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ results: res }))
      .catch(console.error);
  }

  callApi = async () => {
    //const queries = queryString.parse(this.props.location.search)
    //console.log(queries);
    let url = '/api/observations/species' + this.props.location.search;
    const resp = await fetch(url);

    window._resp = resp;

    let text = await resp.text();

    let data = null;
    try {
      data = JSON.parse(text); // cannot call both .json and .text - await resp.json();
    } catch (e) {
      console.err(`Invalid json\n${e}`);
    }

    if (resp.status !== 200) {
      throw Error(data ? data.message : 'No data');
    }

    console.log(data);
    return data;
  };

  render() {
    console.log(this.props);
    const iconicTaxa = {
      plants: 47126,
      reptiles: 26036,
      insects: 47158,
      birds: 3,
      mammals: 40151,
      amphibians: 20978,
      fungi: 47170,
      fishes: 47178,
      molluscs: 47115,
      arachnids: 47119,
      protozoa: 47686,
      diatoms: 48222,
      other: 0
    };

    let simpleData = this.state.results;
    let resultCount = this.state.results.length;

    if (this.props.filter.length > 0) {
      let filterTaxa = this.props.filter.map((name) => { return iconicTaxa[name]; });
      simpleData = simpleData.filter((taxon) => {
        return filterTaxa.indexOf(taxon.taxon.iconic_taxon_id) >= 0;
      });
    }

    simpleData = simpleData.map((taxon, index) => {
      let taxonElem;
      let key = taxon.taxon.name;
      if (index < 0) { //Making this always false for now
        taxonElem = <React.Fragment><div key={key} className='col'><TaxonLarge taxon={taxon}/></div><div class="w-100"></div></React.Fragment>
      } else {
        taxonElem = <div key={key} className='col-xs-2'><Taxon taxon={taxon}/></div>
      }
      return (
        taxonElem
      )
    });

    let dispCount = 25;
    let key = simpleData.length + '|' + this.props.filter.join('');

    return (
      <React.Fragment>
        <StatusBar results={simpleData} />
        <ResultsDisplay results={simpleData} count={resultCount} dispCount={dispCount} key={key}/>
      </React.Fragment>
    );
  }
}

class MainBody extends Component {
  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.state = {
      filters: []
    };
  }

  handleFilterChange(type, checked) {
    console.log('MainBody: ' + type + ', ' + checked);
    let filters = this.state.filters;
    if (checked) {
      filters.push(type)
    } else {
      let index = filters.indexOf(type);
      if (index > -1) {
        filters.splice(index, 1);
      }
    }
    this.setState({filters: filters});
    console.log(this.state.filters);
  }

  render() {
    return (
      <React.Fragment>
        <FilterBar onFilterBarChange={this.handleFilterChange} />
        <Switch>
          <Route exact path='/' render={(props) => <Display {...props} filter={this.state.filters} />}/>
        </Switch>
      </React.Fragment>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Philly CNC</h1>
        </header>
        <MainBody />
      </div>
    );
  }
}

export default App;
