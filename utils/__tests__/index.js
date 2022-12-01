
const {validateInput} = require('../validations');
const utils = require('../index');
import { describe, expect, it } from '@jest/globals';

describe('utils - formateDate', () => {
  it('should return true', () => {
    const defaultDate = new Date('06/08/2022');
    const date = jest.spyOn(global, 'Date');
    date.mockImplementation(() => defaultDate);

    const formatDate = utils.formatDate();
    const formattedDate = `${defaultDate.getFullYear()}-${defaultDate.getMonth() + 1}-${defaultDate.getDate()} ${defaultDate.getHours()}:${defaultDate.getMinutes()}`;

    expect(formatDate).toEqual(formattedDate);
  });
});

describe('utils - validateInput', () => {
  describe('utils - validateInput - email', () => {
    it('should return []', () => {
      expect(validateInput({email: '123@gmail.com'})).toEqual([]);
    });
  
    it('should return ["email"]', () => {
      let expected = [expect.objectContaining({type: 'email'})];
      expect(validateInput({email: '123'})).toEqual(expect.arrayContaining(expected));
    });
  
    it('should return ["email"]', () => {
      let expected = [expect.objectContaining({type: 'email'})];
      expect(validateInput({email: '123@@gmail.com'})).toEqual(expect.arrayContaining(expected));
    });
  
    it('should return ["email"]', () => {
      let expected = [expect.objectContaining({type: 'email'})];
      expect(validateInput({email: '123@gmailcom'})).toEqual(expect.arrayContaining(expected));
    });

    it('should return ["email"]', () => {
      let expected = [expect.objectContaining({type: 'email'})];
      expect(validateInput({email: 'a@.com'})).toEqual(expect.arrayContaining(expected));
    });
  });

  describe('utils - validateInput - zip', () => {
    it('should return []', () => {
      expect(validateInput({zip: '98109'})).toEqual([]);
    });
  
    it('should return ["zip"]', () => {
      let expected = [expect.objectContaining({type: 'zip'})];
      expect(validateInput({zip: '909'})).toEqual(expect.arrayContaining(expected));
    });
  });

  describe('utils - validateInput - phone', () => {
    it('should return []', () => {
      expect(validateInput({phone: '1234567890'})).toEqual([]);
    });
  
    it('should return ["phone"]', () => {
      let expected = [expect.objectContaining({type: 'phone'})];
      expect(validateInput({phone: '1237890'})).toEqual(expect.arrayContaining(expected));
    });
  
    it('should return ["phone"]', () => {
      let expected = [expect.objectContaining({type: 'phone'})];
      expect(validateInput({phone: '12345a7890'})).toEqual(expect.arrayContaining(expected));
    });
  
    it('should return ["phone"]', () => {
      let expected = [expect.objectContaining({type: 'phone'})];
      expect(validateInput({phone: '12345678901'})).toEqual(expect.arrayContaining(expected));
    });
  });
});
