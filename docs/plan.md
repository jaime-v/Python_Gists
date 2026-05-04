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

---

## More stuff

I was thinking of doing some things with AWS or Azure stuff, but I think I should
stick with the basics for a bit. Maybe in a later project

Corey Schafer's blog tutorial video series has user profile pics, maybe that would be
useful to learn and improve the app

# TODO:

Create additional functions for handling inside components, based on interactivity. These will 
differ based on component

e.g. Clicking the login button will set context to loading, call relevant service functions, set 
context based on the service function returns, then re-render the UI

Goal for now is to just get this app deployed and then we can do more stuff

- Manual Testing
- Deploy 

More stuff:

- Unit tests, integration tests, e2e Tests
- CI/CD
- Docker

## Additional features to add/do

Profile pictures with AWS S3 Object Storage (Corey tutorial)
Transfer ownership of snippets
Password management (Corey tutorial)
Refactor?
Experiment more with React stuff, e.g. passing children as props, expanding on custom hooks, 
diving more into context, etc.
