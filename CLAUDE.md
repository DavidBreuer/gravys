# CLAUDE.md Instructions

Trust these instructions first, only search the codebase and other resources if the information here is incomplete.

## Behavioral Rules (Always Enforced)

ALWAYS do what has been asked, nothing more, nothing less.
ALWAYS look for fitting skills for your task and load them.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files unless explicitly requested.
NEVER save working files (e.g. txt, md) or tests to the root folder.
ALWAYS read a file before editing it.
NEVER commit secrets, credentials, or local .env files.

## Making Changes

- Start in Plan Mode until you resolved all open questions.
- Look at pro and cons of the plan and come up with a long term reliable design that is neighter overengineered nor underingeneered.
- Before making implementations state a short summary.
- Look at existing tests and enhance them or create new tests to cover the requirements.
- Implement the changes and add meaningful and helpful comments.
- After implementation conduct a full review and identify weakness and optimizations and implement them.
- Clean the formatting of the Python code.
- Run tests, compile and fix any errors that occur.
- Finally update the documentation prepare a draft for an PR with the essence of the changes.

## Plan Mode

- Understand the user question and scan relevant codebase files and relevant documents.
- Look for related closed PRs and draft an initial plan.
- Make the plan extremely concise.
- At the end of each plan, give a list of unresolved questions to answer, if any.

## Background Information

- *Fishy* is a light-weight Progressive Web Application (PWA) built using Python Flask and Dash.
- It allows users to log in and track fish-based products and their sustainability and animal welfare labels for a set of supermarkets.
- Users can easily and conventiently add their assessments as well as photos for documentation purposes.
- Finally, the application offers a simple summary analysis across supermarkets and labels as well as data download for custom in-depth analyses.

## Repository Information

- The `app.py` file contains the main application.
- Needed `assets` and `static` files are located in the respective folders.
- The `db` folder contains Flyway migration .sql scripts that are use to manage the database setup.
- Before using the following local commands, please use the Makefile command `make stop` to ensure that the port is not in use by another programm.
- For running the app locally, please use the Makefile command `make run`.
- For testing the app locally, please use the Makefike command `make test`.
- For formatting the app code locally, please use the Makefike command `make format`.