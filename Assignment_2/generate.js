const crypto  = require('crypto');
const fs = require('fs');
crypto.generateKeyPair('rsa',  {
  modulusLength: 4096,   
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  }
}, (err, publicKey, privateKey) => {
     fs.writeFileSync('public.pem', publicKey);
     fs.writeFileSync('private.pem', privateKey);
});


	
