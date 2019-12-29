import React from 'react';
import styled from 'styled-components';
import Color from 'color';
import {Theme} from "@material-ui/core";

export const Header = styled('div')`
  height: 80vh;

  position: relative;
`;

export const HeaderBg = styled('div')`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  background-color: ${Color('#37474f')
    .fade(0.4)
    .string()};
`;

export const BgImg = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: fixed;
  top: 0;
  z-index: -1;
`;

export const HeadingContainer = styled('div')`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  a {
    color: white;
    font-weight: bolder;
    text-decoration: none;
  }
  
  h2 {
      color: white;
  }
`;

export const HeadingMeta = styled('div')`
  list-style: none;

  span {
    margin-right: 2rem;
    position: relative;
    opacity: 0.8;
    color: white;

    &:after {
      content: '/';
      position: absolute;
      right: -1rem;
      font-size: 1.2em;
      top: -0.2em;
    }
    
    &:last-child:after {
      display: none;
    }

    &:hover {
      opacity: 1;
    }
  }
  
  .star-icon {
    color: #FFD700;
    margin-right: .2rem;
  }
`;

export const RestOfPage = styled('div')`
  width: 100%;
  background-color: ${props => (props.theme as Theme).palette.background.default };
  position: relative;
  z-index: 2;
`;
