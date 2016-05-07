Template.todos.helpers({
    'todo': function(){
        var currentPlan = this._id;
        var currentUser = Meteor.userId();
        return Todos.find({ planId: currentPlan, createdFor: currentUser }, {sort: {createdAt: -1}});
    },
    'belongsToUser': function(){
        var currentUser = Meteor.userId();
        if(currentUser==this.createdFor)
            return true;
        else
            return false;
    }
});

Template.addTodo.events({
    'submit form': function(event){
        event.preventDefault();
        var todoName = $('[name="todoName"]').val();
        var currentPlan = this._id;
        var currentUser = Meteor.userId();
        Todos.insert({
            name: todoName,
            completed: false,
            createdFor: currentUser,
            createdAt: new Date(),
            planId: currentPlan
        });
        $('[name="todoName"]').val('');
    }
});

Template.todoItem.helpers({
    'check': function(){
        var isCompleted = this.completed;
        if(isCompleted)
            return "checked";
        else
            return "";
    }
})

Template.todoItem.events({
    'keyup [name="todoItem"]': function(event){
        if(event.which == 13 || event.which == 27){
            $(event.target).blur();
        } else {
            var documentId = this._id;
            var todoItem = $(event.target).val();
            Todos.update({_id: documentId}, {$set: {name: todoItem}});
        }
    },
    'click .delete-todo': function(event){
        event.preventDefault();
        var documentId=this._id;
        var confirm = window.confirm("Delete this task?");
        if(confirm)
            Todos.remove({ _id: documentId });
    },
    'change [type=checkbox]': function(event){
        var documentId=this._id;
        var isCompleted = this.completed;
        if(isCompleted){
            Todos.update({ _id: documentId }, {$set: { completed: false }});
            console.log("Task marked as incomplete.");
        } else {
            Todos.update({ _id: documentId }, {$set: { completed: true }});
            console.log("Task marked as complete.");
        }
    }
});

Template.todosCount.helpers({
    'totalTodos': function(){
        var currentUser = Meteor.userId();
        var currentPlan = this._id;
        return Todos.find({ planId: currentPlan, createdFor: currentUser }).count();
    },
    'completedTodos': function(){
        var currentUser = Meteor.userId();
        var currentPlan = this._id;
        return Todos.find({ planId: currentPlan, createdFor: currentUser, completed: true }).count();
    }
});
