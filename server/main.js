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

	Meteor.publish('traineePlans', function(traineeId){
		return Plans.find({ createdFor: traineeId });
	});

	Meteor.publish('users', function(){
		  return Meteor.users.find({});
	});

	Meteor.publish('trainees', function(trainerId){
		  return Meteor.users.find({profile: {trainer_id: trainerId}});
	});


	Meteor.methods({
	    'makeDefaultUser': function(userId){
	    	Roles.addUsersToRoles(userId,['user']);
	    },
	    'makeTrainer': function(userId){
	    	Roles.addUsersToRoles(userId,['trainer']);
	    },
	    'addTrainerToUser': function(userId, trainerId, profileName){
	    	Meteor.users.update({_id: userId}, {$set: {profile: {trainer_id: trainerId, hasTrainer: true, name: profileName}}});
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
//
// Roles.addUsersToRoles(id,['admin']);
//
// var id = Accounts.createUser({
//     username: "m7md",
//     email: "m7md@a.b",
//     password: "123456",
//     profile: {
//         name: "m7md aly"
//     }
// });
//
// Roles.addUsersToRoles(id,['admin', 'user', 'trainer', 'btengan']);

});
