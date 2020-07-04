const expect = require('chai').expect;
const app = require('./app');

describe('Main functionality', () => {
    it('should return 5', () => {
        expect(app.getNumber()).to.equal(5);
    }) 
    it('should add 5 and 3 to get 8', () => {
        expect(app.addNumbers(5, 3)).to.equal(8);
    })
    // it('should add 5 and 3 to get 8', () => {
    //   expect(app.addNumbers).to.throw();
    // });
});