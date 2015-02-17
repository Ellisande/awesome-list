# Awesome List

Awesome list is a sample application that shows how to build a Meteor application from the ground up. It was designed to go along with the a presentation. It is meant to showcase some of the simple Meteor operations.

The application is a list of the people you personally believe to be the best in the world.

# Steps

Awesome list uses a step tutorial approach with tags. Tags will correspond to specific points in the lifecycle of the project. For instance 1.0 will correspond to the initial setup for the project folder with no other information. You can switch to a specific step at any time by using the git command: ```git reset --hard 1.0``` or, substitute the step you would like to move to instead of 1.0.

## Pre-Requisites
You need Meteor, and Git.

* Meteor: http://www.meteor.com (Linux/Mac only)
* Git: http://www.git-scm.org (all platforms)

## 1.0 You Better Start from the Start

Ok, you have a blank folder awaiting the wonderousness of your new meteor project. Lets fill it with something that improves upon nothing.

### 1.1 Let There Be Meteor

First thing to do is to create a new Meteor project. Kick it off by typing

```
meteor create awesome-list
```

in the console. This will cause meteor to create a brand new project in the folder awesome-list.

*Note:* If you are following along with the tutorial its best to do this before you init the git repository. Meteor doesn't like to create a project in an existing folder no matter how much you beg.

### 1.2 Run the Thing

Meteor will create a sample project for you that is completely setup to run when you do a create. So, lets run it. Move to the new awesome-list directory and type the following:

```
meteor
```

Thats all there is too it. When the console tells you meteor is ready go to http://localhost:3000 and see the results.

### 1.3 It Craves Structure

The base meteor project will put everything at the root initially. You'll quickly find that this is... no optimal. I suggest the following project structure:

awesome-list
 -> client
 -> server
 -> public

These folder names are special to Meteor and it will know that things in client and public should be served to the user, while code in the server folder is server-side only. This will let you easily differentiate between the different code without having to put ```if(Meteor.isServer())``` all over your code.

*Note:* If you'd like this to be done for you simply skip to the 2.0 step ```git reset --hard 2.0```

## 2.0 A Data Model By Any Other Name

The heart and soul of Meteor is its data syncing and mini-mongo objects. For our list we need only very very simple data model. Lets build a collection of people, with the following model for a person:

```
{
  name: newName,
  score: 0
}
```

### 2.1 A Collection of People? Sick...

Now that we know what a person looks like, lets create a collection to hold them. We will need to create the collection on both the server, and the client side.

Add the following to server/server.js (if it doesn't exist, create it):

```
People = new Meteor.collection('people');
```

This will create the collection on the server (and mongo) and get it ready to sync to the client side. The client side code will look very similar.

Add the following to ```client/awesome-list.js``` (if there is anything else in that file, clean it up real quick):

```
People = new Meteor.collection('people');
```

With just those two lines of code we have created a synchronized, reactive data store all the way from the client to the database. Whew. That was a lot of work for one step. Take a breath before moving on.

### 2.2 Get In There You big Furry Oaf, I Don't Care What You Smell!

Now that we have our "collection" of people all prepped and ready, its time to put some people in it. Meteor's mini-mongo objects use a query by example pattern like mongo itself. We won't dive into a lot of detail in this tutorial about those queries, but http://doc.meteor.com has really nice documentation on the various methods.

In any case, let's add a couple people to the collection using the insert method and passing in objects that are exactly like what we want saved:

```
People.insert({name: 'Justin Dragos', score: 10000});
People.insert({name: 'Brad Westfall', score: 5});
People.insert({name: 'Dennis Reams', score -1});
```

Where do you put these insert statements? That's up to you. You can add them to server.js if you like to have them run, or you can simply open the dev console on your page and plug them right into your console.

You'll notice the objects that we're passing match *exactly* what is in our data model. Its not important that the objects of a collection follow a specification, the most important thing is that you insert the actual object you want to save.

Check your work by bringing up on the dev console in your browser. Type the following to see all the records in people:

```
console.table(People.find().fetch());
```

### 3.0 The View From The Spacebar

Now we have a collection of people, they are just begging to put lotion on their ski... I mean be viewed! In order to get our new information on the page we need to address some of the quirks of Meteor's view framework.

All the client side code for Meteor is compiled into one file, and minified. This has little effect on your CSS and Javascript (although be very careful with global variables), but HTML has some issues.

Since all of our HTML files will get turned into one minified file we need to follow some rules. Here are the main points:

* In all of your HTML files you may have only one <body> tag.
* In all of your HTML files you may have only one <head> tag.
* Anything not in a <body> or <head> tag must be a <template> tag.

Meteor uses a Handlebars varient called Spacebars for all its templating. Your application will mainly comprised of their Spacebars templates. Here is a simple example of what you're basic HTML might look like:

```
<head>
  <title>Awesome-List</title>
</head>

<body>
  {{> contents}}
</body>

<template name="contents">
  <h2>Hello world!</h2>
</template>
```

We'll look at nesting templates later, but for now this should give you an idea of how they work. Remember, you can have multiple HTML files, but only one of them can contain a <head> and <body> tag.

### 3.1 Let's Get A Little Loopy

Quirks out of the way, its time to add displaying our list to the main page. Let's start by modifying our "contents" template to loop through our collection and display each. If you are familiar with Handlebars this will be a snap for you, if not the syntax may look strange, but its just a for loop.

```
<template name="contents">
  <ol>
    {{#each topPeople}}
      <li>{{name}}: {{score}}</li>
    {{/each}}
  </ol>
</template>
```

Loop through the collection "topPeople" and for each, render an <li> tag with their name and score.

If you check your page now you should see nothing in the list. That's because we haven't actually created the "topPeople" array yet. That'll be our next step.

### 3.2 None Can Avoid Your Gaze

Meteor allows you to bind content to your view layer through the use of Spacebars "helpers". These helpers are reactive functions that tie your rendering to your data. Declaring a new helper can be done with the following syntax: ```Template.{templateName}.helpers({});```

```
Template.contents.helpers({
  topPeople: function () {
    return People.find();
  }
});
```

Here we're returning the result of People.find() which will return all of the people in our collection, (whether or not they like it). Returning the result of a find is the most common use of a helper, but there are plenty of others. More on that later.

Now go back to your page in the browser (http://localhost:3000) do you have a list of a couple people now? You should, otherwise we're in trouble...
