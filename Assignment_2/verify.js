const io = require('console-read-write');
const crypto = require('crypto');
const verify = crypto.createVerify('RSA-SHA256');
const fs = require('fs');
function verify_sign(path, unencrypted, signature){
    verify.write(unencrypted);
    var publicKey = fs.readFileSync(path);
    if(verify.verify({key: publicKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING}, signature , 'hex')){
          io.write("Signature Verified!");
     }
     else{
          io.write("Verification failed");
     }
    
 }
async function main(){
       io.write("Enter the path to public key");
       var path = await io.read();
       io.write("Enter unencrypted text");
       var unencrypted = await io.read();
       io.write("Enter signed text");
       var signature  = await io.read();
       verify_sign(path, unencrypted, signature);
}
main();

