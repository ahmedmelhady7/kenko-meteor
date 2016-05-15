Router.route('/logout');
Router.route('/admin');
Router.route('/register', {
	onAfterAction: function(){
		$('.active').removeClass('active');
		$('.reg-nav').addClass('active');
	}
});
Router.route('/login', {
	onAfterAction: function(){
		$('.active').removeClass('active');
		$('.login-nav').addClass('active');
	}
});
Router.route('/profile',{
	onBeforeAction: function(){
	    var currentUser = Meteor.userId();
	    if(currentUser){
	        this.next();
	    } else {
	        this.render("login");
	    }
    },
    onAfterAction: function(){
		$('.active').removeClass('active');
		$('.profile-nav').addClass('active');
	},
	data: function(){
		var currentUser = Meteor.userId();
		return Meteor.users.findOne({ _id: currentUser });
	},
	waitOn: function(){
        return Meteor.subscribe('user');
    }
});
Router.route('/', {
    name: 'home',
    template: 'home',
    onAfterAction: function(){
		$('.active').removeClass('active');
		$('.home-nav').addClass('active');
	},
	waitOn: function(){
        return [Meteor.subscribe('plans'), Meteor.subscribe('users')];
    }
});
Router.route('/plan/:_id', {
    name: 'planPage',
    template: 'planPage',
    data: function(){
        var currentPlan = this.params._id;
        return Plans.findOne({ _id: currentPlan });
    },
    onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(currentUser){
            this.next();
        } else {
            this.render("login");
        }
    },
    waitOn: function(){
        var currentList = this.params._id;
        return [ Meteor.subscribe('plans'), Meteor.subscribe('todos', currentList) ]
    }
});

Router.route('/trainee/:_id', {
	name: 'traineePage',
	template: 'traineePage',
	waitOn: function(){
		var currentTraineeId = this.params._id;
		console.log("waitOn function ", currentTraineeId);
        return [Meteor.subscribe('traineePlans', currentTraineeId),Meteor.subscribe('users')];
    },
    data: function(){
		var currentTraineeId = this.params._id;
		console.log("data function ", Meteor.users.findOne({_id: currentTraineeId}));
		return Meteor.users.findOne({_id: currentTraineeId});
	}
})

Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'loading'
});
