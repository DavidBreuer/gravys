# Gravys

https://testdriven.io/blog/fastapi-react/

https://dev.to/naderelshehabi/securing-plotly-dash-using-flask-login-4ia2

## Prompts

The folder contains a web application that uses a Python FastAPI backend and a React Typescript frontend with Chakra UI components.
Use "make run" to run the app.
After implementing the changes, use "make format" to clean the formatting of Python and JavaScript files.
Please implement the following new features and updates:
1. Add a simple login page which requires username and password using FastAPI HTTPBasicCredentials. Accept any use name and require the password which is given by the KEY variable in the .env file. Show the user name in the menu bar of the actual web app.
2. Add two simple unit tests using Python Playwright and add a "make test" command to run them in the Makefile
3. Show a simple and interactive graph or network in the app using the Sigma.js library, which shows the current ToDos as nodes and links between them if they contain at least one identical word.
4. Additionally connect to a neo4j graph database, with URI, username and password given by the load .env file (NEO4J_URI, NEO4J_USER, NEO4J_WORD) using the Python neo4py library and list all nodes as list below the Sigma.js visualization.

- When typing the login infos, show the user name and show the password in a "hidden" way using one asterik per entered character (e.g. ***).
- Please remove the usage of Chakra and Emotion Javascript libraries and use the well-established Material UI component library instead. Allow the users to switch between light-mode and dark-mode and use #27d644 as the primary color for UI elements.
- Additionally, when reloading page after having logged in before, the page should remember the user and not require a new login. When clicking the the user profile name and icon in the right-hand corner, the user should be logged out and be redirected to the login screen.
- When adding a new or updating or deleting an existing ToDo item, reload the Sigma.js graph and the neo4j list.


Okay, please generate a rectangular .svg file and the corresponding favicon and use them in the app with the following content:
A stylized food plate with a blob of gravy (the app name) on the upper left of the plate and five stylized peas on the lower right, which are also abstract network nodes, that are connected by some hinted (solid and/or dotted or partial) network edges.
