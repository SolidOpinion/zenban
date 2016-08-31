define('app',['exports', 'aurelia-event-aggregator', 'aurelia-dependency-injection', 'aurelia-framework', './models/auth'], function (exports, _aureliaEventAggregator, _aureliaDependencyInjection, _aureliaFramework, _auth) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.App = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var App = exports.App = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaEventAggregator.EventAggregator, _auth.Auth), _dec(_class = function () {
        function App(eventAggregator, auth) {
            _classCallCheck(this, App);

            this.eventAggregator = eventAggregator;
            this.currentRoute = "/";
            this.isPipelineOptions = true;
            this.auth = auth;
        }

        App.prototype.configureRouter = function configureRouter(config, router) {
            this.router = router;

            config.map([{ route: "", moduleId: "controllers/welcome", nav: true, title: "Welcome", name: "welcome" }, { route: "signup", moduleId: "controllers/signup", nav: false, title: "Signup", name: "signup" }, { route: "login", moduleId: "controllers/login", nav: false, title: "Login", name: "login" }, { route: "logout", moduleId: "controllers/logout", nav: false, title: "Logout", name: "logout" }, { route: "secret", moduleId: "controllers/secret", nav: true, title: "Secret", name: "secret" }]);
        };

        App.prototype.navigationSuccess = function navigationSuccess(event) {
            var instruction = event.instruction;
            this.currentRoute = instruction.fragment;
            if (this.currentRoute == "/") {
                this.isPipelineOptions = true;
            } else {
                this.isPipelineOptions = false;
            }
        };

        App.prototype.attached = function attached() {
            this.subscription = this.eventAggregator.subscribe('router:navigation:success', this.navigationSuccess.bind(this));
        };

        App.prototype.detached = function detached() {
            this.subscription.dispose();
        };

        _createClass(App, [{
            key: 'isLogged',
            get: function get() {
                return this.auth.isLogged;
            }
        }, {
            key: 'user',
            get: function get() {
                return this.auth.user;
            }
        }]);

        return App;
    }()) || _class);
});
define('authConfig',['exports', './environment'], function (exports, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _environment2 = _interopRequireDefault(_environment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var config = {

        baseUrl: _environment2.default.api,
        signupUrl: '/api/user',
        loginUrl: '/api/auth',
        tokenName: 'zenban_id_token',
        loginRedirect: '#/'
    };

    exports.default = config;
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true,
    api: "http://localhost:5000"
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration();

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('controllers/addItem',["exports", "aurelia-framework", "aurelia-router", "../models/itemsData", "../models/usersData", "../models/requirementsData"], function (exports, _aureliaFramework, _aureliaRouter, _itemsData, _usersData, _requirementsData) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AddItem = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var AddItem = exports.AddItem = (_dec = (0, _aureliaFramework.inject)(_itemsData.ItemsData, _aureliaRouter.Router, _requirementsData.RequirementsData, _usersData.UsersData), _dec(_class = function () {
        function AddItem(itemsData, router, requirementsData, usersData) {
            _classCallCheck(this, AddItem);

            this.data = itemsData;
            this.rdata = requirementsData;
            this.udata = usersData;
            this.router = router;

            this.item = {};
            this.item.title = "";
            this.item.description = "";
            this.item.type = "feature";
            this.item.estimate = 0;
            this.item.isProblem = false;
            this.item.status = "Backlog";
        }

        AddItem.prototype.attached = function attached() {
            this.isProblemFocus = false;
            this.isTitleFocus = true;
        };

        AddItem.prototype.switchType = function switchType(newType) {
            this.item.type = newType;
        };

        AddItem.prototype.switchEstimate = function switchEstimate(newEstimate) {
            this.item.estimate = newEstimate;
        };

        AddItem.prototype.switchProblem = function switchProblem() {
            if (this.item.isProblem) {
                this.item.isProblem = false;
                this.isProblemFocus = false;
                this.isTitleFocus = true;
            } else {
                this.item.isProblem = true;
                this.isProblemFocus = true;
                this.isTitleFocus = false;
            }
        };

        AddItem.prototype.save = function save() {
            var _this = this;

            if (this.item.featureId == "") this.item.featureId = undefined;
            if (this.item.requirementId == "") this.item.requirementId = undefined;
            if (this.item.authorId == "") this.item.authorId = undefined;
            if (this.item.assigneeId == "") this.item.assigneeId = undefined;

            this.data.addNew(this.item).then(function (response) {
                _this.router.navigate('/');
            });
        };

        _createClass(AddItem, [{
            key: "canSave",
            get: function get() {
                if (!this.item.title || this.item.title.length < 1) return false;
                if (!this.item.description || this.item.description.length < 1) return false;
                return true;
            }
        }, {
            key: "hasFeature",
            get: function get() {
                if (this.item.type != 'feature') return true;
                return false;
            }
        }, {
            key: "hasEstimate",
            get: function get() {
                if (this.item.type == 'feature') return false;
                return true;
            }
        }]);

        return AddItem;
    }()) || _class);
});
define('controllers/archive',["exports", "aurelia-framework", "../models/itemsData"], function (exports, _aureliaFramework, _itemsData) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Archive = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Archive = exports.Archive = (_dec = (0, _aureliaFramework.inject)(_itemsData.ItemsData), _dec(_class = function () {
        function Archive(itemsData) {
            _classCallCheck(this, Archive);

            this.data = itemsData;
            this.items = [];
        }

        Archive.prototype.attached = function attached() {
            var _this = this;

            this.data.getClosedList().then(function (items) {
                _this.items = items;
                for (var i = 0; i < _this.items.length; i++) {
                    _this.items[i].updatedTitle = _this.getTimeStamp(_this.items[i].updated);
                }
                console.log(_this.items);
            });
        };

        Archive.prototype.getTimeStamp = function getTimeStamp(s) {
            var d = new Date(s);
            var date = [d.getMonth() + 1, d.getDate(), d.getFullYear()];
            var time = [d.getHours(), d.getMinutes()];
            var suffix = time[0] < 12 ? "AM" : "PM";
            time[0] = time[0] < 12 ? time[0] : time[0] - 12;
            time[0] = time[0] || 12;
            for (var i = 1; i < 3; i++) {
                if (time[i] < 10) {
                    time[i] = "0" + time[i];
                }
            }
            return date.join("/") + " " + time.join(":") + " " + suffix;
        };

        return Archive;
    }()) || _class);
});
define('controllers/autocomplete',['exports', 'aurelia-framework', 'jquery'], function (exports, _aureliaFramework, _jquery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Autocomplete = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

    var Autocomplete = exports.Autocomplete = (_class = function () {
        function Autocomplete(element) {
            _classCallCheck(this, Autocomplete);

            _initDefineProp(this, 'placeholder', _descriptor, this);

            _initDefineProp(this, 'minTermLength', _descriptor2, this);

            _initDefineProp(this, 'loader', _descriptor3, this);

            _initDefineProp(this, 'value', _descriptor4, this);

            _initDefineProp(this, 'valueId', _descriptor5, this);

            this.isShown = false;
            this.items = [];
            this.selected = {};
            this.value = "";
            this.valueId = "";
        }

        Autocomplete.prototype.attached = function attached() {};

        Autocomplete.prototype.inputKeyPressed = function inputKeyPressed(event) {
            var _this = this;

            if (this.value.length > this.minTermLength - 1) {
                this.loader.search(this.value).then(function (res) {
                    _this.items = res;
                    _this.isShown = true;
                });
            } else {
                this.isShown = false;
            }

            return true;
        };

        Autocomplete.prototype.itemSelected = function itemSelected(event) {
            var item = (0, _jquery2.default)(event.target);
            var selected = item.attr('data-id');
            while (selected === undefined && item) {
                item = item.parent();
                selected = item.attr('data-id');
            }
            if (selected !== undefined) {
                this.hasFocus = false;
                var val = item.attr('data-value');
                this.valueId = selected;
                this.value = val;
                this.selected.id = selected;
                this.selected.value = val;
                this.isShown = false;
                this.items = [];
            }
        };

        Autocomplete.prototype.hideSuggestions = function hideSuggestions() {
            this.isShown = false;

            if (this.selected.id && this.selected.id == this.valueId && this.value != "") {
                this.value = this.selected.value;
            } else {
                this.selected = {};
                this.value = "";
                this.valueId = "";
            }
            this.hasFocus = false;
        };

        return Autocomplete;
    }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'placeholder', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'minTermLength', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'loader', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'value', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'valueId', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class);
});
define('controllers/editItem',["exports", "aurelia-framework", "aurelia-router", "../models/itemsData", "../models/usersData", "../models/requirementsData"], function (exports, _aureliaFramework, _aureliaRouter, _itemsData, _usersData, _requirementsData) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EditItem = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var EditItem = exports.EditItem = (_dec = (0, _aureliaFramework.inject)(_itemsData.ItemsData, _aureliaRouter.Router, _requirementsData.RequirementsData, _usersData.UsersData), _dec(_class = function () {
        function EditItem(itemsData, router, requirementsData, usersData) {
            _classCallCheck(this, EditItem);

            this.data = itemsData;
            this.rdata = requirementsData;
            this.udata = usersData;
            this.router = router;

            this.item = {};
            this.item.title = "";
            this.item.description = "";
            this.item.type = "feature";
            this.item.estimate = 0;
            this.item.isProblem = false;
            this.item.status = "Backlog";
        }

        EditItem.prototype.activate = function activate(params) {
            var _this = this;

            if (params.id != undefined && params.id.length > 0) {
                this.data.getOne(params.id).then(function (item) {
                    _this.item = item;
                    if (_this.item.requirement != undefined) _this.item.requirementTitle = _this.item.requirement.title;
                    if (_this.item.feature != undefined) _this.item.featureTitle = _this.item.feature.title;
                    if (_this.item.author != undefined) _this.item.authorTitle = _this.item.author.title;
                    if (_this.item.assignee != undefined) _this.item.assigneeTitle = _this.item.assignee.title;
                });
            }
        };

        EditItem.prototype.attached = function attached() {
            this.isProblemFocus = false;
            this.isTitleFocus = true;
        };

        EditItem.prototype.switchType = function switchType(newType) {
            this.item.type = newType;
        };

        EditItem.prototype.switchEstimate = function switchEstimate(newEstimate) {
            this.item.estimate = newEstimate;
        };

        EditItem.prototype.switchProblem = function switchProblem() {
            if (this.item.isProblem) {
                this.item.isProblem = false;
                this.isProblemFocus = false;
                this.isTitleFocus = true;
            } else {
                this.item.isProblem = true;
                this.isProblemFocus = true;
                this.isTitleFocus = false;
            }
        };

        EditItem.prototype.restore = function restore() {
            var _this2 = this;

            this.item.status = "Backlog";
            this.data.update(this.item._id, this.item).then(function (response) {
                _this2.router.navigate('/');
            });
        };

        EditItem.prototype.save = function save() {
            var _this3 = this;

            this.data.update(this.item._id, this.item).then(function (response) {
                _this3.router.navigate('/');
            });
        };

        _createClass(EditItem, [{
            key: "isClosed",
            get: function get() {
                if (this.item.status == "Closed") return true;
                return false;
            }
        }, {
            key: "canSave",
            get: function get() {
                if (!this.item.title || this.item.title.length < 1) return false;
                if (!this.item.description || this.item.description.length < 1) return false;
                return true;
            }
        }, {
            key: "hasFeature",
            get: function get() {
                if (this.item.type != 'feature') return true;
                return false;
            }
        }, {
            key: "hasEstimate",
            get: function get() {
                if (this.item.type == 'feature') return false;
                return true;
            }
        }]);

        return EditItem;
    }()) || _class);
});
define('controllers/login',['exports', 'aurelia-framework', '../models/auth', 'aurelia-router'], function (exports, _aureliaFramework, _auth, _aureliaRouter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Login = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_auth.Auth, _aureliaRouter.Router), _dec(_class = function () {
        function Login(auth, router) {
            _classCallCheck(this, Login);

            this.heading = "Login";
            this.email = "";
            this.password = "";
            this.loginError = "";

            this.auth = auth;
            this.router = router;
        }

        Login.prototype.login = function login() {
            var _this = this;

            this.auth.login(this.email, this.password).then(function (response) {
                _this.router.navigate('');
            }).catch(function (error) {
                _this.loginError = error.message;
            });
        };

        _createClass(Login, [{
            key: 'isLogged',
            get: function get() {
                return this.auth.isLogged;
            }
        }]);

        return Login;
    }()) || _class);
});
define('controllers/logout',['exports', 'aurelia-framework', '../models/auth', 'aurelia-router'], function (exports, _aureliaFramework, _auth, _aureliaRouter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Logout = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_auth.Auth, _aureliaRouter.Router), _dec(_class = function () {
        function Logout(auth, router) {
            _classCallCheck(this, Logout);

            this.auth = auth;
            this.router = router;
        }

        Logout.prototype.activate = function activate() {
            this.auth.logout();
            this.router.navigate('#/login');
        };

        return Logout;
    }()) || _class);
});
define('controllers/node',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Node = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _desc, _value, _class, _descriptor, _descriptor2;

    var Node = exports.Node = (_class = function () {
        function Node() {
            _classCallCheck(this, Node);

            _initDefineProp(this, 'current', _descriptor, this);

            _initDefineProp(this, 'edit', _descriptor2, this);
        }

        Node.prototype.sendEdit = function sendEdit(id) {
            this.edit({ id: id });
        };

        return Node;
    }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'current', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'edit', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class);
});
define('controllers/pipelines',["exports", "aurelia-framework", "aurelia-router", "jquery", "jquery-ui-dist", "../models/itemsData"], function (exports, _aureliaFramework, _aureliaRouter, _jquery, _jqueryUiDist, _itemsData) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Pipelines = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var Pipelines = exports.Pipelines = (_dec = (0, _aureliaFramework.inject)(_itemsData.ItemsData, _aureliaRouter.Router), _dec(_class = function () {
    function Pipelines(itemsData, router) {
      _classCallCheck(this, Pipelines);

      this.data = itemsData;
      this.router = router;

      this.statuses = ['Backlog', 'Ready', 'In progress', 'Done', 'Release', 'Review', 'Closed'];
      this.items = {};

      this.filter = {};
      this.filter.text = "";
      this.filter.isFeatures = true;
      this.filter.isTasks = true;
      this.filter.isBugs = true;
    }

    Pipelines.prototype.compareItems = function compareItems(a, b) {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    };

    Pipelines.prototype.refresh = function refresh() {
      var _this = this;

      this.data.getList(this.filter).then(function (items) {
        _this.items = items.content;
      });
    };

    Pipelines.prototype.onBeforeStop = function onBeforeStop(evt, ui) {
      console.log("OnDragStop");
      var newStatus = ui.item.parent().closest('ul').attr('data-status');
      var itemId = ui.item.attr('data-id');
      var self = (0, _jquery2.default)(this).data('injected');
      var order = ui.item.parent().closest('ul').sortable('toArray').toString();

      self.data.updateStatusAndOrder(itemId, newStatus, order).then(function () {
        self.refresh();
      });

      return false;
    };

    Pipelines.prototype.attached = function attached() {
      var self = this;
      (0, _jquery2.default)("ul.items").sortable({
        connectWith: "ul",
        beforeStop: this.onBeforeStop
      }).data('injected', self).disableSelection();
      this.refresh();
    };

    Pipelines.prototype.switchFeatures = function switchFeatures() {
      if (this.filter.isFeatures) {
        this.filter.isFeatures = false;
      } else {
        this.filter.isFeatures = true;
      }
      this.refresh();
    };

    Pipelines.prototype.switchTasks = function switchTasks() {
      if (this.filter.isTasks) {
        this.filter.isTasks = false;
      } else {
        this.filter.isTasks = true;
      }
      this.refresh();
    };

    Pipelines.prototype.switchBugs = function switchBugs() {
      if (this.filter.isBugs) {
        this.filter.isBugs = false;
      } else {
        this.filter.isBugs = true;
      }
      this.refresh();
    };

    _createClass(Pipelines, [{
      key: "_items",
      get: function get() {
        var items = {};
        items.totals = {};
        for (var i = 0; i < this.items.length; i++) {
          var status = this.items[i].status;
          if (items[status] == undefined) items[status] = [];
          if (items.totals[status] == undefined) items.totals[status] = 0;
          items[status].push(this.items[i]);
          items.totals[status] = items.totals[status] + this.items[i].estimate;
        }
        for (i = 0; i < this.statuses.length; i++) {
          var status = this.statuses[i];
          if (items[status] != undefined) items[status].sort(this.compareItems);
        }
        return items;
      },
      set: function set(items) {
        this._items = items;
      }
    }]);

    return Pipelines;
  }()) || _class);
});
define('controllers/requirements',["exports", "aurelia-framework", "../models/requirementsData"], function (exports, _aureliaFramework, _requirementsData) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Requirements = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var Requirements = exports.Requirements = (_dec = (0, _aureliaFramework.inject)(_requirementsData.RequirementsData), _dec(_class = function () {
        function Requirements(requirementsData) {
            _classCallCheck(this, Requirements);

            this.data = requirementsData;
            this.requirements = {};
            this.isForm = false;
            this.requirement = {};
        }

        Requirements.prototype.refreshTree = function refreshTree() {
            var _this = this;

            this.data.getList().then(function (requirements) {
                var map = {},
                    node,
                    roots = [];
                for (var i = 0; i < requirements.length; i++) {
                    node = requirements[i];
                    node.children = [];
                    map[node._id] = i;
                    if (node.hasOwnProperty("parent") && node.parent !== null) {
                        requirements[map[node.parent]].children.push(node);
                    } else {
                        roots.push(node);
                    }
                }
                _this.requirements = roots;
            });
        };

        Requirements.prototype.attached = function attached() {
            this.refreshTree();
        };

        Requirements.prototype.create = function create(parentId) {
            this.isForm = true;
            this.requirement = {};
            if (parentId != null) this.requirement.parent = parentId;
        };

        Requirements.prototype.edit = function edit(id) {
            var _this2 = this;

            console.log(id);
            this.data.getOne(id).then(function (requirement) {
                _this2.requirement = requirement;
                _this2.isForm = true;
            });
        };

        Requirements.prototype.remove = function remove(id) {
            var _this3 = this;

            this.data.remove(id).then(function (requirement) {
                _this3.isForm = false;
                _this3.requirement = {};
                _this3.refreshTree();
            });
        };

        Requirements.prototype.hide = function hide() {
            this.isForm = false;
            this.requirement = {};
        };

        Requirements.prototype.save = function save() {
            var _this4 = this;

            if (this.requirement._id != null) {
                this.data.update(this.requirement._id, this.requirement).then(function (response) {
                    _this4.isForm = false;
                    _this4.refreshTree();
                });
            } else {
                this.data.addNew(this.requirement).then(function (response) {
                    _this4.isForm = false;
                    _this4.refreshTree();
                });
            }
        };

        _createClass(Requirements, [{
            key: "canSave",
            get: function get() {
                if (!this.requirement.title || this.requirement.title.length < 1) {
                    return false;
                }
                return true;
            }
        }]);

        return Requirements;
    }()) || _class);
});
define('controllers/signup',['exports', 'aurelia-framework', '../models/usersData', '../models/auth'], function (exports, _aureliaFramework, _usersData, _auth) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Signup = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_usersData.UsersData, _auth.Auth), _dec(_class = function () {
        function Signup(usersData, auth) {
            _classCallCheck(this, Signup);

            this.heading = 'Sign Up';
            this.email = '';
            this.name = '';
            this.password = '';
            this.signupError = '';

            this.usersData = usersData;
            this.auth = auth;
        }

        Signup.prototype.signup = function signup() {
            var userInfo = { name: this.name, email: this.email, password: this.password };
            var self = this;

            this.usersData.addNew(userInfo).then(function (response) {
                console.log(response);
            }).catch(function (error) {
                console.log(error);
            });
        };

        return Signup;
    }()) || _class);
});
define('controllers/users',["exports", "aurelia-framework", "../models/usersData"], function (exports, _aureliaFramework, _usersData) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Users = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var Users = exports.Users = (_dec = (0, _aureliaFramework.inject)(_usersData.UsersData), _dec(_class = function () {
        function Users(usersData) {
            _classCallCheck(this, Users);

            this.data = usersData;
            this.isForm = false;
            this.user = {};
            this.users = [];
        }

        Users.prototype.refreshList = function refreshList() {
            var _this = this;

            this.data.getList().then(function (users) {
                _this.users = users;
            });
        };

        Users.prototype.attached = function attached() {
            this.refreshList();
        };

        Users.prototype.create = function create() {
            this.isForm = true;
            this.user = {};
        };

        Users.prototype.save = function save() {
            var _this2 = this;

            if (this.user._id != undefined && this.user._id != null) {
                this.data.update(this.user._id, this.user).then(function (response) {
                    _this2.isForm = false;
                    _this2.refreshList();
                });
            } else {
                this.data.addNew(this.user).then(function (response) {
                    _this2.isForm = false;
                    _this2.refreshList();
                });
            }
        };

        Users.prototype.hide = function hide() {
            this.isForm = false;
            this.user = {};
        };

        Users.prototype.edit = function edit(id) {
            var _this3 = this;

            this.data.getOne(id).then(function (user) {
                _this3.user = user;
                _this3.isForm = true;
            });
        };

        _createClass(Users, [{
            key: "canSave",
            get: function get() {
                if (!this.user.email || this.user.email.length < 1) {
                    return false;
                }
                return true;
            }
        }]);

        return Users;
    }()) || _class);
});
define('controllers/welcome',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Welcome = exports.Welcome = function Welcome(usersData) {
        _classCallCheck(this, Welcome);

        this.heading = 'Welcome to the Random Quotes App!';
        this.info = 'You can get a random quote without logging in, but if you do log in you can get a super secret quote!';

        this.data = usersData;
        this.isForm = false;
        this.user = {};
        this.users = [];
    };
});
define('models/itemsData',["exports", "aurelia-framework", "aurelia-http-client", "../environment"], function (exports, _aureliaFramework, _aureliaHttpClient, _environment) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ItemsData = undefined;

    var _environment2 = _interopRequireDefault(_environment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var base = _environment2.default.api;
    var baseUrl = _environment2.default.api + "/api/items";
    var searchUrl = _environment2.default.api + "/api/search/items";
    var boardUrl = _environment2.default.api + "/api/board";
    var archiveUrl = _environment2.default.api + "/api/archive";

    var ItemsData = exports.ItemsData = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = function () {
        function ItemsData(httpClient, configure) {
            _classCallCheck(this, ItemsData);

            this.http = httpClient;
            console.log(_environment2.default.api);
        }

        ItemsData.prototype.addNew = function addNew(item) {
            return this.http.post(baseUrl, item).then(function (response) {
                return response.content;
            });
        };

        ItemsData.prototype.getOne = function getOne(id) {
            return this.http.get(baseUrl + "/" + id).then(function (response) {
                return response.content;
            });
        };

        ItemsData.prototype.update = function update(id, item) {

            if (item.requirement != undefined) item.requirement = item.requirement.id;
            if (item.feature != undefined) item.feature = item.feature.id;
            if (item.author != undefined) item.author = item.author.id;
            if (item.assignee != undefined) item.assignee = item.assignee.id;

            return this.http.put(baseUrl + "/" + id, item).then(function (response) {
                return response.content;
            });
        };

        ItemsData.prototype.updateStatusAndOrder = function updateStatusAndOrder(id, status, order) {
            var request = {};
            request.id = id;
            request.status = status;
            request.order = order;
            return this.http.post(boardUrl, request).then(function (response) {
                return response.content;
            });
        };

        ItemsData.prototype.remove = function remove(id) {
            return this.http.delete(baseUrl + "/" + id).then(function (response) {
                return response.content;
            });
        };

        ItemsData.prototype.getList = function getList(filter) {
            return this.http.createRequest("/api/items").asGet().withBaseUrl(base).withParams(filter).send();
        };

        ItemsData.prototype.getClosedList = function getClosedList() {
            return this.http.get(archiveUrl).then(function (response) {
                return response.content;
            });
        };

        ItemsData.prototype.search = function search(term) {
            return this.http.post(searchUrl, { search: term }).then(function (response) {
                return response.content;
            });
        };

        return ItemsData;
    }()) || _class);
});
define('models/requirementsData',["exports", "aurelia-framework", "aurelia-http-client", "../environment"], function (exports, _aureliaFramework, _aureliaHttpClient, _environment) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RequirementsData = undefined;

    var _environment2 = _interopRequireDefault(_environment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var baseUrl = _environment2.default.api + "/api/requirements";
    var searchUrl = _environment2.default.api + "/api/search/requirements";

    var RequirementsData = exports.RequirementsData = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = function () {
        function RequirementsData(httpClient) {
            _classCallCheck(this, RequirementsData);

            this.http = httpClient;
        }

        RequirementsData.prototype.addNew = function addNew(requirement) {
            return this.http.post(baseUrl, requirement).then(function (response) {
                return response.content;
            });
        };

        RequirementsData.prototype.getOne = function getOne(id) {
            return this.http.get(baseUrl + "/" + id).then(function (response) {
                return response.content;
            });
        };

        RequirementsData.prototype.update = function update(id, requirement) {
            return this.http.put(baseUrl + "/" + id, requirement).then(function (response) {
                return response.content;
            });
        };

        RequirementsData.prototype.remove = function remove(id) {
            return this.http.delete(baseUrl + "/" + id).then(function (response) {
                return response.content;
            });
        };

        RequirementsData.prototype.getList = function getList() {
            return this.http.get(baseUrl).then(function (response) {
                return response.content;
            });
        };

        RequirementsData.prototype.search = function search(term) {
            return this.http.post(searchUrl, { search: term }).then(function (response) {

                for (var i = 0; i < response.content.length; i++) {
                    response.content[i].title = '[ ' + response.content[i].requirementCode + ' ]  ' + response.content[i].title;
                }
                return response.content;
            });
        };

        return RequirementsData;
    }()) || _class);
});
define('models/usersData',["exports", "aurelia-framework", "aurelia-http-client", "../environment"], function (exports, _aureliaFramework, _aureliaHttpClient, _environment) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UsersData = undefined;

    var _environment2 = _interopRequireDefault(_environment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var searchUrl = _environment2.default.api + "/api/search/users";
    var baseUrl = _environment2.default.api + "/api/user";

    var UsersData = exports.UsersData = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = function () {
        function UsersData(httpClient) {
            _classCallCheck(this, UsersData);

            this.http = httpClient;
        }

        UsersData.prototype.addNew = function addNew(user) {
            return this.http.post(baseUrl, user).then(function (response) {
                return response.content;
            });
        };

        UsersData.prototype.getList = function getList() {
            return this.http.get(baseUrl).then(function (response) {
                return response.content;
            });
        };

        UsersData.prototype.search = function search(term) {
            return this.http.post(searchUrl, { search: term }).then(function (response) {
                return response.content;
            });
        };

        UsersData.prototype.getOne = function getOne(id) {
            return this.http.get(baseUrl + "/" + id).then(function (response) {
                return response.content;
            });
        };

        UsersData.prototype.update = function update(id, user) {
            return this.http.put(baseUrl + "/" + id, user).then(function (response) {
                return response.content;
            });
        };

        return UsersData;
    }()) || _class);
});
define('aurelia-auth/auth-service',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', 'aurelia-event-aggregator', './authentication', './base-config', './oAuth1', './oAuth2', './auth-utilities'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _aureliaEventAggregator, _authentication, _baseConfig, _oAuth, _oAuth2, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthService = undefined;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthService = exports.AuthService = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication, _oAuth.OAuth1, _oAuth2.OAuth2, _baseConfig.BaseConfig, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AuthService(http, auth, oAuth1, oAuth2, config, eventAggregator) {
      _classCallCheck(this, AuthService);

      this.http = http;
      this.auth = auth;
      this.oAuth1 = oAuth1;
      this.oAuth2 = oAuth2;
      this.config = config.current;
      this.tokenInterceptor = auth.tokenInterceptor;
      this.eventAggregator = eventAggregator;
    }

    AuthService.prototype.getMe = function getMe() {
      var profileUrl = this.auth.getProfileUrl();
      return this.http.fetch(profileUrl).then(_authUtilities.status);
    };

    AuthService.prototype.isAuthenticated = function isAuthenticated() {
      return this.auth.isAuthenticated();
    };

    AuthService.prototype.getTokenPayload = function getTokenPayload() {
      return this.auth.getPayload();
    };

    AuthService.prototype.signup = function signup(displayName, email, password) {
      var _this = this;

      var signupUrl = this.auth.getSignupUrl();
      var content = void 0;
      if (_typeof(arguments[0]) === 'object') {
        content = arguments[0];
      } else {
        content = {
          'displayName': displayName,
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(signupUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.loginOnSignup) {
          _this.auth.setToken(response);
        } else if (_this.config.signupRedirect) {
          window.location.href = _this.config.signupRedirect;
        }
        _this.eventAggregator.publish('auth:signup', response);
        return response;
      });
    };

    AuthService.prototype.login = function login(email, password) {
      var _this2 = this;

      var loginUrl = this.auth.getLoginUrl();
      var content = void 0;
      if (typeof arguments[1] !== 'string') {
        content = arguments[0];
      } else {
        content = {
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(loginUrl, {
        method: 'post',
        headers: typeof content === 'string' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {},
        body: typeof content === 'string' ? content : (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        _this2.auth.setToken(response);
        _this2.eventAggregator.publish('auth:login', response);
        return response;
      });
    };

    AuthService.prototype.logout = function logout(redirectUri) {
      this.eventAggregator.publish('auth:logout');
      return this.auth.logout(redirectUri);
    };

    AuthService.prototype.authenticate = function authenticate(name, redirect, userData) {
      var _this3 = this;

      var provider = this.oAuth2;
      if (this.config.providers[name].type === '1.0') {
        provider = this.oAuth1;
      }

      return provider.open(this.config.providers[name], userData || {}).then(function (response) {
        _this3.auth.setToken(response, redirect);
        _this3.eventAggregator.publish('auth:authenticate', response);
        return response;
      });
    };

    AuthService.prototype.unlink = function unlink(provider) {
      var _this4 = this;

      var unlinkUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

      if (this.config.unlinkMethod === 'get') {
        return this.http.fetch(unlinkUrl + provider).then(_authUtilities.status).then(function (response) {
          _this4.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      } else if (this.config.unlinkMethod === 'post') {
        return this.http.fetch(unlinkUrl, {
          method: 'post',
          body: (0, _aureliaFetchClient.json)(provider)
        }).then(_authUtilities.status).then(function (response) {
          _this4.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      }
    };

    return AuthService;
  }()) || _class);
});
define('aurelia-auth/authentication',['exports', 'aurelia-dependency-injection', './base-config', './storage', './auth-utilities'], function (exports, _aureliaDependencyInjection, _baseConfig, _storage, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Authentication = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var Authentication = exports.Authentication = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _baseConfig.BaseConfig), _dec(_class = function () {
    function Authentication(storage, config) {
      _classCallCheck(this, Authentication);

      this.storage = storage;
      this.config = config.current;
      this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
      this.idTokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
    }

    Authentication.prototype.getLoginRoute = function getLoginRoute() {
      return this.config.loginRoute;
    };

    Authentication.prototype.getLoginRedirect = function getLoginRedirect() {
      return this.initialUrl || this.config.loginRedirect;
    };

    Authentication.prototype.getLoginUrl = function getLoginUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
    };

    Authentication.prototype.getSignupUrl = function getSignupUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
    };

    Authentication.prototype.getProfileUrl = function getProfileUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
    };

    Authentication.prototype.getToken = function getToken() {
      return this.storage.get(this.tokenName);
    };

    Authentication.prototype.getPayload = function getPayload() {
      var token = this.storage.get(this.tokenName);
      return this.decomposeToken(token);
    };

    Authentication.prototype.decomposeToken = function decomposeToken(token) {
      if (token && token.split('.').length === 3) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        try {
          return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        } catch (error) {
          return null;
        }
      }
    };

    Authentication.prototype.setInitialUrl = function setInitialUrl(url) {
      this.initialUrl = url;
    };

    Authentication.prototype.setToken = function setToken(response, redirect) {
      var accessToken = response && response[this.config.responseTokenProp];
      var tokenToStore = void 0;

      if (accessToken) {
        if ((0, _authUtilities.isObject)(accessToken) && (0, _authUtilities.isObject)(accessToken.data)) {
          response = accessToken;
        } else if ((0, _authUtilities.isString)(accessToken)) {
          tokenToStore = accessToken;
        }
      }

      if (!tokenToStore && response) {
        tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
      }

      if (tokenToStore) {
        this.storage.set(this.tokenName, tokenToStore);
      }

      var idToken = response && response[this.config.responseIdTokenProp];

      if (idToken) {
        this.storage.set(this.idTokenName, idToken);
      }

      if (this.config.loginRedirect && !redirect) {
        window.location.href = this.getLoginRedirect();
      } else if (redirect && (0, _authUtilities.isString)(redirect)) {
        window.location.href = window.encodeURI(redirect);
      }
    };

    Authentication.prototype.removeToken = function removeToken() {
      this.storage.remove(this.tokenName);
    };

    Authentication.prototype.isAuthenticated = function isAuthenticated() {
      var token = this.storage.get(this.tokenName);

      if (!token) {
        return false;
      }

      if (token.split('.').length !== 3) {
        return true;
      }

      var exp = void 0;
      try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        exp = JSON.parse(window.atob(base64)).exp;
      } catch (error) {
        return false;
      }

      if (exp) {
        return Math.round(new Date().getTime() / 1000) <= exp;
      }

      return true;
    };

    Authentication.prototype.logout = function logout(redirect) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.storage.remove(_this.tokenName);

        if (_this.config.logoutRedirect && !redirect) {
          window.location.href = _this.config.logoutRedirect;
        } else if ((0, _authUtilities.isString)(redirect)) {
          window.location.href = redirect;
        }

        resolve();
      });
    };

    _createClass(Authentication, [{
      key: 'tokenInterceptor',
      get: function get() {
        var config = this.config;
        var storage = this.storage;
        var auth = this;
        return {
          request: function request(_request) {
            if (auth.isAuthenticated() && config.httpInterceptor) {
              var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
              var token = storage.get(tokenName);

              if (config.authHeader && config.authToken) {
                token = config.authToken + ' ' + token;
              }

              _request.headers.set(config.authHeader, token);
            }
            return _request;
          }
        };
      }
    }]);

    return Authentication;
  }()) || _class);
});
define('aurelia-auth/base-config',['exports', './auth-utilities'], function (exports, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BaseConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var BaseConfig = exports.BaseConfig = function () {
    BaseConfig.prototype.configure = function configure(incomingConfig) {
      (0, _authUtilities.merge)(this._current, incomingConfig);
    };

    _createClass(BaseConfig, [{
      key: 'current',
      get: function get() {
        return this._current;
      }
    }]);

    function BaseConfig() {
      _classCallCheck(this, BaseConfig);

      this._current = {
        httpInterceptor: true,
        loginOnSignup: true,
        baseUrl: '/',
        loginRedirect: '#/',
        logoutRedirect: '#/',
        signupRedirect: '#/login',
        loginUrl: '/auth/login',
        signupUrl: '/auth/signup',
        profileUrl: '/auth/me',
        loginRoute: '/login',
        signupRoute: '/signup',
        tokenRoot: false,
        tokenName: 'token',
        idTokenName: 'id_token',
        tokenPrefix: 'aurelia',
        responseTokenProp: 'access_token',
        responseIdTokenProp: 'id_token',
        unlinkUrl: '/auth/unlink/',
        unlinkMethod: 'get',
        authHeader: 'Authorization',
        authToken: 'Bearer',
        withCredentials: true,
        platform: 'browser',
        storage: 'localStorage',
        providers: {
          identSrv: {
            name: 'identSrv',
            url: '/auth/identSrv',

            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'openid'],
            responseType: 'code',
            scopePrefix: '',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope', 'nonce'],
            optionalUrlParams: ['display', 'state'],
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            display: 'popup',
            type: '2.0',
            clientId: 'jsClient',
            nonce: function nonce() {
              var val = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
              return encodeURIComponent(val);
            },
            popupOptions: { width: 452, height: 633 }
          },
          google: {
            name: 'google',
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'email'],
            scopePrefix: 'openid',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display', 'state'],
            display: 'popup',
            type: '2.0',
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            popupOptions: {
              width: 452,
              height: 633
            }
          },
          facebook: {
            name: 'facebook',
            url: '/auth/facebook',
            authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
            redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
            scope: ['email'],
            scopeDelimiter: ',',
            nonce: function nonce() {
              return Math.random();
            },
            requiredUrlParams: ['nonce', 'display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 580,
              height: 400
            }
          },
          linkedin: {
            name: 'linkedin',
            url: '/auth/linkedin',
            authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['state'],
            scope: ['r_emailaddress'],
            scopeDelimiter: ' ',
            state: 'STATE',
            type: '2.0',
            popupOptions: {
              width: 527,
              height: 582
            }
          },
          github: {
            name: 'github',
            url: '/auth/github',
            authorizationEndpoint: 'https://github.com/login/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            optionalUrlParams: ['scope'],
            scope: ['user:email'],
            scopeDelimiter: ' ',
            type: '2.0',
            popupOptions: {
              width: 1020,
              height: 618
            }
          },
          yahoo: {
            name: 'yahoo',
            url: '/auth/yahoo',
            authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: [],
            scopeDelimiter: ',',
            type: '2.0',
            popupOptions: {
              width: 559,
              height: 519
            }
          },
          twitter: {
            name: 'twitter',
            url: '/auth/twitter',
            authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
            type: '1.0',
            popupOptions: {
              width: 495,
              height: 645
            }
          },
          live: {
            name: 'live',
            url: '/auth/live',
            authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['wl.emails'],
            scopeDelimiter: ' ',
            requiredUrlParams: ['display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 500,
              height: 560
            }
          },
          instagram: {
            name: 'instagram',
            url: '/auth/instagram',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['scope'],
            scope: ['basic'],
            scopeDelimiter: '+',
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 550,
              height: 369
            }
          }
        }
      };
    }

    return BaseConfig;
  }();
});
define('aurelia-auth/auth-utilities',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.status = status;
  exports.isDefined = isDefined;
  exports.camelCase = camelCase;
  exports.parseQueryString = parseQueryString;
  exports.isString = isString;
  exports.isObject = isObject;
  exports.isFunction = isFunction;
  exports.joinUrl = joinUrl;
  exports.isBlankObject = isBlankObject;
  exports.isArrayLike = isArrayLike;
  exports.isWindow = isWindow;
  exports.extend = extend;
  exports.merge = merge;
  exports.forEach = forEach;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var slice = [].slice;

  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }

  function baseExtend(dst, objs, deep) {
    var h = dst.$$hashKey;

    for (var i = 0, ii = objs.length; i < ii; ++i) {
      var obj = objs[i];
      if (!isObject(obj) && !isFunction(obj)) continue;
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        var src = obj[key];

        if (deep && isObject(src)) {
          if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
          baseExtend(dst[key], [src], true);
        } else {
          dst[key] = src;
        }
      }
    }

    setHashKey(dst, h);
    return dst;
  }

  function status(response) {
    if (response.status >= 200 && response.status < 400) {
      return response.json().catch(function (error) {
        return null;
      });
    }

    throw response;
  }

  function isDefined(value) {
    return typeof value !== 'undefined';
  }

  function camelCase(name) {
    return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }

  function parseQueryString(keyValue) {
    var key = void 0;
    var value = void 0;
    var obj = {};

    forEach((keyValue || '').split('&'), function (kv) {
      if (kv) {
        value = kv.split('=');
        key = decodeURIComponent(value[0]);
        obj[key] = isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
      }
    });

    return obj;
  }

  function isString(value) {
    return typeof value === 'string';
  }

  function isObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function joinUrl(baseUrl, url) {
    if (/^(?:[a-z]+:)?\/\//i.test(url)) {
      return url;
    }

    var joined = [baseUrl, url].join('/');
    var normalize = function normalize(str) {
      return str.replace(/[\/]+/g, '/').replace(/\/\?/g, '?').replace(/\/\#/g, '#').replace(/\:\//g, '://');
    };

    return normalize(joined);
  }

  function isBlankObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Object.getPrototypeOf(value);
  }

  function isArrayLike(obj) {
    if (obj === null || isWindow(obj)) {
      return false;
    }
  }

  function isWindow(obj) {
    return obj && obj.window === obj;
  }

  function extend(dst) {
    return baseExtend(dst, slice.call(arguments, 1), false);
  }

  function merge(dst) {
    return baseExtend(dst, slice.call(arguments, 1), true);
  }

  function forEach(obj, iterator, context) {
    var key = void 0;
    var length = void 0;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key !== 'prototype' && key !== 'length' && key !== 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (Array.isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object';
        for (key = 0, length = obj.length; key < length; key++) {
          if (isPrimitive || key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        for (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      } else if (typeof obj.hasOwnProperty === 'function') {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else {
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      }
    }
    return obj;
  }
});
define('aurelia-auth/storage',['exports', 'aurelia-dependency-injection', './base-config'], function (exports, _aureliaDependencyInjection, _baseConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Storage = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Storage = exports.Storage = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Storage(config) {
      _classCallCheck(this, Storage);

      this.config = config.current;
      this.storage = this._getStorage(this.config.storage);
    }

    Storage.prototype.get = function get(key) {
      return this.storage.getItem(key);
    };

    Storage.prototype.set = function set(key, value) {
      return this.storage.setItem(key, value);
    };

    Storage.prototype.remove = function remove(key) {
      return this.storage.removeItem(key);
    };

    Storage.prototype._getStorage = function _getStorage(type) {
      if (type === 'localStorage') {
        if ('localStorage' in window && window.localStorage !== null) return localStorage;
        throw new Error('Local Storage is disabled or unavailable.');
      } else if (type === 'sessionStorage') {
        if ('sessionStorage' in window && window.sessionStorage !== null) return sessionStorage;
        throw new Error('Session Storage is disabled or unavailable.');
      }

      throw new Error('Invalid storage type specified: ' + type);
    };

    return Storage;
  }()) || _class);
});
define('aurelia-auth/oAuth1',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth1 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth1 = exports.OAuth1 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig), _dec(_class = function () {
    function OAuth1(storage, popup, http, config) {
      _classCallCheck(this, OAuth1);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.defaults = {
        url: null,
        name: null,
        popupOptions: null,
        redirectUri: null,
        authorizationEndpoint: null
      };
    }

    OAuth1.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);
      var serverUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;

      if (this.config.platform !== 'mobile') {
        this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
      }
      return this.http.fetch(serverUrl, {
        method: 'post'
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.platform === 'mobile') {
          _this.popup = _this.popup.open([current.authorizationEndpoint, _this.buildQueryString(response)].join('?'), current.name, current.popupOptions, current.redirectUri);
        } else {
          _this.popup.popupWindow.location = [current.authorizationEndpoint, _this.buildQueryString(response)].join('?');
        }

        var popupListener = _this.config.platform === 'mobile' ? _this.popup.eventListener(current.redirectUri) : _this.popup.pollPopup();
        return popupListener.then(function (result) {
          return _this.exchangeForToken(result, userData, current);
        });
      });
    };

    OAuth1.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, oauthData);
      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth1.prototype.buildQueryString = function buildQueryString(obj) {
      var str = [];
      (0, _authUtilities.forEach)(obj, function (value, key) {
        return str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      });
      return str.join('&');
    };

    return OAuth1;
  }()) || _class);
});
define('aurelia-auth/popup',['exports', './auth-utilities', './base-config', 'aurelia-dependency-injection'], function (exports, _authUtilities, _baseConfig, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Popup = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Popup = exports.Popup = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Popup(config) {
      _classCallCheck(this, Popup);

      this.config = config.current;
      this.popupWindow = null;
      this.polling = null;
      this.url = '';
    }

    Popup.prototype.open = function open(url, windowName, options, redirectUri) {
      this.url = url;
      var optionsString = this.stringifyOptions(this.prepareOptions(options || {}));
      this.popupWindow = window.open(url, windowName, optionsString);
      if (this.popupWindow && this.popupWindow.focus) {
        this.popupWindow.focus();
      }

      return this;
    };

    Popup.prototype.eventListener = function eventListener(redirectUri) {
      var self = this;
      var promise = new Promise(function (resolve, reject) {
        self.popupWindow.addEventListener('loadstart', function (event) {
          if (event.url.indexOf(redirectUri) !== 0) {
            return;
          }

          var parser = document.createElement('a');
          parser.href = event.url;

          if (parser.search || parser.hash) {
            var queryParams = parser.search.substring(1).replace(/\/$/, '');
            var hashParams = parser.hash.substring(1).replace(/\/$/, '');
            var hash = (0, _authUtilities.parseQueryString)(hashParams);
            var qs = (0, _authUtilities.parseQueryString)(queryParams);

            (0, _authUtilities.extend)(qs, hash);

            if (qs.error) {
              reject({
                error: qs.error
              });
            } else {
              resolve(qs);
            }

            self.popupWindow.close();
          }
        });

        popupWindow.addEventListener('exit', function () {
          reject({
            data: 'Provider Popup was closed'
          });
        });

        popupWindow.addEventListener('loaderror', function () {
          deferred.reject({
            data: 'Authorization Failed'
          });
        });
      });
      return promise;
    };

    Popup.prototype.pollPopup = function pollPopup() {
      var _this = this;

      var self = this;
      var promise = new Promise(function (resolve, reject) {
        _this.polling = setInterval(function () {
          try {
            var documentOrigin = document.location.host;
            var popupWindowOrigin = self.popupWindow.location.host;

            if (popupWindowOrigin === documentOrigin && (self.popupWindow.location.search || self.popupWindow.location.hash)) {
              var queryParams = self.popupWindow.location.search.substring(1).replace(/\/$/, '');
              var hashParams = self.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
              var hash = (0, _authUtilities.parseQueryString)(hashParams);
              var qs = (0, _authUtilities.parseQueryString)(queryParams);

              (0, _authUtilities.extend)(qs, hash);

              if (qs.error) {
                reject({
                  error: qs.error
                });
              } else {
                resolve(qs);
              }

              self.popupWindow.close();
              clearInterval(self.polling);
            }
          } catch (error) {}

          if (!self.popupWindow) {
            clearInterval(self.polling);
            reject({
              data: 'Provider Popup Blocked'
            });
          } else if (self.popupWindow.closed) {
            clearInterval(self.polling);
            reject({
              data: 'Problem poll popup'
            });
          }
        }, 35);
      });
      return promise;
    };

    Popup.prototype.prepareOptions = function prepareOptions(options) {
      var width = options.width || 500;
      var height = options.height || 500;
      return (0, _authUtilities.extend)({
        width: width,
        height: height,
        left: window.screenX + (window.outerWidth - width) / 2,
        top: window.screenY + (window.outerHeight - height) / 2.5
      }, options);
    };

    Popup.prototype.stringifyOptions = function stringifyOptions(options) {
      var parts = [];
      (0, _authUtilities.forEach)(options, function (value, key) {
        parts.push(key + '=' + value);
      });
      return parts.join(',');
    };

    return Popup;
  }()) || _class);
});
define('aurelia-auth/oAuth2',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', './authentication', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _authentication, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth2 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth2 = exports.OAuth2 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig, _authentication.Authentication), _dec(_class = function () {
    function OAuth2(storage, popup, http, config, auth) {
      _classCallCheck(this, OAuth2);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.auth = auth;
      this.defaults = {
        url: null,
        name: null,
        state: null,
        scope: null,
        scopeDelimiter: null,
        redirectUri: null,
        popupOptions: null,
        authorizationEndpoint: null,
        responseParams: null,
        requiredUrlParams: null,
        optionalUrlParams: null,
        defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
        responseType: 'code'
      };
    }

    OAuth2.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);

      var stateName = current.name + '_state';

      if ((0, _authUtilities.isFunction)(current.state)) {
        this.storage.set(stateName, current.state());
      } else if ((0, _authUtilities.isString)(current.state)) {
        this.storage.set(stateName, current.state);
      }

      var nonceName = current.name + '_nonce';

      if ((0, _authUtilities.isFunction)(current.nonce)) {
        this.storage.set(nonceName, current.nonce());
      } else if ((0, _authUtilities.isString)(current.nonce)) {
        this.storage.set(nonceName, current.nonce);
      }

      var url = current.authorizationEndpoint + '?' + this.buildQueryString(current);

      var openPopup = void 0;
      if (this.config.platform === 'mobile') {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).eventListener(current.redirectUri);
      } else {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).pollPopup();
      }

      return openPopup.then(function (oauthData) {
        if (oauthData.state && oauthData.state !== _this.storage.get(stateName)) {
          return Promise.reject('OAuth 2.0 state parameter mismatch.');
        }

        if (current.responseType.toUpperCase().includes('TOKEN')) {
          if (!_this.verifyIdToken(oauthData, current.name)) {
            return Promise.reject('OAuth 2.0 Nonce parameter mismatch.');
          }

          return oauthData;
        }

        return _this.exchangeForToken(oauthData, userData, current);
      });
    };

    OAuth2.prototype.verifyIdToken = function verifyIdToken(oauthData, providerName) {
      var idToken = oauthData && oauthData[this.config.responseIdTokenProp];
      if (!idToken) return true;
      var idTokenObject = this.auth.decomposeToken(idToken);
      if (!idTokenObject) return true;
      var nonceFromToken = idTokenObject.nonce;
      if (!nonceFromToken) return true;
      var nonceInStorage = this.storage.get(providerName + '_nonce');
      if (nonceFromToken !== nonceInStorage) {
        return false;
      }
      return true;
    };

    OAuth2.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, {
        code: oauthData.code,
        clientId: current.clientId,
        redirectUri: current.redirectUri
      });

      if (oauthData.state) {
        data.state = oauthData.state;
      }

      (0, _authUtilities.forEach)(current.responseParams, function (param) {
        return data[param] = oauthData[param];
      });

      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth2.prototype.buildQueryString = function buildQueryString(current) {
      var _this2 = this;

      var keyValuePairs = [];
      var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

      (0, _authUtilities.forEach)(urlParams, function (params) {
        (0, _authUtilities.forEach)(current[params], function (paramName) {
          var camelizedName = (0, _authUtilities.camelCase)(paramName);
          var paramValue = (0, _authUtilities.isFunction)(current[paramName]) ? current[paramName]() : current[camelizedName];

          if (paramName === 'state') {
            var stateName = current.name + '_state';
            paramValue = encodeURIComponent(_this2.storage.get(stateName));
          }

          if (paramName === 'nonce') {
            var nonceName = current.name + '_nonce';
            paramValue = encodeURIComponent(_this2.storage.get(nonceName));
          }

          if (paramName === 'scope' && Array.isArray(paramValue)) {
            paramValue = paramValue.join(current.scopeDelimiter);

            if (current.scopePrefix) {
              paramValue = [current.scopePrefix, paramValue].join(current.scopeDelimiter);
            }
          }

          keyValuePairs.push([paramName, paramValue]);
        });
      });

      return keyValuePairs.map(function (pair) {
        return pair.join('=');
      }).join('&');
    };

    return OAuth2;
  }()) || _class);
});
define('aurelia-auth/authorize-step',['exports', 'aurelia-dependency-injection', 'aurelia-router', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaRouter, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthorizeStep = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthorizeStep = exports.AuthorizeStep = (_dec = (0, _aureliaDependencyInjection.inject)(_authentication.Authentication), _dec(_class = function () {
    function AuthorizeStep(auth) {
      _classCallCheck(this, AuthorizeStep);

      this.auth = auth;
    }

    AuthorizeStep.prototype.run = function run(routingContext, next) {
      var isLoggedIn = this.auth.isAuthenticated();
      var loginRoute = this.auth.getLoginRoute();

      if (routingContext.getAllInstructions().some(function (i) {
        return i.config.auth;
      })) {
        if (!isLoggedIn) {
          this.auth.setInitialUrl(window.location.href);
          return next.cancel(new _aureliaRouter.Redirect(loginRoute));
        }
      } else if (isLoggedIn && routingContext.getAllInstructions().some(function (i) {
        return i.fragment === loginRoute;
      })) {
        var loginRedirect = this.auth.getLoginRedirect();
        return next.cancel(new _aureliaRouter.Redirect(loginRedirect));
      }

      return next();
    };

    return AuthorizeStep;
  }()) || _class);
});
define('aurelia-auth/auth-fetch-config',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FetchConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var FetchConfig = exports.FetchConfig = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication), _dec(_class = function () {
    function FetchConfig(httpClient, authService) {
      _classCallCheck(this, FetchConfig);

      this.httpClient = httpClient;
      this.auth = authService;
    }

    FetchConfig.prototype.configure = function configure() {
      var _this = this;

      this.httpClient.configure(function (httpConfig) {
        httpConfig.withDefaults({
          headers: {
            'Accept': 'application/json'
          }
        }).withInterceptor(_this.auth.tokenInterceptor);
      });
    };

    return FetchConfig;
  }()) || _class);
});
define('aurelia-auth/auth-filter',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AuthFilterValueConverter = exports.AuthFilterValueConverter = function () {
    function AuthFilterValueConverter() {
      _classCallCheck(this, AuthFilterValueConverter);
    }

    AuthFilterValueConverter.prototype.toView = function toView(routes, isAuthenticated) {
      return routes.filter(function (r) {
        return r.config.auth === undefined || r.config.auth === isAuthenticated;
      });
    };

    return AuthFilterValueConverter;
  }();
});
define('auth',['exports', 'aurelia-framework', 'aurelia-http-client', './environment'], function (exports, _aureliaFramework, _aureliaHttpClient, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Auth = undefined;

    var _environment2 = _interopRequireDefault(_environment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Auth = exports.Auth = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = function () {
        function Auth(httpClient) {
            _classCallCheck(this, Auth);

            this.isLogged = false;
            this.user = {};
            this.token = "";
            this.http = httpClient;
        }

        Auth.prototype.login = function login(email, password) {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.http.post(_environment2.default.api + "/api/auth", { email: email, password: password }).then(function (response) {
                    console.log(response.content.token);
                    resolve(response.content);
                }).catch(function (error) {
                    reject(error.content);
                });
            });
        };

        Auth.prototype.logout = function logout() {};

        return Auth;
    }()) || _class);
});
define('models/auth',['exports', 'aurelia-framework', 'aurelia-http-client', '../environment'], function (exports, _aureliaFramework, _aureliaHttpClient, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Auth = undefined;

    var _environment2 = _interopRequireDefault(_environment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Auth = exports.Auth = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = function () {
        function Auth(httpClient) {
            _classCallCheck(this, Auth);

            this.isLogged = false;
            this.user = {};

            this.http = httpClient;

            if (localStorage.getItem('zenBanAuthToken')) {
                this.getUser();
            }
        }

        Auth.prototype.login = function login(email, password) {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.http.post(_environment2.default.api + "/api/auth", { email: email, password: password }).then(function (response) {
                    self.token = response.content.token;
                    localStorage.setItem('zenBanAuthToken', self.token);
                    console.log(response);
                    self.getUser();
                    resolve();
                }).catch(function (error) {
                    console.log(error);
                    reject(error.content);
                });
            });
        };

        Auth.prototype.getUser = function getUser() {
            var _this = this;

            this.http.configure(function (x) {
                x.withHeader('Authorization', localStorage.getItem('zenBanAuthToken'));
            });

            this.http.get(_environment2.default.api + "/api/user").then(function (response) {
                console.log(response);
                _this.user = response.content;
                _this.token = localStorage.getItem('zenBanAuthToken');
                _this.isLogged = true;
            }).catch(function (error) {
                console.log(error);
                _this.token = '';
                _this.isLogged = false;
                _this.user = {};
                localStorage.removeItem('zenBanAuthToken');
            });
        };

        Auth.prototype.logout = function logout() {
            this.token = '';
            this.isLogged = false;
            this.user = {};
            localStorage.removeItem('zenBanAuthToken');
        };

        return Auth;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"font-awesome/css/font-awesome.css\"></require>\n\n  <nav class=\"navbar navbar-default navbar-fixed-top\">\n    <div class=\"container\" if.bind=\"isLogged\">\n      <ul class=\"nav navbar-nav\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li><a href=\"#\">New request</a></li>\n        <li><a href=\"#\">Requests</a></li>\n        <li><a href=\"#\">Tasks</a></li>\n        <li><a href=\"#\">Archive</a></li>\n      </ul>\n      <p class=\"navbar-text navbar-right\">Signed in as ${user.name}, <a href=\"/#/logout\" class=\"navbar-link\">Logout</a></p>\n    </div>\n    <div class=\"container\" if.bind=\"!isLogged\">\n      <ul class=\"nav navbar-nav\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li><a href=\"/#/login\">Login</a></li>\n        <li><a href=\"/#/signup\">Signup</a></li>\n      </ul>\n    </div>\n  </nav>\n\n  <div class=\"container\" style=\"margin-top: 60px;\">\n    <router-view></router-view>\n  </div>\n\n</template>\n"; });
