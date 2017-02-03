# UnitPal

Hotel Management Application for internal use

=========================================

When you first clone the app, run in a terminal
> npm run install-deps

=========================================

The project has 3 Visual Studio Tasks
 - build server (Shift+Ctrl+B / Shift+Cmd+B)
 - build client (Shift+Ctrl+T / Shift+Cmd+T)
 - build e2e tests

=========================================

Change the sessionAuth, with values found in database on collection hotels
	sessionDo.hotel.id = hotels[0].id
	sessionDo.user.id = hotels[0].userList[0].id

=========================================

To run locally on dev environment
> npm run dev

On test environment
> npm run test

=========================================

To run the server tests
> npm run server-tests

=========================================

> npm run build-all

=========================================
To run the e2e tests
 - Terminal 1
	> npm run test
 - Terminal 2
	> npm run e2e-tests


## Environment

 - Node.js - 4.6.0