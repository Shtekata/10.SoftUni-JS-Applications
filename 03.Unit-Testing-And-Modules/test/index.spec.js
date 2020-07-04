const lib = require('../app/src/index');
const expect = require('chai').expect;

describe('My lib tests', () => {
    it('should return NAN when the arg is a string', () => {
        const arg = 'test';
        const result = lib.sum(arg);
        expect(result).to.be.NaN;
    })
})