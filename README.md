# Nodejs - Book Apis

API Services on top of the Mean Stack

## Environment

-   Node.js **10+**
-   MongoDB **4.X+** (Recommended **4+**)


### Setting up environments

1.  Create a copy of `.env.example` on root directory of project.
2.  Create a new file by copying and pasting the file and then renaming it to just `.env`
3.  The `.env` is already added to gitignore.

## Project Folder Structure
```sh
.
├── app.js
├── package.json

├── controllers
│   ├── BookController.js

├── models
│   ├── BookModel.js
├── routes
│   ├── api.js
│   ├── book.js

├── helpers
│   ├── apiResponse.js

├── test
│   ├── test.js

## How to run

### Running  API server locally

node app

### Creating new models

Create a new file in `/models/` and leverage in the controller.

### Creating new routes

Create a new file in `/routes/` and add reference as needed in `/routes/api.js` it will be loaded dynamically.

### Creating new controllers

Create a new file in `/controllers/`. Ensure you have any controllers defined in the routes setup and configured. 

### Executing Unit Tests
npm test

