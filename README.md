# Rideshare Firebase Functions

![rideshare-firebase-functions](https://github.com/CSE115A/rideshare-firebase-functions/workflows/rideshare-firebase-functions/badge.svg)

This respository contains all our backend APIs that our front end project needs. 
* Our [`autocomplete`](/functions/autocomplete/) function queries and returns the predictied places based on their inputs
* Our [`getGeo`](functions/geocode/) function queries and returns the latitude and longitudes of our destination and origin addresses
* Our [`getPrices`](functions/prices/) function queries and returns the estimated prices of the trip being planned

## Documentation 
All the documentation for each specific function can be found within each specific directory. 
* `autocomplete` function documentation can be found [here](functions/autocomplete/README.md)
* `getGeo` function documentation can be found [here](functions/getgeo/README.md)
* `getPrices` function documentation can be found [here](functions/getprices/README.md)

## Dependencies 

Can install these by navigating to the [`/functions`](functions/) directory and running `yarn -i`, `yarn install`, or `yarn`

* Development 
  * [`eslint`](https://eslint.org/docs/user-guide/getting-started)
  * [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)
  * [`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier)
  * [`eslint-plugin-promise`](https://github.com/xjamundx/eslint-plugin-promise)
  * [`firebase-functions-test`](https://github.com/firebase/firebase-functions-test)
  * [`prettier`](https://prettier.io/) 
* Production 
  * [`axios`](https://github.com/axios/axios) 
  * [`firebase-admin`](https://github.com/firebase/firebase-admin-node)
  * [`firebase-functions`](https://github.com/firebase/firebase-functions)
  * [`jest`](https://jestjs.io/)

### Start 

**IMPORTANT NOTE**

*Before you begin a local server, make sure to run `firebase functions:config:get > .runtimeconfig.json` within the `/functions` directory to get the environment variables for this project. To learn more about what environment variables are within each scope of the functions, please refer to the README's of each specific function.*

Within the [`/functions`](functions/) directory, run: 

* `yarn serve` to begin an [emulator UI suite](https://firebase.google.com/docs/emulator-suite) on `localhost:4000`
  * As per the [`firebase.json`](firebase.json#L8-L10) file, all the functions will be hosted off of `localhost:5000`. Visiting the Emulator UI Suite will provide more information about more specific endpoint. 

### Testing Suite 

We have written our tests using Jest! In order to run our testing suite, install dependencies and run one of the following commands: 
* `yarn test`
* `yarn test:once`

## Technologies 

* [Firebase](https://firebase.google.com/) 
* [JavaScript](https://www.javascript.com/) 
* [ReactJS](https://reactjs.org/) 
* [ESlint](https://eslint.org/) 
* [Prettier](https://prettier.io/) 