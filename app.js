const { createServer } = require('http');
const port = process.env.GITHUB_WEBHOOK_PORT || '3000';
const secret = process.env.GITHUB_WEBHOOK_SECRET || '';

const server = createServer((req, res) => {
  if('POST' === req.method){
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if('' !== secret){
        const { createHmac } = require('crypto');
        let signature = createHmac('sha1', secret).update(body).digest('hex');
        if(req.headers['x-hub-signature'] !== `sha1=${signature}`){
          console.log('Signature Error');
          res.statusCode = 403;
          res.end();
          return;
        }
      }
      try{
        body = JSON.parse(decodeURIComponent(body).replace(/^payload=/, ''));
      }catch(e){
        console.log(e)
      }
      if('object' === typeof body){
        if('refs/heads/master' === body.ref){
          console.log(`${body.repository.name} master`);
          const { exec } = require('child_process')
          const command = `cd ../${body.repository.name} && git pull origin master`
          exec(command, (error, stdout, stderr) => {
            if(error){
              console.log('updated unsuccessfully');
              console.log(error);
              res.statusCode = 500;
              res.end('Error');
            }else{
              console.log(stdout);
              console.log('updated successfully');
              res.statusCode = 200;
              res.end('Success');
            }
          });
        }else{
          console.log(`${body.repository.name} $(body.ref} was pushed`);
          res.statusCode = 200;
          res.end('Nothing');
        }
      }else{
        console.log('Body cannot be parsed to an object');
        console.log(body);
        res.statusCode = 400;
        res.end();
      }
    });
  }else{
    console.log('Unexpected get request');
    res.statusCode = 403;
    res.end();
  }
})

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});