define('text!controllers/autocomplete.css', ['module'], function(module) { module.exports = ".autocomplete-suggestion {\n    position: absolute;\n    top: 35px;\n    left: 2px;\n    height: 300px;\n    z-index: 999;\n    overflow-y:auto;\n    cursor: pointer;\n}\n\n.autocomplete-container {\n    position: relative;\n}"; });
define('text!controllers/addItem.html', ['module'], function(module) { module.exports = "<template>\n\n    <div class=\"container\">\n\n        <div class=\"panel panel-default\">\n            <div class=\"panel-body\">\n                <require from=\"./autocomplete\"></require>\n                <form>\n                    <div class=\"col-md-8\" >\n                        <div class=\"form-group\">\n                            <input type=\"text\" class=\"form-control\" placeholder=\"Title\" value.bind=\"item.title\" focus.bind=\"isTitleFocus\">\n                        </div>\n                        <div class=\"form-group\">\n                            <textarea class=\"form-control\" rows=\"7\" value.bind=\"item.description\"></textarea>\n                        </div>\n                        <div class=\"form-group\" show.bind=\"hasFeature\">\n                            <autocomplete value.two-way=\"item.featureTitle\"\n                                          placeholder=\"Choose feature\"\n                                          min-term-length=3\n                                          loader.bind=\"data\"\n                                          value-id.two-way=\"item.feature\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.requirementTitle\"\n                                          placeholder=\"Choose functional requirement\"\n                                          min-term-length=3\n                                          loader.bind=\"rdata\"\n                                          value-id.two-way=\"item.requirement\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <button type=\"button\" class=\"btn btn-default\" onclick=\"document.location.href='#/';\">Cancel</button>\n                            <button type=\"button\" class=\"btn btn-primary\" disabled.bind=\"!canSave\" click.trigger=\"save()\" id=\"saveButton\">Save</button>\n                        </div>\n                    </div>\n                    <div class=\"col-md-4\">\n                        <div class=\"form-group\">\n                            <div class=\"btn-group\" role=\"group\">\n                                <button type=\"button\" class = \"btn btn-default ${item.type=='feature' ? 'active' : ''}\"  click.trigger=\"switchType('feature')\">Feature</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.type=='task' ? 'active' : ''}\"  click.trigger=\"switchType('task')\">Task</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.type=='bug' ? 'active' : ''}\"  click.trigger=\"switchType('bug')\">Bug</button>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.authorTitle\"\n                                          placeholder=\"Choose author\"\n                                          min-term-length=2\n                                          loader.bind=\"udata\"\n                                          value-id.two-way=\"item.author\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.assigneeTitle\"\n                                          placeholder=\"Choose assignee\"\n                                          min-term-length=2\n                                          loader.bind=\"udata\"\n                                          value-id.two-way=\"item.assignee\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\"  show.bind=\"hasEstimate\">\n                            <div class=\"btn-group\" role=\"group\" >\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==0 ? 'active' : ''}\" click.trigger=\"switchEstimate(0)\">?</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==2 ? 'active' : ''}\" click.trigger=\"switchEstimate(2)\">S</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==5 ? 'active' : ''}\" click.trigger=\"switchEstimate(5)\">M</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==13 ? 'active' : ''}\" click.trigger=\"switchEstimate(13)\">XL</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==21 ? 'active' : ''}\" click.trigger=\"switchEstimate(21)\">XXL</button>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <button type=\"button\" class=\"btn btn-danger ${item.isProblem ? 'active' : ''}\" click.trigger=\"switchProblem()\">Report a problem</button>\n                        </div>\n                        <div class=\"form-group\">\n                            <textarea class=\"form-control\" rows=\"3\" show.bind=\"item.isProblem\" value.bind=\"item.problemDescription\" focus.bind=\"isProblemFocus\"></textarea>\n                        </div>\n                    </div>\n\n                </form>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!controllers/archive.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container\">\n        <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">Archive</div>\n            <div class=\"panel-body\">\n                <table class=\"table\">\n                    <thead>\n                    <tr>\n                        <th>Closed</th>\n                        <th>Title</th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr repeat.for=\"i of items\" current.bind=\"i\">\n                        <td>${i.updatedTitle}</td>\n                        <td width=\"80%\"><a href=\"#/item/${i._id}\">${i.title}</a></td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n</template>\n"; });
define('text!controllers/autocomplete.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./autocomplete.css\"></require>\n    <div class=\"autocomplete-container\">\n        <input class=\"form-control\"\n               autocomplete=\"off\"\n               value.bind=\"value\"\n               keyup.delegate=\"inputKeyPressed($event)\"\n               placeholder.bind=\"placeholder\"\n               blur.trigger=\"hideSuggestions()\"\n               focus.bind=\"hasFocus\">\n        <div class=\"autocomplete-suggestion\" show.bind=\"isShown\">\n            <div class=\"list-group\">\n                <a data-id=\"${item._id}\"\n                   data-value=\"${item.title}\"\n                   class=\"list-group-item\"\n                   repeat.for=\"item of items\"\n                   mousedown.delegate=\"itemSelected($event)\"><span>${item.title}</span>\n                </a>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!controllers/editItem.html', ['module'], function(module) { module.exports = "<template>\n\n    <div class=\"container\">\n\n        <div class=\"panel panel-default\">\n            <div class=\"panel-body\">\n                <require from=\"./autocomplete\"></require>\n                <form>\n                    <div class=\"col-md-8\" >\n                        <div class=\"form-group\">\n                            <input type=\"text\" class=\"form-control\" placeholder=\"Title\" value.bind=\"item.title\" focus.bind=\"isTitleFocus\">\n                        </div>\n                        <div class=\"form-group\">\n                            <textarea class=\"form-control\" rows=\"7\" value.bind=\"item.description\"></textarea>\n                        </div>\n                        <div class=\"form-group\" show.bind=\"hasFeature\">\n                            <autocomplete value.two-way=\"item.featureTitle\"\n                                          placeholder=\"Choose feature\"\n                                          min-term-length=3\n                                          loader.bind=\"data\"\n                                          value-id.two-way=\"item.feature.id\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.requirementTitle\"\n                                          placeholder=\"Choose functional requirement\"\n                                          min-term-length=3\n                                          loader.bind=\"rdata\"\n                                          value-id.two-way=\"item.requirement.id\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <button type=\"button\" class=\"btn btn-default\" onclick=\"document.location.href='#/';\">Cancel</button>\n                            <button type=\"button\" class=\"btn btn-primary\" disabled.bind=\"!canSave\" click.trigger=\"save()\">Save</button>\n                            <button type=\"button\" class=\"btn btn-warning\" show.bind=\"isClosed\" click.trigger=\"restore()\">Restore in backlog</button>\n                        </div>\n                    </div>\n                    <div class=\"col-md-4\">\n                        <div class=\"form-group\">\n                            <div class=\"btn-group\" role=\"group\">\n                                <button type=\"button\" class = \"btn btn-default ${item.type=='feature' ? 'active' : ''}\"  click.trigger=\"switchType('feature')\">Feature</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.type=='task' ? 'active' : ''}\"  click.trigger=\"switchType('task')\">Task</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.type=='bug' ? 'active' : ''}\"  click.trigger=\"switchType('bug')\">Bug</button>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.authorTitle\"\n                                          placeholder=\"Choose author\"\n                                          min-term-length=2\n                                          loader.bind=\"udata\"\n                                          value-id.two-way=\"item.author.id\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.assigneeTitle\"\n                                          placeholder=\"Choose assignee\"\n                                          min-term-length=2\n                                          loader.bind=\"udata\"\n                                          value-id.two-way=\"item.assignee.id\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\"  show.bind=\"hasEstimate\">\n                            <div class=\"btn-group\" role=\"group\" >\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==0 ? 'active' : ''}\" click.trigger=\"switchEstimate(0)\">?</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==2 ? 'active' : ''}\" click.trigger=\"switchEstimate(2)\">S</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==5 ? 'active' : ''}\" click.trigger=\"switchEstimate(5)\">M</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==13 ? 'active' : ''}\" click.trigger=\"switchEstimate(13)\">XL</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==21 ? 'active' : ''}\" click.trigger=\"switchEstimate(21)\">XXL</button>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <button type=\"button\" class=\"btn btn-danger ${item.isProblem ? 'active' : ''}\" click.trigger=\"switchProblem()\">Report a problem</button>\n                        </div>\n                        <div class=\"form-group\">\n                            <textarea class=\"form-control\" rows=\"3\" show.bind=\"item.isProblem\" value.bind=\"item.problemDescription\" focus.bind=\"isProblemFocus\"></textarea>\n                        </div>\n                    </div>\n\n                </form>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!controllers/login.html', ['module'], function(module) { module.exports = "<template>\n    <section>\n        <h2>${heading}</h2>\n\n        <form role=\"form\" submit.delegate=\"login()\">\n            <div class=\"form-group\">\n                <label for=\"email\">Email</label>\n                <input type=\"text\" value.bind=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Email\">\n            </div>\n            <div class=\"form-group\">\n                <label for=\"password\">Password</label>\n                <input type=\"password\" value.bind=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\">\n            </div>\n            <button type=\"submit\" class=\"btn btn-default\">Login</button>\n        </form>\n\n        <hr>\n        <div class=\"alert alert-danger\" if.bind=\"loginError\">${loginError}</div>\n    </section>\n</template>"; });
define('text!controllers/logout.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!controllers/node.html', ['module'], function(module) { module.exports = "<template>\n    <ul class=\"tree\">\n        <li><a href=\"#\" click.trigger=\"sendEdit(current._id)\">${current.title} [${current.requirementCode}]</a></li>\n        <li if.bind=\"current.children.length > 0\">\n            <node repeat.for=\"r of current.children\" current.bind=\"r\" edit.call=\"sendEdit(id)\"></node>\n        </li>\n    </ul>\n</template>"; });
define('text!controllers/pipelines.html', ['module'], function(module) { module.exports = "<template>\n  <nav class=\"navbar navbar-default\">\n    <div class=\"container-fluid\">\n      <div class=\"navbar-header\" style=\"width:100%;\">\n        <form class=\"navbar-form navbar-left\" if.bind=\"isPipelineOptions\">\n          <div class=\"form-group\">\n            <input type=\"text\" class=\"form-control\" placeholder=\"By text\">\n          </div>\n          <div class=\"form-group\">\n            <input class=\"form-control\" placeholder=\"Functional requrment\" autocomplete=\"off\">\n            <input class=\"form-control\" placeholder=\"Feature\" autocomplete=\"off\">\n            <input class=\"form-control\" placeholder=\"Assignee\" autocomplete=\"off\">\n            <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n              <button type=\"button\" class=\"btn btn-default ${filter.isFeatures ? 'active' : ''}\" click.trigger=\"switchFeatures()\">Features</button>\n              <button type=\"button\" class=\"btn btn-default ${filter.isTasks ? 'active' : ''}\" click.trigger=\"switchTasks()\">Tasks</button>\n              <button type=\"button\" class=\"btn btn-default ${filter.isBugs ? 'active' : ''}\" click.trigger=\"switchBugs()\">Bugs</button>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n  </nav>\n\n  <main class=\"pipelines\">\n    <div class=\"pipeline\" repeat.for=\"status of statuses\">\n      <div class=\"pipeline-header\">${status} <span class=\"badge\">${_items.totals[status]}</span>\n      </div>\n      <ul class=\"items\" data-status=\"${status}\">\n        <li class=\"ui-state-default item item-${i.type}\" repeat.for=\"i of _items[status]\" current.bind=\"i\" data-id=\"${i._id}\" id=\"${i._id}\">\n          <span class=\"badge badge-task\" style=\"margin-right:6px;\" if.bind=\"i.type != 'feature'\" >${i.estimate}</span>\n          ${i.title}\n          <a href=\"#/item/${i._id}\">edit</a>\n        </li>\n      </ul>\n    </div>\n  </main>\n</template>\n"; });
define('text!controllers/requirements.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container\">\n        <div class=\"panel panel-default\">\n            <div class=\"panel-body\">\n                <div class=\"col-md-4\">\n                    <div show.bind=\"isForm\">\n                        <form role=\"form\" submit.delegate=\"save()\">\n                        <div class=\"form-group\">\n                            <input type=\"text\" class=\"form-control\" placeholder=\"Title\" value.bind=\"requirement.title\">\n                        </div>\n                        <div class=\"form-group\" align=\"right\">\n                            <button type=\"button\" class=\"btn btn-warning\" show.bind=\"requirement._id\" click.trigger=\"create(requirement._id)\">Add child</button>\n                            <button type=\"button\" class=\"btn btn-default\" click.trigger=\"hide()\">Cancel</button>\n                            <button type=\"button\" class=\"btn btn-danger\" show.bind=\"requirement._id\" click.trigger=\"remove(requirement._id)\">Remove</button>\n                            <button type=\"button\" class=\"btn btn-primary\" disabled.bind=\"!canSave\" click.trigger=\"save()\">Save</button>\n                        </div>\n                        </form>\n                    </div>\n\n\n\n                    <!--\n                    <div class=\"form-group\">\n                        <input type=\"text\" class=\"form-control\" placeholder=\"Title\" value.bind=\"functions.title\">\n                    </div>\n                    <div class=\"form-group\" align=\"right\">\n                        <button type=\"button\" class=\"btn btn-warning\">Add child</button>\n                        <button type=\"button\" class=\"btn btn-default\">Cancel</button>\n                        <button type=\"button\" class=\"btn btn-primary\">Save</button>\n                    </div>\n                    <div style=\"padding: 10px;\">\n                        <span class=\"label label-danger\">Bugs</span>\n                    </div>\n                    <div style=\"padding: 10px;\">\n                        <a href=\"#\">Create super design</a>\n                    </div>\n                    <div style=\"padding: 10px;\">\n                        <span class=\"label label-success\">Features</span>\n                    </div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design. Create super design. Create super design. Create super design. Create super design. </a></div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design</a></div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design</a></div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design</a></div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design</a></div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design</a></div>\n                    -->\n                </div>\n                <div class=\"col-md-8\" >\n                    <button type=\"button\" class=\"btn btn-primary\"\n                            show.bind=\"requirements.length < 1\"\n                            click.trigger=\"create(null)\"\n                    >Create</button>\n                    <div if.bind=\"requirements.length > 0\">\n                        <require from='./node'></require>\n                        <node repeat.for=\"r of requirements\" current.bind=\"r\" edit.call=\"edit(id)\"></node>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!controllers/signup.html', ['module'], function(module) { module.exports = "<template>\n    <form role=\"form\" submit.delegate=\"signup()\">\n        <div class=\"form-group\">\n            <label for=\"email\">Name</label>\n            <input type=\"text\" value.bind=\"name\" class=\"form-control\" id=\"name\" placeholder=\"Name\">\n        </div>\n        <div class=\"form-group\">\n            <label for=\"email\">Email</label>\n            <input type=\"text\" value.bind=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Email\">\n        </div>\n        <div class=\"form-group\">\n            <label for=\"password\">Password</label>\n            <input type=\"password\" value.bind=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\">\n        </div>\n        <button type=\"submit\" class=\"btn btn-default\">Signup</button>\n    </form>\n    <hr>\n    <div class=\"alert alert-danger\" if.bind=\"signupError\">${signupError}</div>\n</template>"; });
define('text!controllers/users.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container\">\n        <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">Users</div>\n            <div class=\"panel-body\">\n                <div class=\"col-md-5\">\n                    <div show.bind=\"isForm\">\n                        <form role=\"form\" submit.delegate=\"save()\">\n                            <div class=\"form-group\">\n                                <label for=\"inputEmail\">Email address</label>\n                                <input id=\"inputEmail\" type=\"text\" class=\"form-control\" placeholder=\"Email\" value.bind=\"user.email\">\n                            </div>\n                            <div class=\"form-group\">\n                                <label for=\"inputPass\">Password</label>\n                                <input id=\"inputPass\" type=\"password\" class=\"form-control\" placeholder=\"Password\" value.bind=\"user.password\">\n                            </div>\n                            <div class=\"form-group\" align=\"right\">\n                                <button type=\"button\" class=\"btn btn-default\" click.trigger=\"hide()\">Cancel</button>\n                                <button type=\"button\" class=\"btn btn-primary\" disabled.bind=\"!canSave\" click.trigger=\"save()\">Save</button>\n                            </div>\n                        </form>\n                    </div>\n                </div>\n                <div class=\"col-md-7\">\n                    <button type=\"button\" class=\"btn btn-primary\" click.trigger=\"create()\" style=\"margin-bottom: 10px;\">Create</button>\n                    <div class=\"list-group\" >\n                        <a href=\"#\" class=\"list-group-item\" repeat.for=\"u of users\" current.bind=\"u\" click.trigger=\"edit(u._id)\">${u.email}</a>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!controllers/welcome.html', ['module'], function(module) { module.exports = "<template>\n    <section class=\"au-animate\">\n        <h2>${heading}</h2>\n\n        <div class=\"well\">\n            <h4>${info}</h4>\n        </div>\n\n    </section>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map