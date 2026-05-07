# Devlog

Log of what I've done for this project

## May 6, 2026
Started implementing the edit buttons for each field on user profile and snippets, but 
realized that it would be super complicated and annoying, so I'm opting for just one edit 
button that will bring up a modal to edit the entire profile/entire snippet. It's simpler and 
probably better for the scope of this project.

Created the user edit modal and it seems to be able to change user data and access the api, but 
the currentUser context stil sees the old user and won't update, so I need to look into that

## May 5, 2026
Got the user creation page functionality done

Currently struggling with rendering the public vs private user pages

Had to do a few things:

1. Create a separate route to get user by username, with a different route
    - Tried to create one route that accepted both int and str, but didn't work
    - Ended up creating two separate routes and it seems like the best solution
2.
    - useEffect for running logic when search params or current user changed

Now, I need to finish up the page by getting and displaying the user's snippets, but having 
struggles with that as well

I need to get user by username, then get all snippets that where the owner's username matches 
the user's username, but if I try to do models.Snippet.owner.username, I get a 500 server error 

Getting by user id works because the snippet has the owner's id stored as well, so maybe I 
should just add another foreign key for owner_username?

It sounds like a bad idea though, maybe I should have the response include the id and username. 
That way I can just query for the user object by username, get the snippets that match the user 
id, then move along just fine

Ended up just returning user id in responses and it works now. Idk how to feel about returning 
user id though. My intuition was that id is sensitive, but I guess not since you can't really 
access much with just the id. To access more sensitive information, you would need the token

But google says that I should probably not be showing the user id, only using it internally
So maybe I should be using a public_id with uuid and a separate id for internal use? I'm not 
sure what the best method is


## May 4, 2026
Made a basic login page with context, handling submission, form stuff, etc.

Made a basic snippet creation page, but I'm not sure why my creation object is erroring...

Also not sure how much verification/validation I should be adding

Also I should probably make the form components controlled

Functionality seems to work though

I just spent 30mins trying to figure out why my sorting wasn't working, at first thinking it 
was because my function was trying to sort the snippets without waiting for the loading state, 
so I added that, but it still didn't work, so I did a bunch of console.logs and found that the
response object differs from the object type, so it was registering as undefined all the time.

All because I decided to change the models from using snake_case to camelCase. But at least I 
know now.

And the snippets display page works now which is dope.

Also got the snippet details page working a bit.

## May 3, 2026
For some reason, manually setting the header in login to application/x-www-form-urlencoded 
makes it send something weird and we get a 422 error, and removing the header makes it okay... 
Weird

Auth seems to work on the frontend now, just need to get token and pass it into the 
fetch request. It feels a bit awkward copy-pasting getToken() method into every protected 
route though, maybe I should improve on that somehow... I think this is where I need context
and also service for auth

I think I understand what I should be going for now, will update plan and hopefully finish the 
frontend soon

Did some Auth stuff, and got the basic functionality working with hardcoded data, now I need 
to actually do the frontend and create pages and components and stuff that use the functionality

## May 2, 2026
Frontend work on calling the API

Some login confusion with managing token and stuff, specifically with context and 
what Corey has in his tutorial

Created some hardcoded data and buttons for testing out the API from the frontend

## April 30, 2026
Trying to figure out how to use Outlet and different routes and such

Updated Database Snippet model to have unique titles

Wondering how to work with logged in users, displaying different snippets, finding things using
snippet id, title, users by username, id, etc.

Created basic Snippets display page with useReducer for filtering

Probably need context/hooks for users and authentication so we can check user profiles and if 
a user is logged in

Context is not contexting to other pages for some reason...

I should probably be working on functionality before doing the display stuff though, I'll get on
that now

I basically just need to just create UI for calling my API

## April 29, 2026

Created a basic frontend structure with hardcoded data, pages, and basic components

A bit confused as to how to display the different pages because I want the logged in user
to see different actions for their own snippet and profile

Edited devlog and notes formatting so I can actually read it

Did a basic API fetch from frontend, created context, custom hook, and more stuff for various components

## April 27, 2026

Created fresh database and migration file

## April 26, 2026

Skimmed remaining Corey videos (S3, Testing, Deployment, Docker)

Created frontend setup (literally just the template command lol)

Did some drawing for frontend

## April 24, 2026

Started working with Alembic for database migrations

The file is different from the example though because it expects an existing database

