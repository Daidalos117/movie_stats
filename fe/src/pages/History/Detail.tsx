import React from 'react';
import Layout from 'components/Layout/Layout';
import Grid from '@material-ui/core/Grid';
import backend from 'api/backend';
import useSWR from 'swr';
import { API } from '../../routes';
import { useParams } from 'react-router';

interface Props {}

const Detail: React.FC<Props> = props => {
  let { id } = useParams();
  const { data, error } = useSWR(`${API.movie.index}/${id}`, (url: string) =>
    backend(url, {})
  );
  console.log(data);

  return (
    <Layout>
      <Grid container>
        <Grid item xs={6}></Grid>
      </Grid>
    </Layout>
  );
};

export default Detail;
