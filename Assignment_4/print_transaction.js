
const io = require('console-read-write')
const crypto = require('crypto')
const fs = require('fs')
const now = require('nano-time')

//classes
class Input {
	constructor(id,index,length,sign){
		this.id = id;
		this.index = index;
		this.length = length;
		this.sign = sign;
	}
}

class Output {
	constructor(coins,length,key){
		this.coins = coins;
		this.length = length;
		this.key = key;
	}
}

class Transaction{
	constructor(num_in,inputs,num_out,outputs,id=''){
		this.id = id;
		this.num_in = num_in;
		this.inputs = inputs;
		this.num_out = num_out;
		this.outputs = outputs;
	}
}

var inputs = [];
var outputs = [];

//functions
function toInt (arr) {
       ans = 0;
	for(let i=3;i>=0;i--){
	    ans+= Math.pow(2,8*(3-i))*arr[i]
	}
    return ans;
}

function tobignt (arr) {
       ans = BigInt(0);
	for(let i=7;i>=0;i--){
	    ans+= BigInt(Math.pow(2,8*(7-i)))*BigInt(arr[i])
	}
	return ans;
}
function convert(binary) {
    //8 for time stamp, 4 for input length, inputs, 4 for output length
    //For each input, 32 for id, 4 for index, 4 for sign length
    //For each output, 8 for coins, 4 for key length
        transaction = new Transaction();
        offset = 0;
       
        transaction.timestamp = tobignt(binary.slice(offset,offset+8))
        offset+=8;
  
      
        transaction.num_in = toInt(binary.slice(offset,offset+4))
        offset+=4


	for(i=0;i<transaction.num_in;i++){
	        input = new Input();
	        input.id = binary.slice(offset,offset+32).toString('hex');
	        offset+=32

		input.index = toInt(binary.slice(offset,offset+4));
		offset+=4;

		input.length = toInt(binary.slice(offset,offset+4));
		offset+=4;

		input.sign =binary.slice(offset,offset+input.length).toString('hex');
		offset+=input.length;
		inputs.push(input)


	}
	
	
	transaction.num_out = toInt(binary.slice(offset,offset+4))
        offset+=4
   

	for(i=0;i<transaction.num_out;i++){

		output = new Output()
		output.coins = tobignt(binary.slice(offset,offset+8));
		//io.write(binary.slice(offset,offset+8))
		offset+=8;

		output.length = toInt(binary.slice(offset,offset+4));
		offset+=4;

		output.key = binary.slice(offset,offset+output.length).toString('utf-8');
		offset+=output.length;
		
		outputs.push(output)

	}

	transaction.inputs = inputs
	transaction.outputs = outputs
	transaction.id = crypto.createHash('sha256').update(binary).digest('hex');
	return transaction

}

async function main(){

	io.write("Enter path to binary file");
	var path = await io.read();
	
	bin_data = fs.readFileSync(path)
	transaction = convert(bin_data)
	
       io.write("Timestamp: "+ transaction.timestamp)
       io.write("Transaction ID: "+ transaction.id)
       
       
       io.write("Number of inputs: "+transaction.num_in)
	
	for(let i=1;i<=transaction.num_in;i++){
	        io.write("Input "+ i)
		io.write("Transaction ID: " +transaction.inputs[i-1].id)
		io.write("Index: " +transaction.inputs[i-1].index)
		io.write("Length of signature: "+ transaction.inputs[i-1].length)
		io.write("Signature: "+ transaction.inputs[i-1].sign)

	}
	
	io.write("Number of outputs: "+transaction.num_out)
	
	for(let i=1;i<=transaction.num_out;i++){
	        io.write("Output "+ i)
		io.write("Number of coins: " +transaction.outputs[i-1].coins)
		io.write("Length of public key: " +transaction.outputs[i-1].length)
		io.write("Public key: "+transaction.outputs[i-1].key)
	}
	
	

}
main();
