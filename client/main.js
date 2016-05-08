import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../lib/todos.js'
import './main.html';
import './routes.js';
import './todos.js';

// Meteor.subscribe('plans');

Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});

Template.plans.helpers({
    'plan': function(){
        var currentUser = Meteor.userId();
        return Plans.find({createdFor: currentUser}, {sort: {name: 1}});
    }
});

Template.profile.helpers({
    'email': function(){
        return this.emails[0].address;//Meteor.user.emails[0].address;
    },
    'roles': function(){
        return this.roles;
    }
});

$.validator.setDefaults({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 6
        },
        password_confirm : {
            minlength : 6,
            equalTo : ".password"
        }
    },
    messages: {
        email: {
            required: "You must enter an email address.",
            email: "You've entered an invalid email address."
        },
        password: {
            required: "You must enter a password.",
            minlength: "Your password must be at least {0} characters."
        }
    }
});

Template.login.onRendered(function(){
    var validator = $('.login').validate({
        submitHandler: function(event){
            var email = $('[name="email"]').val();
            var password = $('[name="password"]').val();
            Meteor.loginWithPassword(email, password, function(error){
                if(error) {
                    if(error.reason == "User not found"){
                        validator.showErrors({
                            email: error.reason    
                        });
                    }
                    if(error.reason == "Incorrect password"){
                        validator.showErrors({
                            password: error.reason    
                        });
                    }
                }
                else{
                    var currentRoute = Router.current().route.getName();
                    if(currentRoute == "login"){
                        Router.go("home");
                    }
                }
            });
        }
    });
});

Template.register.onRendered(function(){
    var validator = $('.register').validate({
        submitHandler: function(event){
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
                },
                roles: ['default']
            }, function(error){
                if(error){
                    if(error.reason == "Email already exists."){
                        validator.showErrors({
                            email: "That email already belongs to a registered user."   
                        });
                    }
                }
                else {
                    var currentUser = Meteor.userId();
                    console.log(currentUser)
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
                    Roles.addUsersToRoles(currentUser, 'default');
                    Router.go('home');
                }
            });
        } 
    });
});