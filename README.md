# ToDo List
##Problem Statement:
This project is aimed to create a ready to deploy Live TODO List management system.
It must have all the features mentioned below and it must be deployed on a server
before submission. There should be two separate parts of the application. A Frontend
developed and deployed using the technologies mentioned below and a REST API (with
realtime functionalities) created using the technologies mentioned below.
Frontend Technologies allowed - HTML5, CSS3, JS, Bootstrap and Angular
Backend Technologies allowed - NodeJS, ExpressJS and Socket.IO
Database Allowed - MongoDB and Redis


## Synopsis:

#### FRONTEND:
##### 1. User Management System
**SignUp** , **Login**  & **Forgot Password** page try to capture all functionalities for a user to manage his account on the website

User can fill in Personal Details on the SignUp page and create his account on the website post input validation. Country code is accepted as well as part of input. 

##### To do list management (single user) -
	a) Once user logs into the system, he can see an option to create a ToDo
	List
	b) User can create, a new empty list, by clicking on a create
	button
	c) User can add, delete and edit items to the list
	d) User can add sub-todo-items.
	
	e) User can mark an item as "done" or "open".
	f) User can see his old ToDo Lists, once logged in.

##### 3) Friend List -
	a) User can send friend requests, to the users on the
	system. Once request is accepted, the friend is added in user's
	friend list. Friends are Notified, in real time using notifications.

##### 4) To do List management (multi-user) -
		a) Friends can edit, delete, update the list of the user.
		b) On every action, all friends are notified, in real time, of what specific
		change is done by which friend. Also  all actions should be reflected in real time.
		c) Any friend can undo, any number of actions, done in past.
		 So,history of all actions is persisted in database.
		d) Undo action should happen by a button on screen, as well as, through
		keyboard commands, which are "ctrl+z" for windows .

##### 5) Error Views and messages - An error page has been created to handle each major error response
		(like 404 or 500) with a different page. 

##### 7. Innovations
	All Lists / Items / Sub-items are given on a single page .

##BACKEND:
#### Features
1. Route Authorisation - Checked by Middleware for presence and validity.
2. Routing is handled within user.
3. Controllers to handle core functionality. 
4. Following DB Models have been created : 
	- 	user - To Store User Details	
	-	auth - To Store Auth Token Details
	-	notification - To Store notifications and maintain history of changes
	-	otp - To Store OTP Details
	-   list - To store details of a list
	-   item - To store details of a item
	-   subItem - To store details of a subItem
5. Generic functionalities/utility methods have been built using libraries eg:
	-	checkLib - to validate string value
	- 	emailLib - to send email messages
	- 	generatePasswordLib - to generate/match hash password 
	- 	loggerLib - to log error/info
	- 	reponseLib - to design reponse object of apiresponse
	- 	redisLib - to detail redis functions
	- 	socketLib - to set up socket connection , to listen/emit socket events.
	- 	tokenLib - to generate/match auth token
	- 	validationLib - to validate inputs like email , password
	-   listLib - to have function related lists
	-   itemLib - to have functions related items
	-   subItemLib - to have functions realted subItems
	-   userLib - to have function related user
	-   functionLib - to have functions general file
6. Configuration Details are contained in appConfig file
	
## Technical Specifications:
	Technologies used are as following-
	Frontend : HTML, CSS, Jquery, Javascript, Bootstrap
	Bakcend : Nodejs,ExpressJS, Socket.IO 
	Databases: MongoDB, Redis

## Installation:

    	Complete code of this api has been uploaded to my github page and address is :
 
		https://github.com/rameshkmunjal/todolist
		
		Frontend Link : todo.bestbuddy.io
		Backend Link  : http://18.188.89.46:3000/api/v1
		Documentation Link : todo.bestbuddy.io/apiDoc.html, todo.bestbuddy.io/eventsDoc.html

			
## Contributors:

    1. Ramesh Kumar Munjal