define('app',['exports', 'aurelia-event-aggregator', 'aurelia-dependency-injection'], function (exports, _aureliaEventAggregator, _aureliaDependencyInjection) {
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

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function App(eventAggregator) {
      _classCallCheck(this, App);

      this.eventAggregator = eventAggregator;
      this.currentRoute = "/";
      this.isPipelineOptions = true;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      this.router = router;

      config.map([{ route: "", moduleId: "controllers/pipelines", nav: true }, { route: "item", moduleId: "controllers/addItem", nav: true }, { route: "item/:id", moduleId: "controllers/editItem" }, { route: "users", moduleId: "controllers/users" }, { route: "requirements", moduleId: "controllers/requirements", nav: true }, { route: "archive", moduleId: "controllers/archive", nav: true }]);
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

    return App;
  }()) || _class);
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
    var baseUrl = _environment2.default.api + "/api/users";

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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"font-awesome/css/font-awesome.css\"></require>\n  <div class=\"container-fluid\" align=\"center\" style=\"padding: 3px;\">\n    <a href=\"#/\">board</a> | <a href=\"#/requirements\">requirements</a>\n    | <a href=\"#/item\">create</a>\n    | <a href=\"#/users\">users</a>\n    | <a href=\"#/archive\">archive</a>\n  </div>\n\n  <router-view></router-view>\n</template>\n"; });
define('text!controllers/autocomplete.css', ['module'], function(module) { module.exports = ".autocomplete-suggestion {\n    position: absolute;\n    top: 35px;\n    left: 2px;\n    height: 300px;\n    z-index: 999;\n    overflow-y:auto;\n    cursor: pointer;\n}\n\n.autocomplete-container {\n    position: relative;\n}"; });
define('text!controllers/addItem.html', ['module'], function(module) { module.exports = "<template>\n\n    <div class=\"container\">\n\n        <div class=\"panel panel-default\">\n            <div class=\"panel-body\">\n                <require from=\"./autocomplete\"></require>\n                <form>\n                    <div class=\"col-md-8\" >\n                        <div class=\"form-group\">\n                            <input type=\"text\" class=\"form-control\" placeholder=\"Title\" value.bind=\"item.title\" focus.bind=\"isTitleFocus\">\n                        </div>\n                        <div class=\"form-group\">\n                            <textarea class=\"form-control\" rows=\"7\" value.bind=\"item.description\"></textarea>\n                        </div>\n                        <div class=\"form-group\" show.bind=\"hasFeature\">\n                            <autocomplete value.two-way=\"item.featureTitle\"\n                                          placeholder=\"Choose feature\"\n                                          min-term-length=3\n                                          loader.bind=\"data\"\n                                          value-id.two-way=\"item.feature\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.requirementTitle\"\n                                          placeholder=\"Choose functional requirement\"\n                                          min-term-length=3\n                                          loader.bind=\"rdata\"\n                                          value-id.two-way=\"item.requirement\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <button type=\"button\" class=\"btn btn-default\" onclick=\"document.location.href='#/';\">Cancel</button>\n                            <button type=\"button\" class=\"btn btn-primary\" disabled.bind=\"!canSave\" click.trigger=\"save()\" id=\"saveButton\">Save</button>\n                        </div>\n                    </div>\n                    <div class=\"col-md-4\">\n                        <div class=\"form-group\">\n                            <div class=\"btn-group\" role=\"group\">\n                                <button type=\"button\" class = \"btn btn-default ${item.type=='feature' ? 'active' : ''}\"  click.trigger=\"switchType('feature')\">Feature</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.type=='task' ? 'active' : ''}\"  click.trigger=\"switchType('task')\">Task</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.type=='bug' ? 'active' : ''}\"  click.trigger=\"switchType('bug')\">Bug</button>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.authorTitle\"\n                                          placeholder=\"Choose author\"\n                                          min-term-length=2\n                                          loader.bind=\"udata\"\n                                          value-id.two-way=\"item.author\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.assigneeTitle\"\n                                          placeholder=\"Choose assignee\"\n                                          min-term-length=2\n                                          loader.bind=\"udata\"\n                                          value-id.two-way=\"item.assignee\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\"  show.bind=\"hasEstimate\">\n                            <div class=\"btn-group\" role=\"group\" >\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==0 ? 'active' : ''}\" click.trigger=\"switchEstimate(0)\">?</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==2 ? 'active' : ''}\" click.trigger=\"switchEstimate(2)\">S</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==5 ? 'active' : ''}\" click.trigger=\"switchEstimate(5)\">M</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==13 ? 'active' : ''}\" click.trigger=\"switchEstimate(13)\">XL</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==21 ? 'active' : ''}\" click.trigger=\"switchEstimate(21)\">XXL</button>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <button type=\"button\" class=\"btn btn-danger ${item.isProblem ? 'active' : ''}\" click.trigger=\"switchProblem()\">Report a problem</button>\n                        </div>\n                        <div class=\"form-group\">\n                            <textarea class=\"form-control\" rows=\"3\" show.bind=\"item.isProblem\" value.bind=\"item.problemDescription\" focus.bind=\"isProblemFocus\"></textarea>\n                        </div>\n                    </div>\n\n                </form>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!controllers/archive.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container\">\n        <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">Archive</div>\n            <div class=\"panel-body\">\n                <table class=\"table\">\n                    <thead>\n                    <tr>\n                        <th>Closed</th>\n                        <th>Title</th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr repeat.for=\"i of items\" current.bind=\"i\">\n                        <td>${i.updatedTitle}</td>\n                        <td width=\"80%\"><a href=\"#/item/${i._id}\">${i.title}</a></td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n</template>\n"; });
define('text!controllers/autocomplete.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./autocomplete.css\"></require>\n    <div class=\"autocomplete-container\">\n        <input class=\"form-control\"\n               autocomplete=\"off\"\n               value.bind=\"value\"\n               keyup.delegate=\"inputKeyPressed($event)\"\n               placeholder.bind=\"placeholder\"\n               blur.trigger=\"hideSuggestions()\"\n               focus.bind=\"hasFocus\">\n        <div class=\"autocomplete-suggestion\" show.bind=\"isShown\">\n            <div class=\"list-group\">\n                <a data-id=\"${item._id}\"\n                   data-value=\"${item.title}\"\n                   class=\"list-group-item\"\n                   repeat.for=\"item of items\"\n                   mousedown.delegate=\"itemSelected($event)\"><span>${item.title}</span>\n                </a>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!controllers/editItem.html', ['module'], function(module) { module.exports = "<template>\n\n    <div class=\"container\">\n\n        <div class=\"panel panel-default\">\n            <div class=\"panel-body\">\n                <require from=\"./autocomplete\"></require>\n                <form>\n                    <div class=\"col-md-8\" >\n                        <div class=\"form-group\">\n                            <input type=\"text\" class=\"form-control\" placeholder=\"Title\" value.bind=\"item.title\" focus.bind=\"isTitleFocus\">\n                        </div>\n                        <div class=\"form-group\">\n                            <textarea class=\"form-control\" rows=\"7\" value.bind=\"item.description\"></textarea>\n                        </div>\n                        <div class=\"form-group\" show.bind=\"hasFeature\">\n                            <autocomplete value.two-way=\"item.featureTitle\"\n                                          placeholder=\"Choose feature\"\n                                          min-term-length=3\n                                          loader.bind=\"data\"\n                                          value-id.two-way=\"item.feature.id\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.requirementTitle\"\n                                          placeholder=\"Choose functional requirement\"\n                                          min-term-length=3\n                                          loader.bind=\"rdata\"\n                                          value-id.two-way=\"item.requirement.id\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <button type=\"button\" class=\"btn btn-default\" onclick=\"document.location.href='#/';\">Cancel</button>\n                            <button type=\"button\" class=\"btn btn-primary\" disabled.bind=\"!canSave\" click.trigger=\"save()\">Save</button>\n                            <button type=\"button\" class=\"btn btn-warning\" show.bind=\"isClosed\" click.trigger=\"restore()\">Restore in backlog</button>\n                        </div>\n                    </div>\n                    <div class=\"col-md-4\">\n                        <div class=\"form-group\">\n                            <div class=\"btn-group\" role=\"group\">\n                                <button type=\"button\" class = \"btn btn-default ${item.type=='feature' ? 'active' : ''}\"  click.trigger=\"switchType('feature')\">Feature</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.type=='task' ? 'active' : ''}\"  click.trigger=\"switchType('task')\">Task</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.type=='bug' ? 'active' : ''}\"  click.trigger=\"switchType('bug')\">Bug</button>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.authorTitle\"\n                                          placeholder=\"Choose author\"\n                                          min-term-length=2\n                                          loader.bind=\"udata\"\n                                          value-id.two-way=\"item.author.id\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\">\n                            <autocomplete value.two-way=\"item.assigneeTitle\"\n                                          placeholder=\"Choose assignee\"\n                                          min-term-length=2\n                                          loader.bind=\"udata\"\n                                          value-id.two-way=\"item.assignee.id\"\n                            ></autocomplete>\n                        </div>\n                        <div class=\"form-group\"  show.bind=\"hasEstimate\">\n                            <div class=\"btn-group\" role=\"group\" >\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==0 ? 'active' : ''}\" click.trigger=\"switchEstimate(0)\">?</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==2 ? 'active' : ''}\" click.trigger=\"switchEstimate(2)\">S</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==5 ? 'active' : ''}\" click.trigger=\"switchEstimate(5)\">M</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==13 ? 'active' : ''}\" click.trigger=\"switchEstimate(13)\">XL</button>\n                                <button type=\"button\" class=\"btn btn-default ${item.estimate==21 ? 'active' : ''}\" click.trigger=\"switchEstimate(21)\">XXL</button>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <button type=\"button\" class=\"btn btn-danger ${item.isProblem ? 'active' : ''}\" click.trigger=\"switchProblem()\">Report a problem</button>\n                        </div>\n                        <div class=\"form-group\">\n                            <textarea class=\"form-control\" rows=\"3\" show.bind=\"item.isProblem\" value.bind=\"item.problemDescription\" focus.bind=\"isProblemFocus\"></textarea>\n                        </div>\n                    </div>\n\n                </form>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!controllers/node.html', ['module'], function(module) { module.exports = "<template>\n    <ul class=\"tree\">\n        <li><a href=\"#\" click.trigger=\"sendEdit(current._id)\">${current.title} [${current.requirementCode}]</a></li>\n        <li if.bind=\"current.children.length > 0\">\n            <node repeat.for=\"r of current.children\" current.bind=\"r\" edit.call=\"sendEdit(id)\"></node>\n        </li>\n    </ul>\n</template>"; });
define('text!controllers/pipelines.html', ['module'], function(module) { module.exports = "<template>\n  <nav class=\"navbar navbar-default\">\n    <div class=\"container-fluid\">\n      <div class=\"navbar-header\" style=\"width:100%;\">\n        <form class=\"navbar-form navbar-left\" if.bind=\"isPipelineOptions\">\n          <div class=\"form-group\">\n            <input type=\"text\" class=\"form-control\" placeholder=\"By text\">\n          </div>\n          <div class=\"form-group\">\n            <input class=\"form-control\" placeholder=\"Functional requrment\" autocomplete=\"off\">\n            <input class=\"form-control\" placeholder=\"Feature\" autocomplete=\"off\">\n            <input class=\"form-control\" placeholder=\"Assignee\" autocomplete=\"off\">\n            <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n              <button type=\"button\" class=\"btn btn-default ${filter.isFeatures ? 'active' : ''}\" click.trigger=\"switchFeatures()\">Features</button>\n              <button type=\"button\" class=\"btn btn-default ${filter.isTasks ? 'active' : ''}\" click.trigger=\"switchTasks()\">Tasks</button>\n              <button type=\"button\" class=\"btn btn-default ${filter.isBugs ? 'active' : ''}\" click.trigger=\"switchBugs()\">Bugs</button>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n  </nav>\n\n  <main class=\"pipelines\">\n    <div class=\"pipeline\" repeat.for=\"status of statuses\">\n      <div class=\"pipeline-header\">${status} <span class=\"badge\">${_items.totals[status]}</span>\n      </div>\n      <ul class=\"items\" data-status=\"${status}\">\n        <li class=\"ui-state-default item item-${i.type}\" repeat.for=\"i of _items[status]\" current.bind=\"i\" data-id=\"${i._id}\" id=\"${i._id}\">\n          <span class=\"badge badge-task\" style=\"margin-right:6px;\" if.bind=\"i.type != 'feature'\" >${i.estimate}</span>\n          ${i.title}\n          <a href=\"#/item/${i._id}\">edit</a>\n        </li>\n      </ul>\n    </div>\n  </main>\n</template>\n"; });
define('text!controllers/requirements.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container\">\n        <div class=\"panel panel-default\">\n            <div class=\"panel-body\">\n                <div class=\"col-md-4\">\n                    <div show.bind=\"isForm\">\n                        <form role=\"form\" submit.delegate=\"save()\">\n                        <div class=\"form-group\">\n                            <input type=\"text\" class=\"form-control\" placeholder=\"Title\" value.bind=\"requirement.title\">\n                        </div>\n                        <div class=\"form-group\" align=\"right\">\n                            <button type=\"button\" class=\"btn btn-warning\" show.bind=\"requirement._id\" click.trigger=\"create(requirement._id)\">Add child</button>\n                            <button type=\"button\" class=\"btn btn-default\" click.trigger=\"hide()\">Cancel</button>\n                            <button type=\"button\" class=\"btn btn-danger\" show.bind=\"requirement._id\" click.trigger=\"remove(requirement._id)\">Remove</button>\n                            <button type=\"button\" class=\"btn btn-primary\" disabled.bind=\"!canSave\" click.trigger=\"save()\">Save</button>\n                        </div>\n                        </form>\n                    </div>\n\n\n\n                    <!--\n                    <div class=\"form-group\">\n                        <input type=\"text\" class=\"form-control\" placeholder=\"Title\" value.bind=\"functions.title\">\n                    </div>\n                    <div class=\"form-group\" align=\"right\">\n                        <button type=\"button\" class=\"btn btn-warning\">Add child</button>\n                        <button type=\"button\" class=\"btn btn-default\">Cancel</button>\n                        <button type=\"button\" class=\"btn btn-primary\">Save</button>\n                    </div>\n                    <div style=\"padding: 10px;\">\n                        <span class=\"label label-danger\">Bugs</span>\n                    </div>\n                    <div style=\"padding: 10px;\">\n                        <a href=\"#\">Create super design</a>\n                    </div>\n                    <div style=\"padding: 10px;\">\n                        <span class=\"label label-success\">Features</span>\n                    </div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design. Create super design. Create super design. Create super design. Create super design. </a></div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design</a></div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design</a></div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design</a></div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design</a></div>\n                    <div style=\"padding: 10px;\"><a href=\"#\">Create super design</a></div>\n                    -->\n                </div>\n                <div class=\"col-md-8\" >\n                    <button type=\"button\" class=\"btn btn-primary\"\n                            show.bind=\"requirements.length < 1\"\n                            click.trigger=\"create(null)\"\n                    >Create</button>\n                    <div if.bind=\"requirements.length > 0\">\n                        <require from='./node'></require>\n                        <node repeat.for=\"r of requirements\" current.bind=\"r\" edit.call=\"edit(id)\"></node>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!controllers/users.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container\">\n        <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">Users</div>\n            <div class=\"panel-body\">\n                <div class=\"col-md-5\">\n                    <div show.bind=\"isForm\">\n                        <form role=\"form\" submit.delegate=\"save()\">\n                            <div class=\"form-group\">\n                                <label for=\"inputEmail\">Email address</label>\n                                <input id=\"inputEmail\" type=\"text\" class=\"form-control\" placeholder=\"Email\" value.bind=\"user.email\">\n                            </div>\n                            <div class=\"form-group\">\n                                <label for=\"inputPass\">Password</label>\n                                <input id=\"inputPass\" type=\"password\" class=\"form-control\" placeholder=\"Password\" value.bind=\"user.password\">\n                            </div>\n                            <div class=\"form-group\" align=\"right\">\n                                <button type=\"button\" class=\"btn btn-default\" click.trigger=\"hide()\">Cancel</button>\n                                <button type=\"button\" class=\"btn btn-primary\" disabled.bind=\"!canSave\" click.trigger=\"save()\">Save</button>\n                            </div>\n                        </form>\n                    </div>\n                </div>\n                <div class=\"col-md-7\">\n                    <button type=\"button\" class=\"btn btn-primary\" click.trigger=\"create()\" style=\"margin-bottom: 10px;\">Create</button>\n                    <div class=\"list-group\" >\n                        <a href=\"#\" class=\"list-group-item\" repeat.for=\"u of users\" current.bind=\"u\" click.trigger=\"edit(u._id)\">${u.email}</a>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map