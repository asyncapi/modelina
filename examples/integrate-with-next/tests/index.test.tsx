import { render } from '@testing-library/react';
import { ParsedUrlQuery } from 'querystring';
import { GetServerSidePropsContext } from 'next';
import HomePage, { HomePageProps, getServerSideProps } from '../src/pages/index';

describe('Jest Snapshot testing suite', () => {
  it('Matches DOM Snapshot', async () => {
    const context = {
      params: { } as ParsedUrlQuery
    };

    const { props } = (await getServerSideProps(context as GetServerSidePropsContext)) as { props: HomePageProps};
    const { container } = render(HomePage(props));
    expect(container).toMatchSnapshot();
  });
});
