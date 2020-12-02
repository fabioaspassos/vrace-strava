const AWS=require('aws-sdk');
const https = require('https');
const docClient= new AWS.DynamoDB.DocumentClient({region : 'us-east-2'});

exports.handler = function(event, context, callback) {
  //console.log('Received event:', JSON.stringify(event, null, 2));

  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
        'Content-Type': 'application/json',
    },
  });

  const codeAut = event.queryStringParameters.code;
/*
  if (!codeAut || rcodeAut.trim()===''){
    done(new Error("Code Aut missing"));
  }
*/

  const client_id = "54496";
  const client_secret = "da573e0f74693df6b74a31a5e5ca20ad289e2025";

  const options = {
    host: 'www.strava.com',
    path: `/api/v3/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${codeAut}&grant_type=authorization_code`,
    method: 'POST'
  };

  const prom = new Promise((resolve, reject)=>{
    const request = https.request(options, (res)=>{
      if(res.statusCode != 200){
        console.log('Falhou >>:'+ JSON.stringify(res));
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }
      let data = '';

      res.on('data', chunk => {
        data += chunk;                
      });

      res.on('end', ()=> {
        console.log('end >>:'+ data);
        data = JSON.parse(data);
        resolve(data);
      });
    });
    
    request.on('error', reject);
    request.end();
  });
  
  prom
  .then(result => {  
    result.id = result.athlete.id;  
    docClient.put({TableName : process.env.TB_ACTIVITIES, Item : result}, done);
    })
  .catch(err => done(err, null));

};
