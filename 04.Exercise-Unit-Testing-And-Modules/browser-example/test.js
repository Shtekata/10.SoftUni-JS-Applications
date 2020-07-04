import { getNumber } from './module.js';
import './app.js';

describe('Main', () => {
  it('should return 5', () => {
    expect(getNumber()).equal(5);
  });
});

describe('Main2', () => {
  it('should return 6', () => {
    expect(getNumber()).not.equal(6);
  });
});

describe('Output', () => {
  it('should print 8', () => {
    const result = document.querySelector('#output').textContent;
    expect(result).contains(8);
  });
});


