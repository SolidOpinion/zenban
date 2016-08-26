var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence');
var dateFormat = require('dateformat');

mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://zenban:zenban@candidate.14.mongolayer.com:11183,candidate.45.mongolayer.com:10871/app55659082');
// mongoose.connect('mongodb://localhost/zenban');

var app = express();


app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json())
app.use(express.static('./'));

var ObjectId = mongoose.Schema.Types.ObjectId;


var requirementSchema = mongoose.Schema({
  title: String,
  parent: { type: ObjectId, ref: "Requirement" },
  updated: { type: Date, default: Date.now }
});
requirementSchema.index({ title: 'text' });
requirementSchema.plugin(AutoIncrement, {inc_field: 'requirementCode'});

var Requirement = mongoose.model('Requirement', requirementSchema);

var userSchema = mongoose.Schema({
  title: String,
  email: String,
  password: String
});

var User = mongoose.model('User', userSchema);


var itemSchema = mongoose.Schema({
  title: String,
  description: String,
  order: Number,
  feature: { type: ObjectId, ref: "Item" },
  requirement: { type: ObjectId, ref: "Requirement" },
  author: { type: ObjectId, ref: "User" },
  assignee: { type: ObjectId, ref: "User" },
  type: String,
  estimate: Number,
  isProblem: Boolean,
  problemDescription: String,
  status: String,
  updated: { type: Date, default: Date.now }
});

var Item = mongoose.model('Item', itemSchema);
itemSchema.plugin(AutoIncrement, {inc_field: 'itemCode'});


/*******************************************************************
 * REQUIREMENTS
 *******************************************************************/


// get list
app.get('/api/requirements', function(req, res) {
  Requirement.find(function (err, requirements) {
    if (err) res.status(500).send('Error');
    res.json(requirements)
  })
});

// get one
app.get('/api/requirements/:id', function(req, res) {
  Requirement.findOne({ _id: req.params.id })
    .populate("parent")
    .exec(function (err, requirement) {
      if (err) res.status(500).send('Error');
      res.json(requirement)
    })
});

// create new
app.post('/api/requirements', function(req, res) {
  var r = new Requirement(req.body);
  r.save(function (err, r) {
    if (err) res.status(500).send('Error');
    res.json(r);
  })
});

app.put('/api/requirements/:id', function(req, res) {
  req.body.updated = new Date();
  Requirement.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert:false }, function(err, r) {
    if (err) {
      console.log(err);
      res.status(500).send('Error');
    }
    res.json(req.body)
  });
});

app.delete('/api/requirements/:id', function(req, res) {
  Requirement.findByIdAndRemove(req.params.id, function(err, r) {
    if (err) res.status(500).send('Error');
    res.json({ status: "OK" });
  });
});

// search
app.post('/api/search/requirements', function(req, res) {
  Requirement.find({ title: new RegExp(req.body.search, 'i') }, function (err, requirements) {
    if (err) res.status(500).send('Error');
    res.json(requirements)
  })
});

/*******************************************************************
 * USERS
 *******************************************************************/


// search
app.post('/api/search/users', function(req, res) {
  User.find({ title: new RegExp(req.body.search, 'i') }, function (err, users) {
    if (err) res.status(500).send('Error');
    res.json(users)
  })
});

// create new
app.post('/api/users', function(req, res) {

  var emailParts = req.body.email.split('@');
  console.log(emailParts);
  if (emailParts.length != 2) {
    res.status(500).send('Error');
  } else {
    var u = new User(req.body);
    u.title = emailParts[0];
    u.save(function (err, u) {
      if (err) {
        console.log(err);
        res.status(500).send('Error');
      }
      res.json(u);
    })
  }
});

// get list
app.get('/api/users', function(req, res) {
  User.find(function (err, users) {
    if (err) res.status(500).send('Error');
    res.json(users)
  })
});


// get one
app.get('/api/users/:id', function(req, res) {
  User.findOne({ _id: req.params.id })
    .exec(function (err, user) {
      if (err) res.status(500).send('Error');
      res.json(user)
    })
});

app.put('/api/users/:id', function(req, res) {
  var emailParts = req.body.email.split('@');
  console.log(emailParts);
  if (emailParts.length != 2) {
    res.status(500).send('Error');
  } else {
    req.body.title = emailParts[0];
    User.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: false}, function (err, r) {
      if (err) {
        console.log(err);
        res.status(500).send('Error');
      }
      res.json(req.body)
    });
  }
});


/*******************************************************************
 * ITEMS
 *******************************************************************/


// create new
app.post('/api/items', function(req, res) {

  if (req.body.requirement == undefined || req.body.requirement == '') req.body.requirement = null;
  if (req.body.feature == undefined || req.body.feature == '') req.body.feature = null;
  if (req.body.assignee == undefined || req.body.assignee == '') req.body.assignee = null;
  if (req.body.author == undefined || req.body.author == '') req.body.author = null;

  console.log(req.body);

  var i = new Item(req.body);
  i.save(function (err, i) {
    if (err) {
      console.log(err);
      res.status(500).send('Error');
    }
    res.json(i);
  })
});

// get list
app.get('/api/items', function(req, res) {

  console.log(req.query);

  var types = [];
  if (req.query.isFeatures == "true") types.push("feature");
  if (req.query.isTasks == "true") types.push("task");
  if (req.query.isBugs == "true") types.push("bug");
  console.log(types);

  Item.find({ status: {$ne: "Closed"}, type: {$in: types} }, function (err, items) {
    if (err) res.status(500).send('Error');
    res.json(items);
  })
});

// get archive
app.get('/api/archive', function(req, res) {
  Item.find({ status: "Closed" }).sort({'updated': -1}).exec(function (err, items) {
    if (err) res.status(500).send('Error');
    res.json(items);
  });
});


// get one
app.get('/api/items/:id', function(req, res) {
  Item.findOne({ _id: req.params.id })
    .populate("requirement")
    .populate("feature")
    .populate("author")
    .populate("assignee")
    .exec(function (err, item) {
      if (err) res.status(500).send('Error');
      res.json(item);
    })
});

app.put('/api/items/:id', function(req, res) {
  req.body.updated = new Date();
  console.log(req.body);
  Item.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert:false }, function(err, i) {
    if (err) {
      console.log(err);
      res.status(500).send('Error');
    }
    res.json(req.body);
  });
});

app.delete('/api/items/:id', function(req, res) {
  Item.findByIdAndRemove(req.params.id, function(err, i) {
    if (err) res.status(500).send('Error');
    res.json({ status: "OK" });
  });
});

// search
app.post('/api/search/items', function(req, res) {
  Item.find({ title: new RegExp(req.body.search, 'i') }, function (err, items) {
    if (err) res.status(500).send('Error');
    res.json(items)
  })
});


app.post('/api/board', function(req, res) {
  console.log(req.body);

  var itemChanges = {};
  itemChanges.status = req.body.status;

  Item.findOneAndUpdate({ _id: req.body.id }, itemChanges, { upsert:false }, function(err, i) {
    if (err) res.status(500).send('Error');

    var items = req.body.order.split(',');
    for (var i=0; i < items.length; i++) {
      Item.findOne({ _id: items[i] }, function (err, item) {
        item.order = items.indexOf(item._id.toString());
        item.save();
      });
    }
    res.json({status: 'ok'});
  });


});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
