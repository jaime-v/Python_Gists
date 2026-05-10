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

1. Controlled forms
2. Styling
3. Debugging
4. Manual testing dev
5. Deploy
6. Manual testing prod
7. Refactor

in theory i can finish this week (famous last words)

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
Handle file uploads
Create a mini text editor

## Styling

- App Header
  - NavBar (Links on left, profile on right)
- App Footer
  - Standard footer stuff

- Create
  - Title
  - Dropdown for Language
  - Description box
  - Big text area for code

- Discover (Snippets display)
  - Display Header
  - Profile + Snippet Display
    - Profile, Title, Description, Creation Date all in one header
    - Big text area for code

- Profile Pages
  - 3/4 of the page is snippet, 1/4 is profile description
  - Profiles have a summary/description (might want to add that)

- Page itself
  - Fluid container (expands to fill the page)
  - Border lines between gists header and gists display
  - App header has different background
  - Create is the home page
  - Logout is in the profile dropdown menu
