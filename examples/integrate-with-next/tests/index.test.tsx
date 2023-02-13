import { render } from '@testing-library/react';
import App, { getServerSideProps } from '../src/pages/index';

describe('Jest Snapshot testing suite', () => {
  it('Matches DOM Snapshot', async () => {
    const props = await getServerSideProps();
    const { container } = render(<App models={props.models}/>);
    expect(container).toMatchSnapshot();
  });
});
