import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../lib/todos.js'
import './main.html';
import './routes.js';
import './todos.js';

Template.plans.helpers({
    'plan': function(){
        var currentUser = Meteor.userId();
        return Plans.find({createdFor: currentUser}, {sort: {name: 1}});
    }
});

Template.admin.helpers({
    'userList': function(){
        var jsonObj = Meteor.users.find({}).collection._docs._map;
        var users = Object.keys(jsonObj).map(function(k) { return jsonObj[k] });
        console.log(users);
        return users;
    }
});

Template.user.helpers({
    'email': function(){
        return this.emails[0].address;
    }
})

Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name="email"]').val();
        var password = $('[name="password"]').val();
        Accounts.createUser({
            email: email,
            password: password
        }, function(error){
            if(error)
                $('.reg-error').html(error.reason);
            else {
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
                Router.go('home');
            }
        });
    }
});

Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name="email"]').val();
        var password = $('[name="password"]').val();
        Meteor.loginWithPassword(email, password, function(error){
            if(!error){
                var currentRoute = Router.current().route.getName();
                if(currentRoute == "login"){
                    Router.go("home");
                }
            }
            else
                $('.login-error').html(error.reason);
        });
        
    }
});

Template.login.onRendered(function(){
    $('.login').validate();
})


Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});