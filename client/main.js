import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../lib/todos.js'
import './main.html';
import './routes.js';
import './todos.js';

// Meteor.subscribe('plans');

Template.admin.helpers({
  'admin': function () {
    var currentUser = Meteor.user();
    if (Roles.userIsInRole(currentUser, ['admin']))
      return true;
    return false;
  }
});

Template.userList.helpers({
  'users': function () {
    return Meteor.users.find({});
  },
  'isUser': function () {
    if (this.roles[0] == "user")
      return true;
    return false;
  },
  'hasTrainer': function () {
    if (this.profile.hasTrainer)
      return true;
    return false;
  },
  'trainers': function () {
    return Meteor.users.find({ roles: 'trainer' }, {});
  },
  'trainerUsername': function () {
    var trainerId = this.profile.trainer_id;
    return Meteor.users.findOne({ _id: trainerId }, { username: 1 }).username;
  }
});

Template.userList.events({
  'click .makeDefaultUser': function (event) {
    event.preventDefault();
    var id = this._id;
    Meteor.call('makeDefaultUser', id);
  },
  'click .makeTrainer': function (event) {
    event.preventDefault();
    var id = this._id;
    Meteor.call('makeTrainer', id);
  },
  'submit .setTrainer': function (event) {
    event.preventDefault();
    var trainerId = $('[name="trainers"] :selected').val();
    Meteor.call('addTrainerToUser', this._id, trainerId, this.profile.name);
  }
});

Template.navigation.events({
  'click .logout': function (event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('login');
  }
});

Template.plans.helpers({
  'plan': function () {
    var currentUser = Meteor.userId();
    return Plans.find({ createdFor: currentUser }, { sort: { name: 1 } });
  },
  'isUser': function () {
    var currentUser = Meteor.user();
    if (currentUser.roles[0] === "user")
      return true;
    return false;
  }
});

Template.traineePage.helpers({
  'traineeName': function () {
    var currentUserId = this._id;
    return this.username;
  }
});

Template.traineePlans.helpers({
  'traineePlan': function () {
    var currentUserId = this._id;
    console.log("traineePlans.helpers.plan ", Plans.find({ createdFor: currentUserId }, { sort: { name: 1 } }));
    return Plans.find({ createdFor: currentUserId }, { sort: { name: 1 } });
  }
});

Template.trainees.helpers({
  'isTrainer': function () {
    var currentUser = Meteor.user();
    if (currentUser.roles[0] === "trainer")
      return true;
    return false;
  },
  'trainee': function () {
    var currentUserId = Meteor.userId();
    var users = Meteor.users.find().fetch();
    var list = [];
    for (var i = users.length - 1; i >= 0; i--) {
      if (users[i].profile.trainer_id)
        list.push(users[i]);
    }
    return list;
  }
})

Template.profile.helpers({
  'email': function () {
    return this.emails[0].address; //Meteor.user.emails[0].address;
  },
  'roles': function () {
    return this.roles;
  }
});

$.validator.setDefaults({
  rules: {
    // email: {
    //     required: true,
    //     email: true
    // },
    password: {
      required: true,
      minlength: 6
    },
    password_confirm: {
      minlength: 6,
      equalTo: ".password"
    }
  },
  messages: {
    // email: {
    //     required: "You must enter an email address.",
    //     email: "You've entered an invalid email address."
    // },
    password: {
      required: "You must enter a password.",
      minlength: "Your password must be at least {0} characters."
    }
  }
});

Template.login.onRendered(function () {
  var validator = $('.login').validate({
    submitHandler: function (event) {
      var emailorUsername = $('[name="email"]').val();
      var password = $('[name="password"]').val();
      Meteor.loginWithPassword(emailorUsername, password, function (error) {
        if (error) {
          if (error.reason == "User not found") {
            validator.showErrors({
              email: error.reason
            });
          }
          if (error.reason == "Incorrect password") {
            validator.showErrors({
              password: error.reason
            });
          }
        } else {
          var currentRoute = Router.current().route.getName();
          if (currentRoute == "login") {
            Router.go("home");
          }
        }
      });
    }
  });
});

Template.register.onRendered(function () {
  var validator = $('.register').validate({
    submitHandler: function (event) {
      var username = $('[name="username"]').val();
      var fullname = $('[name="fullname"]').val();
      var email = $('[name="email"]').val();
      var password = $('[name="password"]').val();
      Accounts.createUser({
        username: username,
        email: email,
        password: password,
        profile: {
          name: fullname
        }
      }, function (error) {
        if (error) {
          if (error.reason == "Email already exists.") {
            validator.showErrors({
              email: "That email already belongs to a registered user."
            });
          }
        } else {
          var currentUser = Meteor.userId();
          Plans.insert({
            name: "Diet Plan",
            createdFor: currentUser,
            createdAt: new Date()
          });
          Plans.insert({
            name: "Exercise Plan",
            createdFor: currentUser,
            createdAt: new Date()
          });
          Meteor.call('makeDefaultUser', currentUser);
          Router.go('home');
        }
      });
    }
  });
});
