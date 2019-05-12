import { Person, personRules } from "./models/person";
import { inject } from 'aurelia-dependency-injection';
import { StandardValidator } from 'aurelia-validation';
import _ from "lodash";

@inject(StandardValidator)
export class App {
  constructor(validator) {
    this.person = new Person('bkr',2);
    this.genders = [{ value: null, label: 'Choisir ...' }, { value: 1, label: 'Male' }, { value: 2, label: 'Female' }]
    this._validator = validator;
    this.rules = personRules();
    this.handleBlur = () => this.onChange();
    this.handleChange = () => this.onChange();

    this.validationResultObj = {};
    this.validationResultArray = [];
  }


  onChange = (obj, propertyName) => {
    obj = this.person;
    this.validate(obj, propertyName, this.rules).then(newResults => {
      let delta = this.mergeValidationResults(
        this.validationResultArray,
        newResults
      );
      this.validationResultObj = delta.obj;
      this.validationResultArray = delta.array;
    });
  };

  handleSubmit = () => {
    this.validate(this.person).then(newResults => {
      let delta = this.mergeValidationResults(
        this.validationResultArray,
        newResults
      );
      this.validationResultObj = delta.obj;
      this.validationResultArray = delta.array;

    });
  };

  validate = (obj, propertyName, rules) => {
    let validate = () => this._validator.validateObject(obj, rules);
    if (propertyName) {
      validate = () => this._validator.validateProperty(obj, propertyName, rules);
    }
    return validate();
  };

  mergeValidationResults = (oldResults, newResults) => {
    let results = oldResults.slice(0);
    newResults.forEach(newResult => {
      const newResultIndex = results.findIndex(
        x =>
          x.rule === newResult.rule &&
          x.object === newResult.object &&
          x.propertyName === newResult.propertyName
      );
      if (newResultIndex !== -1) {
        results.splice(newResultIndex, 1);
      }
      results.push(newResult);
    });
    return {
      array: results,
      obj: _.groupBy(results, x => x.propertyName)
    };
  };
}
