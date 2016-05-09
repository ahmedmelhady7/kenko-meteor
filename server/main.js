import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  	Meteor.publish('plans', function(){
		var currentUser = this.userId;
		return Plans.find({ createdFor: currentUser });
	});
	Meteor.publish('todos', function(currentList){
	    var currentUser = this.userId;
	    return Todos.find({ createdFor: currentUser, planId: currentList })
	});
	Meteor.publish('user', function(){
		  var currentUser = this.userId;
		  return Meteor.users.find({_id: currentUser}, {});
	});


	Meteor.publish('users', function(){
		  return Meteor.users.find({});
	});


	Meteor.methods({
	    'makeDefaultUser': function(userId){
	    	Roles.addUsersToRoles(userId,['user']);
	    },
	    'makeTrainer': function(userId){
	    	Roles.addUsersToRoles(userId,['trainer']);
	    }
	});

// var id = Accounts.createUser({
//     username: "hadi",
//     email: "hadi@a.b",
//     password: "123456",
//     profile: {
//         name: "Ahmed Elhady"
//     },
//     roles: ['default', 'admin']
// });

// Roles.addUsersToRoles(id,['admin']);

// var id = Accounts.createUser({
//     username: "m7md",
//     email: "m7md@a.b",
//     password: "123456",
//     profile: {
//         name: "m7md aly"
//     }
// });

//Roles.addUsersToRoles("fyPQ6v6gHmNkqxJAz",['admin', 'user', 'trainer', 'btengan']);

});

