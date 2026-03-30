# Plan

Full-Stack project with everything (i think this is everything)

- Design
- Frontend (React TypeScript)
- Backend (FastAPI Python, Auth)
- Database (PostgreSQL)
- Unit, Integration, E2E Testing
- CI/CD
- Docker
- Deploy (probably on render or something)

Create a personalized GitHub Gists  
User can log in and see a list of code snippet previews  
User can click a code snippet to see the full snippet, description, and other information  
User can create/edit/delete code snippets  
Code snippets include:  

- Title
- Language
- Description
- Code
- Id
- Creator

---
## More stuff
I was thinking of doing some things with AWS or Azure stuff, but I think I should 
stick with the basics for a bit. Maybe in a later project  

Apparently I should be making 3 schemas (one for input, one for db, one for API response)
for each item, so Users and Snippets

UserIn

1. username
2. email
3. plain password

UserDB - might not need this since its just the table

1. ID
2. username
3. email
4. hashed password
5. snippets user owns

UserOut

1. username
2. email
3. snippets user owns

SnippetIn

1. title
2. language
3. description
4. code

SnippetDB

1. ID
2. title
3. language
4. description
5. code
6. owner
7. creation date
8. last updated date

SnippetOut

1. title
2. language
3. description
4. code
5. owner
6. creation date
