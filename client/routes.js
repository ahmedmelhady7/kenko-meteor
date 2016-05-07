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
	onAfterAction: function(){
		$('.active').removeClass('active');
		$('.profile-nav').addClass('active');
	}
});
Router.route('/', {
    name: 'home',
    template: 'home',
	onAfterAction: function(){
		$('.active').removeClass('active');
		$('.home-nav').addClass('active');
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
    }
});

Router.configure({
    layoutTemplate: 'main'
});
