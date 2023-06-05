const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});

describe('Should be able to render', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', () => {
    expect(spy.mock.calls.length).toEqual(1);
    expect(spy.mock.calls[0]).toMatchSnapshot();
  });
});
