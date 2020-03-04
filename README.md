N.E.T Lesson Plan Server
=========================
Be Prepared in the Classroom
-----------------------------

## Technologies
* Node.js
* JWT

### Live Link
https://net-lesson-planner-client.now.sh/

### Github Link - Client
https://github.com/boopies/net-lesson-planner-client

### Github Link - Server
https://github.com/boopies/net-lesson-planner-server

## API Info
This is API to retreive information from the database held on the servers. 
https://secret-hollows-53640.herokuapp.com

- /api/categories
- /api/activities
- /api/users
- /api/auth
- /api/savedlessons

## Categories Endpoint

The categories endpoint supports GET only.

Get all the categories
- GET /api/categories

Get the name of one category
- GET /api/categories/{category-id}

## Activities Endpoint

The Activities endpoint supports GET, POST, and PATCH.

Get all the Activities
- GET /api/activities

Get a specific activity
- GET /api/activities/{activity-id}

Upload a new activity - This this is protected
- POST /api/activities

Update an exisitng - This this is protected
- PATCH /api/activities/{activity-id}


## SavedLessons Endpoint

The Activities endpoint supports GET, DELETE, POST, and PATCH.

Get all the Savedlessons
- GET /api/savedlessons

Get a specific activity - This endpoint is Protected
- GET /api/savedlessons/{savedlesson-id}

Upload a new activity - This is protected
- POST /api/savedlessons

Update an exisitng saved lesson - This this is protected
- PATCH /api/savedlessons/{activity-id}

Delete an exisitng - This this is protected
- DELETE /api/savedlessons/{activity-id}

## Users Endpoint

The Activities endpoint supports GET, and POST.

Get all the Users
- GET /api/users

Get a specific user info
- GET /api/users/{username}

Create a new user/
- POST /api/user

## Auth Endpoints

The Auth endpoint supports POST and 

Login and Create an bearer token
-POST /api/auth/login