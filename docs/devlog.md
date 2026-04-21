# Devlog

Log of what I've done for this project

## April 20, 2026
Authentication uses pwdlib[argon2], pyjwt, and pydantic-settings
Added in Authentication so user's get a json web token
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
So I'll watch all of it and take some notes and then probably get back on this project later
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
Created database, did 3/4 CRUD operations
Need to hash passwords correctly
Need to update correctly

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
