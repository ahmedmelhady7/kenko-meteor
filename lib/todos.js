Todos = new Mongo.Collection('todos');
Plans = new Meteor.Collection('plans');

Meteor.users.allow({
  insert(){
    return true;
  },
  update(){
    return true;
  },
  remove(){
    return true;
  }
});


Plans.allow({
  insert(){
    return true;
  },
  update(){
    return true;
  },
  remove(){
    return true;
  }
});


// Plans.insert({
//     name: "Exercise Plan",
//     createdAt: new Date()
// });
// Plans.insert({
//     name: "Diet Plan",
//     createdAt: new Date()
// });
