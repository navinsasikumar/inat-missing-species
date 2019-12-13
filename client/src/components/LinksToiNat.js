/* eslint-disable class-methods-use-this */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LinkBox = styled.div`
  color: white;
  padding-bottom: 10px;
`;

const LinkItem = styled.a`
  color: white;
  padding: 0 10px;
  text-decoration: underline;
  &:hover {
   color: gray;
  }
`;

const SmallText = styled.div`
  font-size: 65%;
`;

class LinksToiNat extends Component {
  static propTypes = {
    queryStr: PropTypes.func,
  };

  render() {
    return (
      <LinkBox>
        See results on iNaturalist:
        <LinkItem href={`https://inaturalist.org/observations?${this.props.queryStr}`} target="_blank" rel="noopener noreferrer">
          Observations
        </LinkItem>
        |
        <LinkItem href={`https://inaturalist.org/observations/identify?${this.props.queryStr}`} target="_blank" rel="noopener noreferrer">
          Identify
        </LinkItem>
        <SmallText>
          Some filters may not work for both observations and identifications.
          Any default filters in iNat will still hold if they are not overwritten here.
        </SmallText>
      </LinkBox>
    );
  }
}

export default LinksToiNat;
