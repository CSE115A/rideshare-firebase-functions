# Firebase getGeo function
Firebase Function that queries and returns the Latitude and Longitude of the given input address.

## Environment Variables

```json
{
  "location": {
    "key": "API_KEY"
  }
}
```
These actual values of these can be obtained by running:
 `firebase functions:config:get > .runtimeconfig.json`.
 
These variables allow us to gain access to [GeoCoding API](https://developers.google.com/maps/documentation/geocoding/start)

## Schemas

### Request
```
curl http://localhost:5001/cse115a/us-central1/GeoTest\?address=ADDRESS
```
Params:
```json
{
    "address": "ADDRESS"
}
```
The address should be correctly formatted by the following elements:

    house number; street name; street type; city; state;

For Example:
1600 Amphitheatre Parkway, Mountain View, CA


### Response

All responses follow this format
```json
{
    "error" : "BOOLEAN",
    "status" : "STATUS_CODE",
    "message" : "RESPONSE_BODY"
}
```

### Bad Request
```json
{
    "error" : true,
    "status" : 400,
    "message" : "Params Error: missing or incorrect address format"
}
```
### Internal Server Error
```json
{
    "error" : true,
    "status" : 500,
    "message" : "Internal Server Error, try again"
}
``` 
### Successful Response
```json
{
    "error" : false,
    "status" : 200,
    "message" : {
        "geo": {
             "lat": "latitude",
             "lng": "longitude"
         },
         "id": "place_id"
    }
}
```
