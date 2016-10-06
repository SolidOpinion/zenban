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

            config.map([{ route: "", moduleId: "controllers/welcome", nav: true, title: "Welcome", name: "welcome" }, { route: "signup", moduleId: "controllers/signup", nav: false, title: "Signup", name: "signup" }, { route: "login", moduleId: "controllers/login", nav: false, title: "Login", name: "login" }, { route: "logout", moduleId: "controllers/logout", nav: false, title: "Logout", name: "logout" }, { route: "test", moduleId: "controllers/test", nav: false, title: "Test", name: "test" }, { route: "request", moduleId: "controllers/request", nav: false, title: "Request", name: "request" }]);
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
define('main',['exports', './environment', 'aurelia-framework'], function (exports, _environment, _aureliaFramework) {
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

            this.email = "";
            this.password = "";
            this.error = "";

            this.auth = auth;
            this.router = router;
        }

        Login.prototype.login = function login() {
            var _this = this;

            this.auth.login(this.email, this.password).then(function (response) {
                _this.router.navigate('');
            }).catch(function (error) {
                _this.error = error.message;
            });
        };

        _createClass(Login, [{
            key: 'isLogged',
            get: function get() {
                return this.auth.isLogged;
            }
        }, {
            key: 'showError',
            get: function get() {
                if (this.error.length > 0) return true;
                return false;
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
define('controllers/request',['exports', 'aurelia-framework', '../models/rest', '../models/auth', 'aurelia-router'], function (exports, _aureliaFramework, _rest, _auth, _aureliaRouter) {
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

    _aureliaFramework.LogManager.setLevel(_aureliaFramework.LogManager.logLevel.error);

    var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_rest.Rest, _auth.Auth, _aureliaRouter.Router, _aureliaFramework.LogManager), _dec(_class = function () {
        function Signup(rest, auth, router, logManager) {
            _classCallCheck(this, Signup);

            this.error = '';
            this.currentTab = 'Description';
            this.request = {};
            this.isNewRequest = true;

            this.rest = rest;
            this.auth = auth;
            this.router = router;
            this.logger = logManager.getLogger(this);

            this.request.isProblem = false;
            this.request.title = '';
            this.request.description = '';
            this.request.author = '';
            this.request.creation_date = '';
        }

        Signup.prototype.switchTabTo = function switchTabTo(tabName) {
            this.currentTab = tabName;
        };

        Signup.prototype.descriptionSave = function descriptionSave() {};

        _createClass(Signup, [{
            key: 'showError',
            get: function get() {
                if (this.error.length > 0) return true;
                return false;
            }
        }]);

        return Signup;
    }()) || _class);
});
define('controllers/signup',['exports', 'aurelia-framework', '../models/rest', '../models/auth', 'aurelia-router'], function (exports, _aureliaFramework, _rest, _auth, _aureliaRouter) {
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

    var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_rest.Rest, _auth.Auth, _aureliaRouter.Router), _dec(_class = function () {
        function Signup(rest, auth, router) {
            _classCallCheck(this, Signup);

            this.email = '';
            this.name = '';
            this.password = '';

            this.rest = rest;
            this.auth = auth;
            this.router = router;
            this.error = '';
        }

        Signup.prototype.signup = function signup() {
            var _this = this;

            this.rest.create('user', { name: this.name, email: this.email, password: this.password }).then(function (response) {
                _this.router.navigate('#/login');
            }).catch(function (error) {
                console.log(error);
                _this.error = error.message;
            });
        };

        _createClass(Signup, [{
            key: 'showError',
            get: function get() {
                if (this.error.length > 0) return true;
                return false;
            }
        }]);

        return Signup;
    }()) || _class);
});
define('controllers/test',['exports', 'aurelia-framework', '../models/rest', '../models/auth', 'aurelia-router'], function (exports, _aureliaFramework, _rest, _auth, _aureliaRouter) {
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

    _aureliaFramework.LogManager.setLevel(_aureliaFramework.LogManager.logLevel.error);

    var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_rest.Rest, _auth.Auth, _aureliaRouter.Router, _aureliaFramework.LogManager), _dec(_class = function Signup(rest, auth, router, logManager) {
        _classCallCheck(this, Signup);

        this.email = '';
        this.name = '';
        this.password = '';

        this.rest = rest;
        this.auth = auth;
        this.router = router;
        this.logger = logManager.getLogger(this);
        this.error = '';

        this.logger.warn("test");

        this.rest.list('test', { name: 'vasya' }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }) || _class);
});
define('controllers/welcome',['exports', '../models/rest', 'aurelia-framework'], function (exports, _rest, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Welcome = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Welcome = exports.Welcome = (_dec = (0, _aureliaFramework.inject)(_rest.Rest), _dec(_class = function Welcome(rest) {
        _classCallCheck(this, Welcome);

        this.rest = rest;
    }) || _class);
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
define('models/rest',['exports', 'aurelia-framework', 'aurelia-http-client', '../environment'], function (exports, _aureliaFramework, _aureliaHttpClient, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Rest = undefined;

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

    _aureliaFramework.LogManager.setLevel(_aureliaFramework.LogManager.logLevel.error);

    var Rest = exports.Rest = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = function () {
        function Rest(httpClient) {
            _classCallCheck(this, Rest);

            this.http = httpClient;
            this.endpoint = _environment2.default.api;
        }

        Rest.prototype.create = function create(resource, document) {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.http.post(self.endpoint + "/api/" + resource, document).then(function (response) {
                    resolve(response.content);
                }).catch(function (error) {
                    reject({ code: error.statusCode, message: error.content.message });
                });
            });
        };

        Rest.prototype.modify = function modify(resource, id, fields) {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.http.put(self.endpoint + "/api/" + resource + "/" + id, fields).then(function (response) {
                    resolve(response.content);
                }).catch(function (error) {
                    reject({ code: error.statusCode, message: error.content.message });
                });
            });
        };

        Rest.prototype.delete = function _delete(resource, id) {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.http.delete(self.endpoint + "/api/" + resource + "/" + id).then(function (response) {
                    resolve(response.content);
                }).catch(function (error) {
                    reject({ code: error.statusCode, message: error.content.message });
                });
            });
        };

        Rest.prototype.get = function get(resource, id) {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.http.get(self.endpoint + "/api/" + resource + "/" + id).then(function (response) {
                    resolve(response.content);
                }).catch(function (error) {
                    reject({ code: error.statusCode, message: error.content.message });
                });
            });
        };

        Rest.prototype.list = function list(resource, filters) {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.http.createRequest("/api/" + resource + "-list").asGet().withBaseUrl(self.endpoint).withParams(filters).send().then(function (response) {
                    resolve(response.content);
                }).catch(function (error) {
                    resolve(error.content);
                });
            });
        };

        return Rest;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"font-awesome/css/font-awesome.css\"></require>\n\n  <nav class=\"navbar navbar-default \">\n    <div class=\"container\" if.bind=\"isLogged\">\n      <ul class=\"nav navbar-nav\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li><a href=\"/#/request\">New request</a></li>\n        <li><a href=\"#\">Requests</a></li>\n        <li><a href=\"#\">Tasks</a></li>\n        <li><a href=\"#\">Archive</a></li>\n        <li><a href=\"/#/test\">test</a></li>\n\n      </ul>\n      <p class=\"navbar-text navbar-right\">Signed in as ${user.name}, <a href=\"/#/logout\" class=\"navbar-link\">Logout</a></p>\n    </div>\n    <div class=\"container\" if.bind=\"!isLogged\">\n      <ul class=\"nav navbar-nav\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li><a href=\"/#/login\">Login</a></li>\n        <li><a href=\"/#/signup\">Signup</a></li>\n      </ul>\n    </div>\n  </nav>\n\n  <div class=\"container\">\n    <router-view></router-view>\n  </div>\n\n</template>\n"; });
