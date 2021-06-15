
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
    let ans = 0;
	for(let i=3;i>=0;i--){
	    ans+= Math.pow(2,8*(3-i))*arr[i]
	}
    return ans;
}

function tobignt (arr) {
       ans = BigInt(0);
	for(let i=7;i>=0;i--){
	    ans+= BigInt(Math.pow(2,8*(7-i))*arr[i])
	}
	return ans;
}
function convert(binary) {
    //8 for time stamp, 4 for input length, inputs, 4 for output length
    //For each input, 32 for id, 4 for index, 4 for sign length
    //For each output, 8 for coins, 4 for key length
        transaction = new Transaction();
        offset = 0;
        buff = binary.slice(0,32)
        transaction.id = buff.toString('hex')
        //io.write(transaction.id)
        offset+=32;
        transaction.timestamp = tobignt(binary.slice(offset,offset+8))
        offset+=8;
        
        transaction.num_in = toInt(binary.slice(offset,offset+4))
        offset+=4
        //io.write(transaction.num_in)


	for(i=0;i<transaction.num_in;i++){
	        input = new Input();
	        input.id = binary.slice(offset,offset+32).toString('hex');
	        offset+=32

		input.index = toInt(binary.slice(offset,offset+4));
		offset+=4;

		input.length = toInt(binary.slice(offset,offset+4));
		offset+=4;

		input.sign =binary.slice(offset,offset+input.length/2).toString('hex');
		offset+=input.length/2;
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
	return transaction

}

async function main(){

	io.write("Enter path to binary file");
	var path = await io.read();
	
	bin_data = fs.readFileSync(path)
	convert(bin_data)
	
	
       io.write("Transaction id: "+ transaction.id)
       io.write("Timestamp: "+ transaction.timestamp)
       
       io.write("Number of inputs: "+transaction.num_in)
	
	for(let i=0;i<transaction.num_in;i++){
		io.write("ID for transaction "+ i+" is: " +transaction.inputs[i].id)
		io.write("Index for transaction "+ i+" is: " +transaction.inputs[i].index)
		io.write("Length for transaction "+ i+" is:"+ transaction.inputs[i].length)
		io.write("Sign for transaction "+ i+" is: "+ transaction.inputs[i].sign)

	}
	io.write("Number of outputs: "+transaction.num_out)
	
	for(let i=0;i<transaction.num_out;i++){
		io.write("Coins for transaction "+ i+" is: " +transaction.outputs[i].coins)
		io.write("Length for transaction "+ i+" is: " +transaction.outputs[i].length)
		io.write("Sign for transaction "+ i+" is: " +transaction.outputs[i].key)
	}
	
	

}
main();
