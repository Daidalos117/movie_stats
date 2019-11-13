import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

interface Props {}

const Loading: React.FC<Props> = () => (
  <Box justifyContent="center" display="flex">
    <CircularProgress />
  </Box>
);

export default Loading;
