const expect = require('chai').expect;
const lookupChar = require('./solution');

describe('Main', () => {
  const testString = 'seagull';

  describe('Invalid parameters', () => {
    it('should return undefined for non-string first param', () => {
      expect(lookupChar(null, 0)).equal(undefined);
    });

    it('should return undefined for non-number second param', () => {
      expect(lookupChar(testString, '0.4')).equal(undefined);
    });

    it('should return undefined for non-integer second param', () => {
      expect(lookupChar(testString, 0.4)).equal(undefined);
    });
  });

  describe('Out of range', () => {
    it('should return undefined below 0', () => {
      expect(lookupChar(testString, -1)).equal('Incorrect index');
    });

    it('should return undefined under string length', () => {
      expect(lookupChar(testString, 7)).equal('Incorrect index');
    });
  });

  describe('Happy path', () => {
    it('should return s', () => {
      expect(lookupChar(testString, 0)).equal('s');
    });

    it('should return a', () => {
      expect(lookupChar(testString, 2)).equal('a');
    });

    it('should return S', () => {
      expect(lookupChar('testString', 4)).equal('S');
    });
  });
});
