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
			userId: Meteor.userId()
		});
	},

	deletePost: function(postId){
		//server side validation
		//get the post
		var postUserId = Posts.findOne({_id: postId}, {}).userId;

		//verify the current user is the owner
		if (Meteor.userId() == postUserId) {
			//and then delete
			Posts.remove(postId);
		}
		else{
			throw new Meteor.Error('Unauthorized deletion attempt');
		}
	},

	editPost: function(post){
		//server side validation
		//get the post
		var postUserId = Posts.findOne({_id: post._id}, {}).userId;

		//verify the current user is the owner
		if (Meteor.userId() == postUserId) {
			Posts.update({_id: post._id}, {$set: { title: post.title, text: post.text }});
		}
		else{
			throw new Meteor.Error('Unauthorized edit attempt');
		}
	}
});
