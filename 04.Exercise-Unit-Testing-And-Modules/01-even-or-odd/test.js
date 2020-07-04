const expect = require('chai').expect;
const isOddOrEven = require('./solution');

describe('Odd or Even', () => {
  it('should return odd', () => {
    expect(isOddOrEven('aaa')).equal('odd');
  });

  it('should return even', () => {
    expect(isOddOrEven('aaaa')).equal('even');
  });

  it('should return undefined for non-strings', () => {
    expect(isOddOrEven(3)).equal(undefined);
    expect(isOddOrEven([])).equal(undefined);
    expect(isOddOrEven({})).equal(undefined);
  });
});
