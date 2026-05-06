# Notes

Used for things that I'm doing, things that I should know, and things I will
hopefully memorize in the future

References:
Traversy Media FastAPI crash course
Devsheets.io/sheets/fastapi
FastAPI Docs
Corey Schafer FastAPI Tutorial Playlist

## Setup

### Create and Activate Virtual Environment

`python3 -m venv .venv`
`source .venv/bin/activate`
`(.venv) deactivate`

### Install Dependencies

devsheets.io recommendation for minimal
`pip install fastapi "uvicorn[standard]"`

devsheets recommendation for all (using this)
`pip install 'fastapi[all]'`

DB stuff
`pip install sqlalchemy psycopg2-binary`

.env
`pip install python-dotenv`

Password hashing -- not working :/ (Not using this because it's old and bald)
`pip install "passlib[bcrypt]"`

Security (JWT and password hashing)
`pip install pyjwt "pwdlib[argon2]`

Create requirements.txt file
`pip freeze > requirements.txt`

### Run

`uvicorn main:app --reload`
`fastapi dev main.py`
Then go to localhost:8000 and/or localhost:8000/docs
It must be run inside of the virtual environment (backend directory)

Check `which uvicorn` and `which python` and they should be the same
If one of them is global or something (uvicorn) then you need to run `python -m uvicorn ...`
Or just reload the venv

### Git

If many files are being tracked that we don't want to be tracked, run this:

```
git rm -r --cached .
git add .
git commit -m "message"
```

## Security things

JSON Web Tokens and Argon2 for security
JSON Web Tokens contain

- a header with algorithm and type
- a payload with data and expiration
- a signature, proving that the token wasn't tampered with
  All 3 parts of base64 encoded and separated by dots

Not using .env directly because pydantic-settings is supposedly better

401 means not authenticated
403 means authenticated, but cannot take an action
It's the difference between "you need to log in" and "you are not allowed to do this"

## Database things

Importing Base (declarative base) into other modules doesn't seem to work,
either because of creating multiple bases, or by calling without all models
Fix is to make the main.py file call an init function that is in db.py
This ensures that all of the models are loaded into the Base metadata

Generally, create_all is bad because it only creates tables if they do not exist
It's fine in small cases, but if we ever have an additional field that is being added, we can't
just delete and recreate everything from scratch
So we need to have a migration system in place

.scalars().first() returns either the first object or None if there are no matches

im not sure what selectinload does, but Corey does it with routes for rendering
Apparently it's necessary for routes that normally use lazy loading, meaning that we need
to explicitly load something if we want to use it (eager loading)
Lazy loading requires running a synchronous query in an async context, so need eager loading
if we want to use async and want to access relationships in the database
Again, this is just used in the server side rendering routes in the tutorial
attribute_names=["rel"] in the db.refresh() is important for eager loading as well when
refreshing the database

> Saw this error when testing routes before, we needed to load the User for snippets

greenlet for async with sqlalchemy

## Alembic

We are going to use Alembic for database migrations, it basically works like a version control
for the database
Migrations will track schema changes over time, apply changes safely, think of each migration
file as a git commit for the database, recording what changed and moving forward or backward

pip install alembic
alembic init -t async alembic (async template and the directory where migration files live)

alembic.ini - remove database.url because we are setting it programmatically
alembic/env.py - import models, settings, Base (in that order)
Need to make sure that our models are registered in Base metadata, otherwise Alembic won't see it
Also need to set database url, and target metadata

So i think the way this works is that Alembic generates migrations by comparing the current
database to the models we give it. Alembic finds the changes, and generates the migration

`alembic revision --autogenerate -m "message here (initial schema, whatever)"`

This creates the migration file, but doesn't apply anything to the database yet

Upgrade and Downgrade are for applying and reverting changes respectively

The file looks a bit different because the database was already created...

Might want to look into that because we wouldn't want to just alter the table, we would
want to actually create it

`alembic upgrade head`

Will run the upgrade up to the latest version (head)

`alembic current`
Checks the current state of alembic

`alembic downgrade -1`
Goes back by one migration, in case you make mistakes

`alembic history`
Displays history

When adding a new column to an existing table, we need to (or should, not necessarily need to)
add a server_default value otherwise it will probably be set to NULL, which could cause issues

`likes: Mapped[int] = mapped_column(Integer, default=0, server_default="0")`

Note that server_default is a string

Setting called "compare type" that we might want to add to alembic/env.py
In older version defaults, Alembic doesn't detect column type changes in autogenerate
Supposedly it is True by default now

When working with migration files, we don't want these on prod
We generate them locally, commit them, then prod will just upgrade head

### Blank migration file

For some reason the tables didn't generate in the tutorial, so Corey goes over what to do
Apparently it's because he was running the app before removing create_all, so there was
nothing to change

I'll write notes on this in case I need it

Drop everything from existing database, every database has a default schema called public, which
is where all tables go unless otherwise specified

dropping and recreating it will effectively recreate the database without having to delete the
entire database -- the quickest way to wipe all the tables from an sql database

`psql -U <user> -d <database> -c 'DROP SCHEMA public cascade; CREATE SCHEMA public;'`

Delete the empty migration file and the pycache file
Rerun the migration file creation

## Structure things

I think how it works is we run from whatever directory .venv is in
or maybe it's the root directory

But either way, we need to access modules via app.<module> and we can access
things that are inside the root backend directory with just the name, like config

## Async vs Sync

normal def functions are spawned in a separate thread pool apparently, so it doesn't block
the main thread

async functions are run on the main event loop, so it's somehow more efficient and requires us to
await for I/O

so async should be done with things that require I/O, like database reading and similar

Apparently psycopg2 doesn't support async and I should use asyncpg instead

I'm going to use psycopg 3 because it's what Corey uses in the tutorial and apparently it's
good for both async and sync development

## FastAPI Router

Can put prefixes inside main rather than the router, I like the prefix inside the router though

## Routing

If multiple routes have the same path and method 
e.g. two paths with /{variable}, then FastAPI will try to execute the first one, no matter what

If there are two routes with the same path and the same method, you need to create a separate 
route with a different path

In this case, we need to get user by user id with /{user_id} and also a different path to get 
user by username with /username/{user_username}

If we don't separate them, then it will always default to the first one resulting in 422 
(name in id field) or 404 (id in name field)

## Pagination

Useful for scaling, we can use query parameters for skip and limit, so we don't load all
of the data at once

Will probably add this later on, better to do it manually for learning

## AWS S3

Use boto3 for development with AWS

Lots of copy/paste, but the gist of it is that we need to make async wrappers and just use S3
configuration stuff that can be done by just clicking around on the website with the bucket

## Testing

We only need these in development, so install as dev depenedencies

- Pytest for testing Python
- Moto[s3] for testing S3

Corey does a lot of config and copy/paste here
Pytest -s and -v flags are good

## Deployment

There's a lot of info in the Corey videos on deploying, super useful to know about security
Neon for creating the database and connecting

## Misc

Annotated is for type safe dependencies
`func (db: Annotated[Session, Depends(get_db)]):`
Before running the function, call get_db and pass it in as the db parameter

URLs are like:

> http://localhost:<port>/?query=query_val#fragment

Maybe try uv instead of pip in the future

If moving venv, need to re-copy -- something is wrong if you just try to move it

File structure generally has config stuff in the root folder

Need to make backend/ a python package so that we can run uvicorn from root

Need to make app/ a package so that imports can go through for other files

For formatting, just running `:!black %` in neovim for now

But that's kind of cringe honestly -- manually running things -\_-

### For later projects

- Later projects should use the new stuff:
- Migrate to postgresql 18, "psycopg[binary]" instead of psycopg2-binary
- Also use uv instead of pip
- Bunch of other stuff

testuser
user@example.com
testpass1
id == 2

## React Stuff
Context is like having an object or set of values taht can be passed around the app, without 
needing to prop drill. We are basically wrapping a section of the application with values 
and we can get those values with useContext()

Custom Hooks are reusable pieces of logic in the application

useReducer is cool

Really it's just a bunch of notes in the form of comments, maybe I should move those here

## useEffect in UserProfilePage (Rendering different profiles)

When creating the UserProfilePage, we broke down the logic of what is supposed to happen in 
the component, and also figured out when it was supposed to happen.

Ended up with a useEffect that would check if currentUser is the profile we want, if not then 
attempt to fetch the user by username, and if there is no user, then set profile to null. This 
effect should be rerun every time the username in search params changes, or when the currentUser 
changes. Struggled on this a lot because... i'm not sure honestly. It seems so obvious now 
looking back at it

### THOUGHT PROCESS ABOUT CONTEXT, SERVICES, AND HOOKS:
I need to find a way to pass the current user around, and also track if there is a user logged 
in. Services should be handling the login, logout, get current user, etc. functions. Context
is for the components, so it should be separate. Components will see context and render 
differently based on if there is a user logged in or not. Other service modules don't use
context, they just import the other services... 

So that means context and service actually don't interact with each other at all? Not exactly 
because I create my snippets UI state using my init hook, then I pass those values around 
with context. So context is just saying "component has these values if it needs them", custom 
hooks (at least for initializing) are saying "we create the context values here", and services
are saying "here's how the logic works". So I should start off by creating the state of the 
current logged in user (null), and the logged in status (false). This is context. Then we can 
initialize with a custom hook, if there is a token already present. Then any event that calls 
the AuthService should then modify the context value we have. So services shouldn't modify 
context, but context depends on values that the service returns, it's just managed with things 
like setState.

I probably could have just reviewed the code I had for Snippets to figure out what I was doing
but I guess it worked out


## TypeScript
keyof typeof is used for extracting keys of an object

`<string> as keyof type of <object>`

Although, it uses the as keyword, so i'm not sure how good it actually is

Used a discriminated union in the display options reducer, it's not necessary after cleaning it
up a bit, but it seems good to use. Just in general, I can probably just useState with a single
object, but I haven't used useReducer so I thought I would do it



## Frontend and Backend
Should I be sending user id in UserPublic responses? probably not

Make sure Frontend and Backend types/models/whatever have exact same naming, or you manually 
translate between the response and the objects we want

### THOUGHT PROCESS ABOUT FETCHING USER BY USERNAME AND DISPLAYING ON FRONTEND
My current thought process is to get the user profile based on username. If the current user has 
the same username as the one we are searching for (user is looking at their own profile), then 
we render the private profile page. Otherwise, we render the public profile page of the target 
user. Problem is that I don't have a list of users to grab from, so I can't just filter. So I 
need to fetch the user from the API by username and also fetch the snippets once I have the user.
