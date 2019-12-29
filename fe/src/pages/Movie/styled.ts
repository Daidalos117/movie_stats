import React from 'react';
import styled from 'styled-components';
import Color from 'color';
import {Theme} from "@material-ui/core";

export const RestOfPage = styled('div')`
  width: 100%;
  background-color: ${props => (props.theme as Theme).palette.background.default };
  position: relative;
  z-index: 2;
`;
