
const io = require('console-read-write');
function find_smallest(message){
	var done = false;
	var trial_input=1;
	var trial_message;
	var target = "0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
	while(done===false){
		let trial_message=message+trial_input;
		let crypto = require('crypto');
		let  hash = crypto.createHash('sha256');
		hash.update(trial_message);
		let  check=hash.digest('hex');
		if(parseInt("0x"+check,16)<=parseInt("0x"+target,16)){
			done=true;
			io.write("Hey, we found the number, it is "+ trial_input);
		
		}
		trial_input++;
	}
}
async function main(){
	io.write("Hello, please enter your string");
        var message = await io.read();
	find_smallest(message);
}
main();

