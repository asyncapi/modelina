import { NO_NUMBER_START_CHAR, NO_EMPTY_VALUE } from '../../src/helpers';

describe('Constraints', () => {
  describe('NO_NUMBER_START_CHAR', () => {
    describe('should not prepend anything to empty values', () => {
      const renderedValue = NO_NUMBER_START_CHAR('');
      expect(renderedValue).toEqual('');
    });
    describe('should prepend something to numbers', () => {
      const renderedValue = NO_NUMBER_START_CHAR('1');
      expect(renderedValue).toEqual('number_1');
    });
  });

  describe('NO_EMPTY_VALUE', () => {
    describe('should not allow empty values', () => {
      const renderedValue = NO_EMPTY_VALUE('');
      expect(renderedValue).toEqual('empty');
    });
    describe('should not do anything to nonempty values', () => {
      const renderedValue = NO_EMPTY_VALUE('1');
      expect(renderedValue).toEqual('1');
    });
  });
});
