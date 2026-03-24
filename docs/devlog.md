# Devlog

Log of what I've done for this project

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
