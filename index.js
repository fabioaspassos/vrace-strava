"use strict";
const AWS=require('aws-sdk');
const docClient= new AWS.DynamoDB.DocumentClient({region : 'us-east-2'});


exports.handler = function(event, context, callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    const body = JSON.parse(event.body);
    const paramsTable = {
        TableName : 'vrace-push-strava',
        Item : body
    };

    switch (event.httpMethod) {
        case 'GET':
            
            const VERIFY_TOKEN = "STRAVA-VRACE";    
            
            const queryParams = event.queryStringParameters;
            
            let mode = queryParams['hub.mode'];
            let token = queryParams['hub.verify_token'];
            let challenge = queryParams['hub.challenge'];
            // Checks if a token and mode is in the query string of the request
            if (mode && token) {
              // Verifies that the mode and token sent are valid
              if (mode === 'subscribe' && token === VERIFY_TOKEN) {     
                console.log('WEBHOOK_VERIFIED');
                done(null, {"hub.challenge":challenge});
              }
            }
            done(null, {result:1});
            break;
        case 'POST':
            if (body.aspect_type == "create"){
                docClient.put(paramsTable, done);
            }else {
                done(new Error(`aspect_type "${event.body.aspect_type}" not supported`));
            }
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
    
};
