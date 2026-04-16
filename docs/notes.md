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

## Database things
Importing Base (declarative base) into other modules doesn't seem to work,
either because of creating multiple bases, or by calling without all models
Fix is to make the main.py file call an init function that is in db.py
This ensures that all of the models are loaded into the Base metadata

## Misc

URLs are like:  
http://localhost:<port>/?query=query_val#fragment  

Maybe try uv instead of pip in the future  

If moving venv, need to re-copy -- something is wrong if you just try to move it  

File structure generally has config stuff in the root folder  

Need to make backend/ a python package so that we can run uvicorn from root  
Need to make app/ a package so that imports can go through for other files  

For formatting, just running `:!black %` in neovim for now
But that's kind of cringe honestly -- manually running things -_-

example auth is:
johndoe
secret
