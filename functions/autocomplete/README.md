# Firebase autocomplete Function

Javascript Firebase Function that queries Google Maps Places API for Autocomplete

## Development 

### Dependencies 

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

Within the [`/functions`](functions/) directory, run: 

* `yarn serve` to begin an [emulator UI suite](https://firebase.google.com/docs/emulator-suite) on `localhost:4000`
  * As per the [`firebase.json`](firebase.json#L8-L10) file, all the functions will be hosted off of `localhost:5000`. Visiting the Emulator UI Suite will provide more information about more specific endpoint. 

### Testing Suite 

We have written our tests using Jest! In order to run our testing suite, install dependencies and run one of the following commands: 
* `yarn test`
* `yarn test:once`

### Environment Variables 

We have the following environment variables: 

```json 
{
    "auth_token": "token",
    "endpoint": "endpoint",
    "apikey": "token"
}
```

These actual values of these can be obtained by running:

 `firebase functions:config:get > .runtimeconfig.json`

## Schemas 

### Request 

```bash
curl -H "Authentication: token" http://localhost:5000/cse115a/us-central1/autocomplete\?input\=text
```

Where the parameters of you query are as follows: 

```json
{
    "input": "Text to Query"
}
```

### Response

All responses will be in the following format: 
```json
{
    "error": [true, false],
    "status": [200, 400, 401, 500],
    "message": "bodyOfResponse"
}
```

#### Internal Server Error
```json
{
    "error": true, 
    "status": 500,
    "message": "Env Vars Not Set!"
}
```

#### Not Authorized Call
```json
{
    "error": true, 
    "status": 401,
    "message": "Request is not authorized"
}
```

#### Error with Params

```json 
{
    "error": true,
    "status": 400,
    "message": "Params are missing or are incorrect!",
}
```

#### Succesful Response
```json
{
    "error": false, 
    "status": 200, 
    "message": {
        "predictions": []
    }
} 
```

## Technologies 

* [Firebase](https://firebase.google.com/) 
* [JavaScript](https://www.javascript.com/) 
* [ReactJS](https://reactjs.org/) 
* [ESlint](https://eslint.org/) 
* [Prettier](https://prettier.io/) 
