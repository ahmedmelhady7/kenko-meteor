Meteor.methods({  
  'Database.seed': function() {
    //Create an admin
    var admin = Accounts.createUser({
        username: "hadi",
        email: "hadi@a.b",
        password: "123456",
        profile: {
            name: "Ahmed Elhady"
        }
    });
    Roles.addUsersToRoles(admin,['admin']);

    //create 2 trainers
    var t1 = Accounts.createUser({
        username: "t1",
        email: "t1@a.b",
        password: "123456",
        profile: {
            name: "Trainer 1"
        }
    });
    Roles.addUsersToRoles(t1,['trainer']);
    var t2 = Accounts.createUser({
        username: "t2",
        email: "t2@a.b",
        password: "123456",
        profile: {
            name: "Trainer 2"
        }
    });
    Roles.addUsersToRoles(t2,['trainer']);

    //create 3 users
    var u1 = Accounts.createUser({
        username: "u1",
        email: "u1@a.b",
        password: "123456",
        profile: {
            name: "User 1"
        }
    });
    Roles.addUsersToRoles(u1,['user']);
    var u2 = Accounts.createUser({
        username: "u2",
        email: "u2@a.b",
        password: "123456",
        profile: {
            name: "User 2"
        }
    });
    Roles.addUsersToRoles(u2,['user']);
    var u3 = Accounts.createUser({
        username: "u3",
        email: "u3@a.b",
        password: "123456",
        profile: {
            name: "User 3"
        }
    });
    Roles.addUsersToRoles(u3,['user']);


  }
});