Probably need to revisit in the future and start a fresh database so that the initial

Alembic migration file will create the tables

Currently works in the dev environment though, manual testing is clean

Also adjusted UserUpdate schema to have min_length for password changes

## April 23, 2026

Added authorization with CurrentUser and put it into various routes that require protection

Fixed the snippet delete route (idk how I didn't see it)

Tested all routes, looks good

## April 21, 2026

Added a few extra pieces to the routes, supposedly for eager loading when we need to access
the relationship in the table and put it into our response

Imported exception handlers, should probably make an exception handler function like Corey

Need greenlet for SQLAlchemy's async mode

Switched to psycopg3 instead of psycopg2 because of async

Modified routes to use eager loading to work with async

Backend is back up and running again!

Fixed an issue where user can be updated with an invalid email string (schema issue)

All CRUD seems to work

Authentication seems to work

## April 20, 2026

Authentication uses pwdlib[argon2], pyjwt, and pydantic-settings

Added in Authentication so users get a json web token

Adjusted models to use mapped and mapped_column

Adjusted schemas to better reflect responses, have more validation checks, modern structure

Adjusted routes for validation

Did updates according to Corey Schafer videos (which ended up being a lot)

## April 17, 2026

More video watching

Can probably get work done tomorrow, gonna start with cleaning up the routes

Then we can move on to database stuff, using async, authentication and authorization

Learned that using Optional[type] is not good and using type | None is preferred

Okay I'm getting bored of just watching videos

I'll go back to the videos if I need help

## April 16, 2026

Watching a bunch of Corey Schafer videos because his FastAPI tutorial seems really good
so I'll watch all of it and take some notes and then probably get back on this project later

Maybe like 2-3 days

## April 15, 2026

Did some routing refactoring and tested user routes

Fixed the database not actually creating tables

Bug occurred for one of two reasons

1. Maybe the Base we imported wasn't the same -- users was already created, so not sure
2. Maybe the create_all function was being called before all the models were loaded

Either way, creating an init function and calling it in main.py was the solution

All CRUD operations seem to work

Bit of a wacky thing though -- since we expect SnippetOut response to include user, we
get errors when there is no user, but PSQL can default it to null in the database so
it ends up working still

Should fix this in the long run, but it works for now

Also added the timing middleware from the Traversy Media video

## April 14, 2026

Done my classes, so going to be working on this finally wooo

Restructured the directories because they were ugly and debugged structure issues again

## March 29, 2026

Another planning day to really flesh out what I did yesterday

Commented out some sample code from devsheets and docs

Made the models and schema for my own project and renamed them for clarity

Moved models into their own file

## March 28, 2026

Just a bit of work today, no coding at all

Just drew out some stuff and modified plan.md file

## March 25, 2026

Went through the FastAPI docs for security, just need to apply it to my own work now

## March 23, 2026

Created database

Imported some more stuff like python-dotenv and passlib

Tried to do password hashing with bcrypt

Failed on the password hashing, might just need to look at docs for that

Currently fails because apparently password cannot be longer than 72 bytes or smthn

Gonna need to look into this

Created routes for CRUD operations on database

All of them work except PUT method

I think database connection is secure? Have a fallback database just in case

TL;DR:

1. Created database, did 3/4 CRUD operations
2. Need to hash passwords correctly
3. Need to update correctly

## March 22, 2026

Did a bit of PSQL stuff and now I can make databases, so now I need to connect a database,
send and store information, and then read information

## March 21, 2026

Watched a Tech With Tim video on how to do things (Learn Fast API with this ONE project)

Made new files for better code structure (db.py and schemas.py)

Learned that everything should be done in the virtual environment, I was trying to
run the backend without activating the virtual environment, so it couldn't find the
sqlalchemy and psycopg2 modules

Figured out how to actually use postgresql -- Working on figuring out command line stuff

## March 18, 2026

Followed the fourth section of the devsheets for Database Integration

Followed some of the docs for SQL

Need to figure out what each thing is, when it's used, and what I need for it

Also need to figure out how to create the database and test methods/routes

## March 17, 2026

Followed the third section of the FastAPI devsheets "Dependencies & Security"

Looked at the fourth section "Database Integration", but didn't do anything yet

## March 16, 2026

Followed the first section of the FastAPI devsheets "Getting Started"

Followed the second section of the FastAPI devsheets "Req & Res Models"
