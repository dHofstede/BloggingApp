import { Meteor } from 'meteor/meteor';

//declare a collection to hold the blog posts
Posts = new Mongo.Collection('posts');

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
	addPost: function(title, text){
		Posts.insert({
			title: title,
			text: text,
			created: new Date(),
			author: "Test",
			userId: Meteor.userId
		})
	}
});
