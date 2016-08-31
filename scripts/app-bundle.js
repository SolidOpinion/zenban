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
define('controllers/signup',['exports', 'aurelia-framework', '../models/usersData', '../models/auth', 'aurelia-router'], function (exports, _aureliaFramework, _usersData, _auth, _aureliaRouter) {
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

    var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_usersData.UsersData, _auth.Auth, _aureliaRouter.Router), _dec(_class = function () {
        function Signup(usersData, auth, router) {
            _classCallCheck(this, Signup);

            this.email = '';
            this.name = '';
            this.password = '';

            this.usersData = usersData;
            this.auth = auth;
            this.router = router;
            this.error = '';
        }

        Signup.prototype.signup = function signup() {
            var _this = this;

            var userInfo = { name: this.name, email: this.email, password: this.password };
            var self = this;

            this.usersData.addNew(userInfo).then(function (response) {
                _this.router.navigate('#/login');
            }).catch(function (error) {
                _this.error = error.content.message;
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"font-awesome/css/font-awesome.css\"></require>\n\n  <nav class=\"navbar navbar-default \">\n    <div class=\"container\" if.bind=\"isLogged\">\n      <ul class=\"nav navbar-nav\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li><a href=\"#\">New request</a></li>\n        <li><a href=\"#\">Requests</a></li>\n        <li><a href=\"#\">Tasks</a></li>\n        <li><a href=\"#\">Archive</a></li>\n      </ul>\n      <p class=\"navbar-text navbar-right\">Signed in as ${user.name}, <a href=\"/#/logout\" class=\"navbar-link\">Logout</a></p>\n    </div>\n    <div class=\"container\" if.bind=\"!isLogged\">\n      <ul class=\"nav navbar-nav\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li><a href=\"/#/login\">Login</a></li>\n        <li><a href=\"/#/signup\">Signup</a></li>\n      </ul>\n    </div>\n  </nav>\n\n  <div class=\"container\">\n    <router-view></router-view>\n  </div>\n\n</template>\n"; });
define('text!controllers/login.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"panel panel-default center\" style=\"width: 400px;\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">Login</h3>\n        </div>\n        <div class=\"panel-body\">\n            <form role=\"form\" submit.delegate=\"login()\">\n                <div class=\"form-group\">\n                    <label for=\"email\">Email</label>\n                    <input type=\"text\" value.bind=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Email\">\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"password\">Password</label>\n                    <input type=\"password\" value.bind=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\">\n                </div>\n                <button type=\"submit\" class=\"btn btn-default\">Login</button>\n            </form>\n        </div>\n        <div class=\"panel-footer\" if.bind=\"showError\" style=\"color: #ee0701;\">${error}</div>\n    </div>\n</template>"; });
define('text!controllers/logout.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!controllers/signup.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"panel panel-default center\" style=\"width: 400px;\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">Signup</h3>\n        </div>\n        <div class=\"panel-body\">\n            <form role=\"form\" submit.delegate=\"signup()\">\n                <div class=\"form-group\">\n                    <label for=\"email\">Name</label>\n                    <input type=\"text\" value.bind=\"name\" class=\"form-control\" id=\"name\" placeholder=\"Name\">\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"email\">Email</label>\n                    <input type=\"text\" value.bind=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Email\">\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"password\">Password</label>\n                    <input type=\"password\" value.bind=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\">\n                </div>\n                <button type=\"submit\" class=\"btn btn-default\">Signup</button>\n            </form>\n        </div>\n        <div class=\"panel-footer\" if.bind=\"showError\" style=\"color: #ee0701;\">${error}</div>\n    </div>\n</template>"; });
define('text!controllers/welcome.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"jumbotron\">\n        <h1>Hello, SolidTeam!</h1>\n        <p>Welcome to ZenBan - our new mega tracker.</p>\n    </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map