define('text!controllers/login.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"panel panel-default center\" style=\"width: 400px;\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">Login</h3>\n        </div>\n        <div class=\"panel-body\">\n            <form role=\"form\" submit.delegate=\"login()\">\n                <div class=\"form-group\">\n                    <label for=\"email\">Email</label>\n                    <input type=\"text\" value.bind=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Email\">\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"password\">Password</label>\n                    <input type=\"password\" value.bind=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\">\n                </div>\n                <button type=\"submit\" class=\"btn btn-default\">Login</button>\n            </form>\n        </div>\n        <div class=\"panel-footer\" if.bind=\"showError\" style=\"color: #ee0701;\">${error}</div>\n    </div>\n</template>"; });
define('text!controllers/logout.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!controllers/request.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"panel panel-default center\" style=\"width: 800px;\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\" if.bind=\"!isNewRequest\" >Request</h3>\n            <h3 class=\"panel-title\" if.bind=\"isNewRequest\" >Create a new request</h3>\n            <div if.bind=\"showError\" style=\"color: #ee0701;\">${error}</div>\n        </div>\n        <div class=\"panel-body\">\n            <ul class=\"nav nav-tabs\">\n                <li role=\"presentation\" class=\"${currentTab == 'Description' ? 'active' : ''}\"><a href=\"#\" click.delegate=\"switchTabTo('Description')\">Description</a></li>\n\n                <li if.bind=\"!isNewRequest\" role=\"presentation\" class=\"${currentTab == 'Requirements' ? 'active' : ''}\"><a href=\"#\" click.delegate=\"switchTabTo('Requirements')\">Requirements</a></li>\n                <li if.bind=\"!isNewRequest\"  role=\"presentation\" class=\"${currentTab == 'Tasks' ? 'active' : ''}\"><a href=\"#\" click.delegate=\"switchTabTo('Tasks')\">Tasks</a></li>\n                <li if.bind=\"!isNewRequest\"  role=\"presentation\" class=\"${currentTab == 'People' ? 'active' : ''}\"><a href=\"#\" click.delegate=\"switchTabTo('People')\">People</a></li>\n                <li if.bind=\"!isNewRequest\"  role=\"presentation\" class=\"${currentTab == 'Documentation' ? 'active' : ''}\"><a href=\"#\" click.delegate=\"switchTabTo('Documentation')\">Documentation</a></li>\n                <li if.bind=\"!isNewRequest\"  role=\"presentation\" class=\"${currentTab == 'History' ? 'active' : ''}\"><a href=\"#\" click.delegate=\"switchTabTo('History')\">History</a></li>\n            </ul>\n<!-- Description -->\n           <div class=\"form-under-tab\" if.bind=\"currentTab == 'Description'\">\n               <form role=\"form\" submit.delegate=\"descriptionSave()\">\n                   <div class=\"checkbox\" align=\"right\"  if.bind=\"!isNewRequest\" >\n                       <label><input type=\"checkbox\" value.bind=\"request.isProblem\"> Request has a problem</label>\n                   </div>\n                   <div class=\"form-group\">\n                       <label for=\"title\">Title</label>\n                       <input type=\"text\" value.bind=\"request.title\" class=\"form-control\" id=\"title\">\n                   </div>\n                   <div class=\"form-group\">\n                       <label for=\"title\">Description</label>\n                       <textarea class=\"form-control\" rows=\"8\" value.bind=\"request.description\" id=\"description\"></textarea>\n                       <span if.bind=\"!isNewRequest\" style=\"color: gray;\">by ${request.author} on ${request.creation_date}</span>\n                   </div>\n                   <button type=\"submit\" class=\"btn btn-default\">Save</button>\n               </form>\n           </div>\n\n<!-- Description -->\n            <div class=\"form-under-tab\" if.bind=\"currentTab == 'Requirements'\">\n                <form role=\"form\" submit.delegate=\"signup()\">\n                    <div class=\"form-group\">\n                        <label for=\"name\">Requirements</label>\n                        <input type=\"text\" value.bind=\"name\" class=\"form-control\" id=\"name\" placeholder=\"Name\">\n                    </div>\n                    <button type=\"submit\" class=\"btn btn-default\">Signup</button>\n                </form>\n            </div>\n\n\n        </div>\n    </div>\n</template>"; });
define('text!controllers/signup.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"panel panel-default center\" style=\"width: 400px;\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">Signup</h3>\n        </div>\n        <div class=\"panel-body\">\n            <form role=\"form\" submit.delegate=\"signup()\">\n                <div class=\"form-group\">\n                    <label for=\"email\">Name</label>\n                    <input type=\"text\" value.bind=\"name\" class=\"form-control\" id=\"name\" placeholder=\"Name\">\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"email\">Email</label>\n                    <input type=\"text\" value.bind=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Email\">\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"password\">Password</label>\n                    <input type=\"password\" value.bind=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\">\n                </div>\n                <button type=\"submit\" class=\"btn btn-default\">Signup</button>\n            </form>\n        </div>\n        <div class=\"panel-footer\" if.bind=\"showError\" style=\"color: #ee0701;\">${error}</div>\n    </div>\n</template>"; });
define('text!controllers/test.html', ['module'], function(module) { module.exports = "<template>\n    test\n</template>\n"; });
define('text!controllers/welcome.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"jumbotron\">\n        <h1>Hello, SolidTeam!</h1>\n        <p>Welcome to ZenBan - our new mega tracker.</p>\n    </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map