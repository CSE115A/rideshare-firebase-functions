# Firebase getPrices Function

Javascript firebase function that queries Lyft and Uber's API to get the pricing between two locations

## Development 
### Environment Variables 

We have the following environment variables: 

```json 
{
    "uber_endpoint": "endpoint",
    "lyft_endpoint": "endpoint",
    "auth_token": "token"
}
```

These actual values of these can be obtained by running:

 `firebase functions:config:get > .runtimeconfig.json`

## Schemas 

### Request 

```bash
curl -H "Authentication: token" http://localhost:5000/cse115a/us-central1/getPrices\?start_lat\=START_LAT\&start_lng\=START_LNG\&end_lat\=END_LAT\&end_lng\=END_LNG
```

Where the parameters of you query are as follows: 

```json
{
    "start_lat": "START_LAT", 
    "start_lng": "START_LNG",
    "end_lat": "END_LAT",
    "end_lng": "END_LNG"
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

#### Error with Lyft Call 

```json 
{
    "error": true,
    "status": 400,
    "message": "Params for Lyft are missing or are incorrect!",
}
```

#### Error with Uber Call 
```json
{
    "error": true,
    "status": 400,
    "message": "Error has occured with Uber"
}
```

#### Succesful Response
```json
{
    "error": false, 
    "status": 200, 
    "message": {
        "lyft": {},
        "uber": {}
    }
} 
```
