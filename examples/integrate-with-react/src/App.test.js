import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders learn react link', async () => {
  render(<App />);
  const linkElement = screen.getByTestId('App');
  expect(linkElement).toBeInTheDocument();
  const expectedCode = 'class Root {\n  private _email?: string;\n\n  constructor(input: {\n    email?: string,\n  }) {\n    this._email = input.email;\n  }\n\n  get email(): string | undefined { return this._email; }\n  set email(email: string | undefined) { this._email = email; }\n}';
  await waitFor(() => expect(linkElement.textContent).toEqual(expectedCode));
});
