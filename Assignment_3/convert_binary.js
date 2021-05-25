
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
function toBytesInt32 (num) {
    let  arr = new ArrayBuffer(4);
    let view = new DataView(arr);
    view.setUint32(0, num, false); 
    return arr;
}

function toBytesInt64 (num) {
	let arr = new ArrayBuffer(8);
	let view = new DataView(arr);
	view.setBigUint64(0,num,false);
	return arr;
}
function convertToBin(transaction) {
    //8 for time stamp, 4 for input length, inputs, 4 for output length
    //For each input, 32 for id, 4 for index, 4 for sign length
    //For each output, 8 for coins, 4 for key length
  
	var total_length = 16+40*transaction.num_in+12*transaction.num_out;
	for(i=0;i<transaction.num_in;i++){
		total_length+=transaction.inputs[i].length/2;
	}
	for(i=0;i<transaction.num_out;i++){
		total_length+=transaction.outputs[i].length;
	}

	data = new Uint8Array(total_length);
	var offset = 8;

	let num_input = new Uint8Array(toBytesInt32(transaction.num_in));
	data.set(num_input,offset);
	offset+=4;

	for(i=0;i<transaction.num_in;i++){

		let id = transaction.inputs[i].id;
		let temp = new Uint8Array(Buffer.from(id,'hex'));
		data.set(temp,offset);
		offset+=32;

		let index = transaction.inputs[i].index;
		temp = new Uint8Array(toBytesInt32(index));
		data.set(temp,offset);
		offset+=4;


		let length = transaction.inputs[i].length;
		temp = new Uint8Array(toBytesInt32(length));
		data.set(temp,offset);
		offset+=4;

		let sign = transaction.inputs[i].sign;
		temp = new Uint8Array(Buffer.from(sign,'hex'));
		data.set(temp,offset);
		offset+=length/2;

	}
     
    let num_output = new Uint8Array(toBytesInt32(transaction.num_out));
	data.set(num_output,offset);
	offset+=4;

	for(i=0;i<transaction.num_out;i++){

		let coins = transaction.outputs[i].coins;
		temp = new Uint8Array(toBytesInt64(coins));
		data.set(temp,offset);
		offset+=8;

		let length = transaction.outputs[i].length;
		temp = new Uint8Array(toBytesInt32(length));
		data.set(temp,offset);
		offset+=4;

		let key = transaction.outputs[i].key;
		temp = new Uint8Array(Buffer.from(key,'utf-8'));
		data.set(temp,offset);
		offset+=length;

	}

	//setting timestamp
	temp = new Uint8Array(toBytesInt64(BigInt(now())));
	data.set(temp,0);

	//setting id
    let transaction_id = crypto.createHash('sha256').update(data).digest();
    let data_final = new Uint8Array(data.length+transaction_id.length);
    data_final.set(transaction_id,0);
    data_final.set(data,32);
    fs.writeFileSync('data_final.dat',data_final);

}

async function main(){

	io.write("Enter number of inputs");
	var num_in = await io.read();

	
	for(let i=1;i<=num_in;i++){
		io.write("Enter transacation ID of input "+ i);
		var id = await io.read();

		io.write("Enter output index of input "+ i);
		var index = await io.read();

		io.write("Enter length of signature of input "+i);
		var length = await io.read();

		io.write("Enter signature (in hex) of input "+i);
		var sign = await io.read();

		let temp_input = new Input(id,index,length,sign);
		inputs.push(temp_input);
	}

	io.write("Enter number of outputs");
	var num_out = await io.read();
	
	for(let i=1;i<=num_out;i++){
		io.write("Enter number of coins for output "+ i);
		var coins= await io.read();

		io.write("Enter length of key of output "+i);
		var length = await io.read();

		io.write("Enter path to public key of output "+i);
		var path = await io.read();
		var key = fs.readFileSync(path, 'utf-8');

		let temp_output = new Output(index,length,key);
		outputs.push(temp_output);
	}

	let transaction = new Transaction(num_in, inputs, num_out, outputs);
    convertToBin(transaction);

}
main();
