exports.handler = function(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
        'Content-Type': 'application/json',
    },
  });
  
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;   
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

};
