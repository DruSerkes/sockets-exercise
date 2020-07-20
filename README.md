# sockets-exercise

### What this project was about 

This project was an opportunity to get more comfortable with OOP while exposing me to the websocket protocol. The project came with an existing code base for an Express backend serving static css, JavaScript, and an html page. It also came with the starter implementation for a basic chat app, which included the logic for the Room (chatroom) and ChatUser classes. 

--- 

### What I did 

I was first tasked with reading and comprehending the entire codebase - a skill the curriculum reiterates will be essential for starting with practically any employer. Once I understood what I was working with, I implemented 4 new features. 

1. users in the chat room can get a private random joke from the [icanhazdadjoke api](https://icanhazdadjoke.com/api)
2. users can privately view a list of members in the chatroom 
3. users can send a private message visible to only them and another specific member 
4. users can change their username - this will alert the entire room of their name change  

The logic for these new features was implemented between the client side JavaScript, and the ChatUser class making use of methods defined on Room and itself.    

--- 

### What I learned 

I learned how to dynamically make basic use of the websocket protocol on both ends of the stack. I'm also getting more comfortable reading other peoples' code; this has made me more mindful of how I write my code (variable and function names, how I group logic, etc) so it can be more easily understood by another developer. 

I'm also still becoming more comfortable with OOP, so this opportunity to comingle different classes and make use of static and instance methods on other classes within each one has been beneficial as far as my understanding of how these objects can interact with one-another.    

--- 

### Looking forward

I would love to learn more about the websocket protocol and find use cases for it in future projects.
