import { ValidationRules } from 'aurelia-validation';
export class Person {
    constructor(firstName, genderId) {
        this.firstName = firstName;
        this.genderId = genderId;
    }
}


export const personRules = () => ValidationRules
    .ensure('firstName').required()
    .ensure('genderId').required()
    .rules;

