import { Meteor } from 'meteor/meteor';

//declare a collection to hold the blog posts
Posts = new Mongo.Collection('posts');

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
	addPost: function(title, text){
		//authenticate user
		if(!Meteor.userId()){
			throw new Meteor.Error('Not signed in');
			
		}

		Posts.insert({
			title: title,
			text: text,
			created: new Date(),
			author: Meteor.user().emails[0].address,
			userId: Meteor.userId
		});
	},

	deletePost: function(postId){
		Posts.remove(postId);
	}
});
