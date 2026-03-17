# Notes

Used for things that I'm doing, things that I should know, and things I will
hopefully memorize in the future

References:
Traversy Media FastAPI crash course
Devsheets.io/sheets/fastapi

## Setup

### Create Virtual Environment

`python3 -m venv .venv`

### Install Dependencies

devsheets.io recommendation
`pip install fastapi "uvicorn[standard]"`

Create requirements.txt file
`pip freeze > requirements.txt`

### Run
`uvicorn main:app --reload`
Then go to localhost:8000 and/or localhost:8000/docs

### Misc

URLs are like:
http://localhost:<port>/?query=query_val#fragment
