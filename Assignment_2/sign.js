const io = require('console-read-write');
const crypto = require('crypto');
const sign = crypto.createSign('RSA-SHA256');
const fs = require('fs');
function sign_text(message, path){
    sign.write(message);
    var privateKey = fs.readFileSync(path);
    signature = sign.sign({key:privateKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING},'hex');
    return signature;
}
async function main(){
       io.write("Enter text to be signed");
       var message = await io.read();
       io.write("Enter the path to private key");
       var path = await io.read();
       io.write(sign_text(message, path));
}
main();

