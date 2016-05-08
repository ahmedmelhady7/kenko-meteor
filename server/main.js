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
	Meteor.publish('users', function(){
		  var currentUser = this.userId;
		  return Meteor.users.find({_id: currentUser}, {});
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

// Roles.addUsersToRoles(id,['default', 'admin']);

});
