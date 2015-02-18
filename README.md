# Awesome List

Awesome list is a sample application that shows how to build a Meteor application from the ground up. It was designed to go along with the a presentation. It is meant to showcase some of the simple Meteor operations.

The application is a list of the people you personally believe to be the best in the world.

# Steps

Awesome list uses a step tutorial approach with tags. Tags will correspond to specific points in the lifecycle of the project. For instance 1.0 will correspond to the initial setup for the project folder with no other information. You can switch to a specific step at any time by using the git command: ```git reset --hard 1.0``` or, substitute the step you would like to move to instead of 1.0.

Steps with (i) next to them are informational and won't have specific tasks to complete. I don't suggest skipping the reading as they're key to the future steps. I promise I didn't add in any steps that you don't need.

## Pre-Requisites - Tech
You need Meteor, and Git.

* Meteor: http://www.meteor.com (Linux/Mac only)
* Git: http://www.git-scm.org (all platforms)

## Pre-Requisites - Knowledge

Before embarking on the journey that is Meteor I recommend doing some quick tutorials on the following technologies if you aren't already familiar with them. You don't need an expert understanding of these, but you may be a little lost without some basic knowledge.

* [jQuery](http://www.w3schools.com/jquery/) (events and selectors) [Handlebars](http://javascriptissexy.com/handlebars-js-tutorial-learn-everything-about-handlebars-js-javascript-templating/)
* [Mongo](http://docs.mongodb.org/manual/tutorial/getting-started/)

## 1.0 (i) You Better Start from the Start

Ok, you have a blank folder awaiting the wonderousness of your new meteor project. Lets fill it with something that improves upon nothing.

### 1.1 Let There Be Meteor

First thing to do is to create a new Meteor project. Kick it off by typing

```bash
meteor create awesome-list
```

in the console. This will cause meteor to create a brand new project in the folder awesome-list.

*Note:* If you are following along with the tutorial its best to do this before you init the git repository. Meteor doesn't like to create a project in an existing folder no matter how much you beg.

### 1.2 Run the Thing

Meteor will create a sample project for you that is completely setup to run when you do a create. So, lets run it. Move to the new awesome-list directory and type the following:

```bash
meteor
```

Thats all there is too it. When the console tells you meteor is ready go to http://localhost:3000 and see the results.

### 1.3 It Craves Structure

The base meteor project will put everything at the root initially. You'll quickly find that this is... not optimal. I suggest the following project structure:

```
awesome-list
 -> client
 -> server
 -> public
```

These folder names are special to Meteor and it will know that things in client and public should be served to the user, while code in the server folder is server-side only. This will let you easily differentiate between the different code without having to put ```if(Meteor.isServer())``` all over your code.

*Note:* If you'd like this to be done for you simply skip to the 2.0 step ```git reset --hard 2.0```

## 2.0 (i) A Data Model By Any Other Name

The heart and soul of Meteor is its data syncing and mini-mongo objects. For our list we need only very very simple data model. Lets build a collection of people, with the following model for a person:

```javascript
{
  name: newName,
  score: 0
}
```

### 2.1 A Collection of People? Sick...

Now that we know what a person looks like, lets create a collection to hold them. We will need to create the collection on both the server, and the client side.

Add the following to server/server.js (if it doesn't exist, create it):

```javascript
People = new Meteor.collection('people');
```

This will create the collection on the server (and mongo) and get it ready to sync to the client side. The client side code will look very similar.

Add the following to ```client/awesome-list.js``` (if there is anything else in that file, clean it up real quick):

```javascript
People = new Meteor.collection('people');
```

With just those two lines of code we have created a synchronized, reactive data store all the way from the client to the database. Whew. That was a lot of work for one step. Take a breath before moving on.

### 2.2 Get In There You big Furry Oaf, I Don't Care What You Smell!

Now that we have our "collection" of people all prepped and ready, its time to put some people in it. Meteor's mini-mongo objects use a query by example pattern like mongo itself. We won't dive into a lot of detail in this tutorial about those queries, but http://doc.meteor.com has really nice documentation on the various methods.

In any case, let's add a couple people to the collection using the insert method and passing in objects that are exactly like what we want saved:

```javascript
People.insert({name: 'Justin', score: 10000});
People.insert({name: 'Brad', score: 5});
People.insert({name: 'Dennis', score -1});
```

Where do you put these insert statements? That's up to you. You can add them to server.js if you like to have them run, or you can simply open the dev console on your page and plug them right into your console.

You'll notice the objects that we're passing match *exactly* what is in our data model. Its not important that the objects of a collection follow a specification, the most important thing is that you insert the actual object you want to save.

Check your work by bringing up on the dev console in your browser. Type the following to see all the records in people:

```javascript
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

```xml
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

```xml
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

### 3.2 Find()ing Nemo

Meteor allows you to bind content to your view layer through the use of Spacebars "helpers". These helpers are reactive functions that tie your rendering to your data. Declaring a new helper can be done with the following syntax: ```Template.{templateName}.helpers({});```

```javascript
Template.contents.helpers({
  topPeople: function () {
    return People.find();
  }
});
```

Here we're returning the result of People.find() which will return all of the people in our collection, (whether or not they like it). Returning the result of a find is the most common use of a helper, but there are plenty of others. More on that later.

The function for topPeople is reactive, meaning it will watch for changes to the People collection and automatically update any connected clients with the new information. Not bad for 4 lines of code, huh?

Now go back to your page in the browser (http://localhost:3000) do you have a list of a couple people now? You should, otherwise we're in trouble.

### 3.3 (i) You're One in a Million

You may have guessed that you won't always want every single person, which is what calling find() with nothing in it will get you. You can tell your collection which objects you want it to find, by giving it an object that looks like the ones you want. This style is generally referred to as "query by example". Let's look at a couple examples:

```javascript
//Find all people named Justin
People.find({name: "Justin"});

//Find all people with a score of 10
People.find({score: 5});

//Find all people named Justin who have a score of 10
People.find({name: "Justin", score: 10000});
```

Try some of these out. Go ahead. I'll wait.

...

...

Done? Great! Now put it back to the way it was with just a find(). Don't forget about selector objects though, we'll use them again later.

## 4.0 (i) Need More Innnppuuttt

We can now bind a find query to our document, so lets build on our knowledge of insert statements to get some input from the page. In order to get input we need to bind some events, but first we'll need a way to get some input.

### 4.1 I've Got a Blank Space Baby

Lets add a simple input box and a button to our page for creating a new user. This is just HTML with nothing special to it, so lets add these above our new list.

```xml
<template name="contents">
  <div>
    <input id="newPerson" /><button id="addPerson">Add</button>
  </div>
  <ol>
    {{#each topPeople}}
      <li>{{name}}: {{score}}</li>
    {{/each}}
  </ol>
</template>
```

Now we have the HTML its time to bind some events.

### 4.2 Bind Like Christen Grey

So you are really into this binding thing? Alright, let's do it!

Binding events in Meteor is done by using passing an object into the template.events method that represents the events. This will end up looking a like like your helper declaration, but with a special key. Let's use an example of binding creating a new user to the "Add" button.

```javascript
Template.contents.events({
  'click #addPerson': function () {
    var newName = $('#newPerson').val();
    People.insert(
      {name: newName, score: 0}
    );
    $('#newPerson').val('');
  }
});
```

OK, there is a lot going on here, so lets break it down.

```javascript
Template.contents.events({});
```

This tells Meteor that you want to bind the events in the object to the "contents" template. This is important because the event will not be registered in templates other than contents.

```javascript
{
  'click #addPerson': function(){}
}
```

The object we're passing into the contents.events method has a key of 'click .addPerson' this tells Meteor that you want to bind to the ```click``` event of the element with an id of ```addPerson```.

The first word, in this case 'click' matches with a jQuery event. The other words ('#addPerson') are jQuery selectors for the elements you want to bind to. If you are interested in the full list of available events check out the [jQuery Api Documentation](http://api.jquery.com/category/events/)

One final piece to look at, the body of the event.

```javascript
function () {
  var newName = $('#newPerson').val();
  People.insert( {name: newName, score: 0} );
  $('#newPerson').val('');
}
```
Here we're using jQuery to select the #newPerson input and get its value as ```newName```. Once we have that we build our new person by using the insert function. Since we want to be fair, we'll start the new person at a score of 0. Finally we clear out the value from #newPerson because we've consumed it.

### 4.3 Binding People Feels So Good

You should have everything you need to add more people to your "collection". Try putting six or seven of your favorite names in to help set up for the next couple steps.

## 5.0 (i) Let's Change the Score

So we have create, and retrieve (two of the holy CRUD operations), but its time to build a U on that baby. Let's talk about how to update your people.

### 5.1 Some People Are Just Better Than Others

We've got a hefty list of people now, its time to start showing our love (or lack thereof) for each of them. The first step is to add some buttons to the line with each of our people. One for adding to the score and one for taking away should be fine.

```xml
<li>
  <span>{{name}} : {{score}}</span>
  <button class="add">+</button>
  <button class="subtract">-</button>
</li>

```

Two lovely buttons. One for showing abject love, and one for rearing your unbridled hate. What could possibly go wrong?

### 5.2 Weekend Update

Now that we've got buttons its time to add another event to our "events" object. This time we want to bind to the ```add``` and ```subtract``` classes, instead of ids, since there will be many of these buttons on the page.

Let's kick things off with add:

```javascript
Template.contents.events({
  'click #addPerson': function () {
    var newName = $('#newPerson').val();
    People.insert({name: newName, score: 0});
    $('#newPerson').val('');
  },
  'click .add': function(){
    People.update({_id: this._id}, {name: this.name, score: ++this.score});
  }
});
```

The click binding should look familiar, we're just swapping in a class instead of an id. But what's with that update statement? How does that thing work?

```javascript
People.update({selectorObject}, {replacementObject})
```

The update method takes two parameters, the first is a query selector object, the second is a replacement object. We talked about selector objects back with our original find, but feel free to look back at step 3.2 for a refresher if you like.

The selector object tells your collection which objects you want to update. Any objects that match your selector will get changed by the statement. In this case we want everything with a specific mongo id, so we give it ``` {_id: this._id} ```. id is an attribute created by mongo when an object is inserted that is guaranteed to be unique.

The second part, the replacement object tells your collection to replace the items it finds with the one you are providing. This is a complete overlay of the object (except the mongo id). In this case we're going to change the object to be

```javascript
{name: this.name, score: ++this.score}
```

In other words, we're going to keep our name the same, but add one to the score.

### 5.2 (i) A Little Bit of This

What is God's name is "this"? ```this.name```, ```this._id```, ```this.score```?! That's crazy business.

If you know anything about javascript you know "this" is a tricky reference. For Spacebars events "this" will refer to what is in the current Spacebars context. We need to take a look at the HTML to figure out what that will be.

```xml
<ol>
  {{#each topPeople}}
    <li>
      <span>{{name}} : {{score}}</span>
      <button class="add">+</button>
    </li>
  {{/each}}
</ol>
```

Our event is bound to the "add" button, and its inside an {{#each}} tag. That means "this" will point to the current person from "topPeople" we are looking at.

Another way to look at it is that ```this.name``` in javascript will match the same reference as {{name}} in the handlebar template. It may be a little confusing at first, but using this pattern is a great way to avoid having to use jQuery selectors to get the right values from the DOM. You also won't have to add hidden inputs or data attributes to hold information you don't want to display.

Add is now bound and ready to go. Try it out. See how high you can get your own score. That's right. I know you added yourself to the list. Such a bad person...

### 5.3 Fear Leads to Anger, Anger Leads to Hate...

Time to add our button to take points away from people. The button and event will be almost exactly the same as add, but we're going to make a small change to the update statement. Let's start with the HTML as we always do.

```xml
<ol>
  {{#each topPeople}}
    <li>
      <span>{{name}} : {{score}}</span>
      <button class="add">+</button>
      <button class="subtract">-</button>
    </li>
  {{/each}}
</ol>
```

Easy enough. Added a button, now lets add our new event.

```javascript
Template.contents.events({
  'click #addPerson': function () {
    var newName = $('#newPerson').val();
    People.insert({name: newName, score: 0});
    $('#newPerson').val('');
  },
  'click .add': function(){
    People.update({_id: this._id}, {name: this.name, score: ++this.score});
  },
  'click .subtract': function(){
    People.update({_id: this._id}, {$set: {score: --this.score}});
  }
});
```

Our update statement is a little different now. We're using the $set syntax for mongo, which tells it we want to update just one field (score) instead of replacing the entire object. This is functionally the same thing as what we're doing for add, just another way to go about it.

Head back to your browser and try out your subtract buttons. Is it dragging them into a karmatic nightmare? Great!

### 5.4 And the Winner Is...

The scores are moving up and down... but the list isn't reordering. That stinks. I want the person with the highest score to be on top! How do I do that?

The answer is, by sorting the result of our find. Let's take a look:

```javascript
Template.contents.helpers({
  topPeople: function () {
    return People.find({}, {sort: {score: -1}});
  }
});
```

We still want to search for all records, so we pass in an empty object as the first parameter. But we want to do something special with the result, which is what our second argument is for. The sort object tells mongo how to sort the results. -1 means descending, 1 means ascending. So in our example we'll be sorting by score from highest to lowest.

Check it out in the browser. Who is winning? Should they be?

## 6.0 (i) It's the End of the World As We Know It

It's time to add the D to our crud-iness. Let's blast some people completely off the list for all eternity.

### 6.1 X Marks the Spot

Should be routine by now, if we want to add an event the first stop is HTML. Let's add our final button.

```xml
<ol>
  {{#each topPeople}}
    <li>
      <span>{{name}} : {{score}}</span>
      <button class="add">+</button>
      <button class="subtract">-</button>
      <button class="remove">x</button>
    </li>
  {{/each}}
</ol>
```

Check your browser to ensure you have a pretty x button, because you should.

6.2 The Execution

Now we bind the event to the remove buttons. And guess what function we'll use from our collection? Yup. It's remove.

```javascript
Template.contents.events({
  'click #addPerson': function () {
    var newName = $('#newPerson').val();
    People.insert({name: newName, score: 0});
    $('#newPerson').val('');
  },
  'click .add': function(){
    People.update({_id: this._id}, {$set: {score: ++this.score}});
  },
  'click .subtract': function(){
    People.update({_id: this._id}, {$set: {score: --this.score}});
  },
  'click .remove': function(){
    People.remove({_id: this._id});
  }
});
```

Pretty simple. We use the same selector object we did for the other binds, but we call remove. Play around with your new ability to destroy a whole person with a click of a button. Invigorating, right?

## Head (i) That's a Wrap

Now you can create, retrieve, update, and delete people from your list. You should have an list of people that orders automatically based on votes, and simple buttons to change their scores.

You know how to use Spacebars templates, and bind events to them. That's all you need to start your very own basic Meteor project. I hope you enjoyed the tutorial!
