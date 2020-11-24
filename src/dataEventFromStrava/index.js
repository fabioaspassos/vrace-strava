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
      TableName : process.env.TABLE_NAME,
      Item : body
  };

  if (body.aspect_type == "create"){
    docClient.put(paramsTable, done);
  }else {
    done(new Error(`aspect_type "${event.body.aspect_type}" not supported`));
  }

};
