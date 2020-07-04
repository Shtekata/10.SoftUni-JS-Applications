const expect = require('chai').expect;
const PaymentPackage = require('./PaymentPackage');

describe('PaymentPackage', () => {
  const validName = 'My Package';
  const validValue = 120;

  describe('Instantiation and structure', () => {
    it('works with valid parameters', () => {
      expect(() => new PaymentPackage(validName, validValue)).not.throw();
    });

    it('is correctly set up', () => {
      const instance = new PaymentPackage(validName, validValue);
      expect(instance.name).equal(validName);
      expect(instance.value).equal(validValue);
      expect(instance.VAT).equal(20);
      expect(instance.active).true;
    });

    it('does not work with invalid name', () => {
      expect(() => new PaymentPackage('', validValue)).throw();
      expect(() => new PaymentPackage(undefined, validValue)).throw();
      expect(() => new PaymentPackage({}, validValue)).throw();
      expect(() => new PaymentPackage([], validValue)).throw();
    });

    it('does not work with invalid value', () => {
      expect(() => new PaymentPackage(validName, '')).throw();
      expect(() => new PaymentPackage(validName, undefined)).throw();
      expect(() => new PaymentPackage(validName, -3)).throw();
      expect(() => new PaymentPackage(validName, {})).throw();
      expect(() => new PaymentPackage(validName, [])).throw();
    });

    it('has all properties', () => {
      const instance = new PaymentPackage(validName, validValue);
      expect(instance).have.property('name');
      expect(instance).have.property('value');
      expect(instance).have.property('VAT');
      expect(instance).have.property('active');
      expect(instance).have.own.property('_name');
      expect(instance).have.own.property('_value');
      expect(instance).have.own.property('_VAT');
      expect(instance).have.own.property('_active');
    });
  });

  describe('Accessors', () => {
    let instance = null;
    beforeEach(() => {
      instance = new PaymentPackage(validName, validValue);
    });

    it('accepts and sets valid name', () => {
      instance.name = 'New package';
      expect(instance.name).equal('New package');
    });

    it('reject invalid name', () => {
      expect(() => (instance.name = '')).throw();
      expect(() => (instance.name = undefined)).throw();
      expect(() => (instance.name = {})).throw();
    });

    it('accepts and sets valid value', () => {
      instance.value = 90;
      expect(instance.value).equal(90);
    });

    it('reject invalid value', () => {
      expect(() => (instance.value = '')).throw();
      expect(() => (instance.value = undefined)).throw();
      expect(() => (instance.value = -5)).throw();
    });

    it('accepts and sets valid VAT', () => {
      instance.vat = 15;
      expect(instance.vat).equal(15);
    });

    it('reject invalid VAT', () => {
      expect(() => (instance.VAT = '')).throw();
      expect(() => (instance.VAT = undefined)).throw();
      expect(() => (instance.VAT = -3)).throw();
    });

    it('accepts and sets valid active', () => {
      instance.active = false;
      expect(instance.active).false;

      instance.active = true;
      expect(instance.active).true;
    });

    it('reject invalid active', () => {
      expect(() => (instance.active = '')).throw();
      expect(() => (instance.active = undefined)).throw();
      expect(() => (instance.active = -3)).throw();
    });
  });

  describe('String info', () => {
    let instance = null;
    beforeEach(() => {
      instance = new PaymentPackage(validName, validValue);
    });

    it('contains the name', () => {
      expect(instance.toString()).contain(validName);
    });

    it('contains the value', () => {
      expect(instance.toString()).contain(validValue.toString());
    });

    it('contains the VAT', () => {
      expect(instance.toString()).contain(instance.VAT + '%');
    });

    it('displays inactive label', () => {
      instance.active = false;
      expect(instance.toString()).contain('(inactive)');
    });

    it('updates info through setters', () => {
      instance.name = 'New Package';
      instance.value = 90;
      instance.VAT = 9;

      const output = instance.toString();

      expect(output).contain('New Package');
      expect(output).contain(90);
      expect(output).contain('9%');
    });
  });
});
