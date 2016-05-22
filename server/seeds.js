Meteor.methods({
  'Database.seed': function (forced = false) {
    let users = JSON.parse(Assets.getText('userSeed.json'));
    let userId = Meteor.userId();

    // Clean the collection if forced is true and the user
    // have adminstrative access
    if (forced) {
      if (Roles.userIsInRole(userId, 'admin')) {
        Meteor.users.remove({});
      }
    }

    // Only seed if collection is clean
    if (Meteor.users.find().count() === 0) {
      users.forEach((user) => {
        let { username, email, password, profile } = user;
        let id = Accounts.createUser({ username, email, password, profile });

        // Fetch the role passed in the original user object
        Roles.addUsersToRoles(id, user.roles);

      });

    }

  }

});

Meteor.startup(() => {
  // Seed users if collection is empty
  if (Meteor.users.find().count() === 0) {
    Meteor.call('Database.seed');
  }

});
