# Firebase autocomplete Function

Javascript Firebase Function that queries Google Maps Places API for Autocomplete

## Development 
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