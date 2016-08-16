# GovUK Jobs - An app for looking up job applicants

This is a demonstation app, that displays a list of job applicants along with a
search box for filtering the results. The results can be clicked on to reveal a
page containing more information about that applicant including their recent job
history.

## Features

* Simple form validation (no empty submissions)
* Searches with just one result go straight to applicant's details page
* Search by candidate number
* Search by name
  * Case insensitive
  * First and middle names can be skipped (try "john smith")
* 404 pages
* Edit search button
* Sharable search URLs

## Caveats

As this is just a demonstration app, sacrifices have been made in order to
simplify setup. Notably, both the dummy data and the session storage is stored
in the app's own memory. Were this to be developed into a production
micro-service these should be moved to one or more other services. In
particular, the data should be stored in a RDBMS.

This app has been written to have a good separation of concerns so that only the
model would need to be modified to use an external database.

## Getting started

### Prerequisities

* Node.js v6 (nvm is probably the best method)

### Installation and running locally

To run the app first clone this repo, then run the following command in the
app's directory:

```bash
$ npm install
$ npm run dev
```

This will start the app on port 8080. Visiting http://localhost:8080 in your
browser should then display the app.

### Running in production

In production JSON format logging would probably be beneficial, this can be
achieved by running `npm start` in place of `npm run dev`.

## Running the tests

This project has both unit and acceptance tests. It is possible to run both in
succession when the app is *not* running, by executing the following command:

```bash
$ npm test
```

This will also run a linting check.

To run the just the unit tests run:

```bash
$ npm run test:unit
```

To run just the acceptance test run:

```bash
$ npm run test:acceptance
```

To run the acceptance tests (in headless mode) against an instance of the app that is already
running run:

```bash
$ npm run chimp
```

To do the same using firefox as the web browser run:

```bash
$ npm run chimp:dev
```

## Structure of source code

This app uses HOF, specifically HOF-Standalone from the lev-web project, in
order to power its search form. This allows us to take advantage of HOF
functionality such as form validation, GovUK styling and 404 pages at the cost
of introducing a fair amount of boilerplate.

* `app.js`: Entrypoint into the app. For the most part this is just boilerplate
  code for setting up HOF. Also contains the dummy data and populates the model
  with it on start-up.
* `config.js`: Default configuration, including the port the app will listen on.
* `routes/index.js`: Sets up the routes / endpoints the app will respond on.
* `controllers/`: The controllers used by the routes.
* `models/`: The models used by the controllers.
* `views`: The Hogan/Moustache templates rendered by the controllers.
* `lib`: Library modules used by various parts of the code-base.
* `tests/unit/`: Unit tests.
* `tests/acceptance/spec/`: Acceptance tests.

## License

This project is licensed under the [GNU GPL version 3](LICENSE.md).

Daniel Martin, August 2016.
