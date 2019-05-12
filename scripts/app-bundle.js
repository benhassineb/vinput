define('app',["exports", "./models/person", "aurelia-dependency-injection", "aurelia-validation", "lodash"], function (_exports, _person, _aureliaDependencyInjection, _aureliaValidation, _lodash) {
  "use strict";

  _exports.__esModule = true;
  _exports.App = void 0;
  _lodash = _interopRequireDefault(_lodash);

  var _dec, _class, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var App = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaValidation.StandardValidator), _dec(_class = (_temp = function App(validator) {
    var _this = this;

    this.onChange = function (obj, propertyName) {
      obj = _this.person;

      _this.validate(obj, propertyName, _this.rules).then(function (newResults) {
        var delta = _this.mergeValidationResults(_this.validationResultArray, newResults);

        _this.validationResultObj = delta.obj;
        _this.validationResultArray = delta.array;
      });
    };

    this.handleSubmit = function () {
      _this.validate(_this.person).then(function (newResults) {
        var delta = _this.mergeValidationResults(_this.validationResultArray, newResults);

        _this.validationResultObj = delta.obj;
        _this.validationResultArray = delta.array;
      });
    };

    this.validate = function (obj, propertyName, rules) {
      var validate = function validate() {
        return _this._validator.validateObject(obj, rules);
      };

      if (propertyName) {
        validate = function validate() {
          return _this._validator.validateProperty(obj, propertyName, rules);
        };
      }

      return validate();
    };

    this.mergeValidationResults = function (oldResults, newResults) {
      var results = oldResults.slice(0);
      newResults.forEach(function (newResult) {
        var newResultIndex = results.findIndex(function (x) {
          return x.rule === newResult.rule && x.object === newResult.object && x.propertyName === newResult.propertyName;
        });

        if (newResultIndex !== -1) {
          results.splice(newResultIndex, 1);
        }

        results.push(newResult);
      });
      return {
        array: results,
        obj: _lodash.default.groupBy(results, function (x) {
          return x.propertyName;
        })
      };
    };

    this.person = new _person.Person('bkr', 2);
    this.genders = [{
      value: null,
      label: 'Choisir ...'
    }, {
      value: 1,
      label: 'Male'
    }, {
      value: 2,
      label: 'Female'
    }];
    this._validator = validator;
    this.rules = (0, _person.personRules)();

    this.handleBlur = function () {
      return _this.onChange();
    };

    this.handleChange = function () {
      return _this.onChange();
    };

    this.validationResultObj = {};
    this.validationResultArray = [];
  }, _temp)) || _class);
  _exports.App = App;
});;
define('text!app.html',[],function(){return "<template>\n    <require from=\"./vinput\"></require>\n    <require from=\"./vselect\"></require>\n\n  <div class=\"form-row\">\n    <div class=\"col-md-6 mb-3\">\n      <label for=\"validationServer03\">First Name</label>\n      <vinput\n        type=\"text\"\n        class=\"form-control\"      \n        placeholder=\"Name\"   \n        property-name=\"firstName\" \n        value.bind=\"person.firstName\"   \n        validation-result.bind=\"validationResultObj\" \n        handle-blur.bind=\"handleBlur\" \n        handle-change.bind=\"handleChange\"  \n        containerless        \n      />\n    </div>\n    <div class=\"col-md-6 mb-3\">\n      <div class=\"form-group\">\n        <label  >Example select</label>\n        <vselect     \n            property-name=\"genderId\" \n        value.bind=\"person.genderId\"   \n         source.bind=\"genders\"  \n         handle-change.bind=\"handleChange\"  \n         validation-result.bind=\"validationResultObj\" \n          containerless        \n        />\n\n      </div>\n    </div>\n\n  </div>\n\n  <button click.delegate=\"handleSubmit()\">Validate</button>\n</template>\n";});;
define('environment',["exports"], function (_exports) {
  "use strict";

  _exports.__esModule = true;
  _exports.default = void 0;
  var _default = {
    debug: true,
    testing: true
  };
  _exports.default = _default;
});;
define('main',["exports", "core-js/stable", "regenerator-runtime/runtime", "./environment", "aurelia-pal"], function (_exports, _stable, _runtime, _environment, _aureliaPal) {
  "use strict";

  _exports.__esModule = true;
  _exports.configure = configure;
  _environment = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().plugin('aurelia-validation').feature(_aureliaPal.PLATFORM.moduleName('resources/index'));
    aurelia.use.developmentLogging(_environment.default.debug ? 'debug' : 'warn');

    if (_environment.default.testing) {
      aurelia.use.plugin(_aureliaPal.PLATFORM.moduleName('aurelia-testing'));
    }

    aurelia.start().then(function () {
      return aurelia.setRoot(_aureliaPal.PLATFORM.moduleName('app'));
    });
  }
});;
define('models/person',["exports", "aurelia-validation"], function (_exports, _aureliaValidation) {
  "use strict";

  _exports.__esModule = true;
  _exports.personRules = _exports.Person = void 0;

  var Person = function Person(firstName, genderId) {
    this.firstName = firstName;
    this.genderId = genderId;
  };

  _exports.Person = Person;

  var personRules = function personRules() {
    return _aureliaValidation.ValidationRules.ensure('firstName').required().ensure('genderId').required().rules;
  };

  _exports.personRules = personRules;
});;
define('models/validation-result',["exports"], function (_exports) {
  "use strict";

  _exports.__esModule = true;
  _exports.ValidationResultHandler = void 0;

  var ValidationResultHandler =
  /*#__PURE__*/
  function () {
    function ValidationResultHandler() {
      this.validationResult = [];
    }

    ValidationResultHandler.fromObject = function fromObject() {
      for (var _len = arguments.length, source = new Array(_len), _key = 0; _key < _len; _key++) {
        source[_key] = arguments[_key];
      }

      return Object.assign(new ValidationResultHandler(), source);
    };

    return ValidationResultHandler;
  }();

  _exports.ValidationResultHandler = ValidationResultHandler;
});;
define('resources/index',["exports"], function (_exports) {
  "use strict";

  _exports.__esModule = true;
  _exports.configure = configure;

  function configure(config) {//config.globalResources([]);
  }
});;
define('vinput',["exports", "aurelia-framework"], function (_exports, _aureliaFramework) {
  "use strict";

  _exports.__esModule = true;
  _exports.VinputCustomElement = void 0;

  var _dec, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

  var VinputCustomElement = (_dec = (0, _aureliaFramework.bindable)({
    defaultBindingMode: _aureliaFramework.bindingMode.twoWay
  }), (_class = (_temp =
  /*#__PURE__*/
  function () {
    function VinputCustomElement() {
      _initializerDefineProperty(this, "type", _descriptor, this);

      _initializerDefineProperty(this, "class", _descriptor2, this);

      _initializerDefineProperty(this, "placeholder", _descriptor3, this);

      _initializerDefineProperty(this, "propertyName", _descriptor4, this);

      _initializerDefineProperty(this, "value", _descriptor5, this);

      _initializerDefineProperty(this, "handleChange", _descriptor6, this);

      _initializerDefineProperty(this, "handleBlur", _descriptor7, this);

      _initializerDefineProperty(this, "validationResult", _descriptor8, this);
    }

    var _proto = VinputCustomElement.prototype;

    _proto.onChange = function onChange() {
      this.handleChange(null, this.propertyName);
    };

    _proto.onBlur = function onBlur() {
      this.handleChange(null, this.propertyName);
    };

    _proto.onKeyUp = function onKeyUp(value) {
      this.handleChange(value);
    };

    _createClass(VinputCustomElement, [{
      key: "wasValidated",
      get: function get() {
        return this.validationResult && this.validationResult[this.propertyName] && this.validationResult[this.propertyName].length > 0;
      }
    }, {
      key: "isValid",
      get: function get() {
        var isValid = false;

        if (this.wasValidated) {
          isValid = this.validationResult[this.propertyName].find(function (x) {
            return !x.valid;
          }) === undefined;
        }

        return isValid;
      }
    }, {
      key: "isValidFeedback",
      get: function get() {
        return this.wasValidated && this.isValid;
      }
    }, {
      key: "isInValidFeedback",
      get: function get() {
        return this.wasValidated && !this.isValid;
      }
    }, {
      key: "className",
      get: function get() {
        var className = [this.class];

        if (this.isValidFeedback) {
          className.push('is-valid');
        } else if (this.isInValidFeedback) {
          className.push('is-invalid');
        }

        return className.join(' ');
      }
    }, {
      key: "errors",
      get: function get() {
        return this.validationResult[this.propertyName];
      }
    }]);

    return VinputCustomElement;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "type", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return "text";
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "class", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return "form-control";
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "placeholder", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return "";
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "propertyName", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "value", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "handleChange", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "handleBlur", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "validationResult", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class));
  _exports.VinputCustomElement = VinputCustomElement;
});;
define('text!vinput.html',[],function(){return "<template>\r\n  <input\r\n    type.bind=\"type\"\r\n    class.bind=\"className\"\r\n    placeholder.bind=\"placeholder\"\r\n    value.bind=\"value\"\r\n    name.bind=\"propertyName\"\r\n    blur.trigger=\"onBlur()\"\r\n    keyup.trigger=\"onKeyUp()\"\r\n  />\r\n\r\n  <div if.bind=\"isValidFeedback\" class=\"valid-feedback\">\r\n    Looks good!\r\n  </div>\r\n\r\n  <div\r\n    if.bind=\"isInValidFeedback\"\r\n    class=\"invalid-feedback\"\r\n    repeat.for=\"error of errors\"\r\n  >\r\n    ${error.message}\r\n  </div>\r\n</template>\r\n";});;
define('vselect',["exports", "aurelia-framework"], function (_exports, _aureliaFramework) {
  "use strict";

  _exports.__esModule = true;
  _exports.VselectCustomElement = void 0;

  var _dec, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

  var VselectCustomElement = (_dec = (0, _aureliaFramework.bindable)({
    defaultBindingMode: _aureliaFramework.bindingMode.twoWay
  }), (_class = (_temp =
  /*#__PURE__*/
  function () {
    function VselectCustomElement() {
      _initializerDefineProperty(this, "class", _descriptor, this);

      _initializerDefineProperty(this, "propertyName", _descriptor2, this);

      _initializerDefineProperty(this, "value", _descriptor3, this);

      _initializerDefineProperty(this, "handleChange", _descriptor4, this);

      _initializerDefineProperty(this, "source", _descriptor5, this);

      _initializerDefineProperty(this, "validationResult", _descriptor6, this);
    }

    var _proto = VselectCustomElement.prototype;

    _proto.onChange = function onChange() {
      this.handleChange(null, this.propertyName);
    };

    _createClass(VselectCustomElement, [{
      key: "wasValidated",
      get: function get() {
        return this.validationResult && this.validationResult[this.propertyName] && this.validationResult[this.propertyName].length > 0;
      }
    }, {
      key: "isValid",
      get: function get() {
        var isValid = false;

        if (this.wasValidated) {
          isValid = this.validationResult[this.propertyName].find(function (x) {
            return !x.valid;
          }) === undefined;
        }

        return isValid;
      }
    }, {
      key: "isValidFeedback",
      get: function get() {
        return this.wasValidated && this.isValid;
      }
    }, {
      key: "isInValidFeedback",
      get: function get() {
        return this.wasValidated && !this.isValid;
      }
    }, {
      key: "className",
      get: function get() {
        var className = [this.class];

        if (this.isValidFeedback) {
          className.push('is-valid');
        } else if (this.isInValidFeedback) {
          className.push('is-invalid');
        }

        return className.join(' ');
      }
    }, {
      key: "errors",
      get: function get() {
        return this.validationResult[this.propertyName];
      }
    }]);

    return VselectCustomElement;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "class", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return "form-control";
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "propertyName", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "value", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "handleChange", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "source", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "validationResult", [_aureliaFramework.bindable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class));
  _exports.VselectCustomElement = VselectCustomElement;
});;
define('text!vselect.html',[],function(){return "<template>\r\n  <select class.bind=\"className\" value.bind=\"value\" change.trigger=\"onChange()\">\r\n    <option repeat.for=\"model of source\" model.bind=\"model.value\"\r\n      >${model.label}</option\r\n    >\r\n  </select>\r\n\r\n  <div if.bind=\"isValidFeedback\" class=\"valid-feedback\">\r\n    Looks good!\r\n  </div>\r\n\r\n  <div\r\n    if.bind=\"isInValidFeedback\"\r\n    class=\"invalid-feedback\"\r\n    repeat.for=\"error of errors\"\r\n  >\r\n    ${error.message}\r\n  </div>\r\n</template>\r\n";});
//# sourceMappingURL=app-bundle.js.map