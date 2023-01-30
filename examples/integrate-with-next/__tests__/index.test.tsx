import { render } from '@testing-library/react';
import App from "../src/pages/index";

describe("Jest Snapshot testing suite", () => {
  it("Matches DOM Snapshot", () => {
    const { container } = render(<App />)
    expect(container).toMatchSnapshot();
  });
});
