
const io = require('console-read-write')
const crypto = require('crypto')
const fs = require('fs')
const now = require('nano-time')

//classes
class BlockHeader {
	constructor(index,parent_hash,body_hash,target,timestamp,nonce){
		this.index = index;
		this.parent_hash = parent_hash;
		this.body_hash = body_hash;
		this.target = target;
		this.timestamp = timestamp;
		this.nonce = nonce;
	}
}

//functions
function toBytesInt32 (num) {
    let  arr = new ArrayBuffer(4);
    let view = new DataView(arr);
    view.setUint32(0, num, false); 
    return arr;
}

function toBytesInt64 (num){
    var buffer = new ArrayBuffer(8);
    var dataview = new DataView(buffer);
    dataview.setBigUint64(0, num,false);
    return buffer;
}


function makeBlockHeader(block_header) {

	var total_length = 84;

	data = new Uint8Array(total_length);

        offset = 0;
	let index = new Uint8Array(toBytesInt32(block_header.index));
	//io.write(index)
	data.set(index,offset);
	offset+=4;
	
	let parent = new Uint8Array(Buffer.from(block_header.parent_hash,'hex'));
	data.set(parent,offset);
	offset+=32;
	//io.write(parent)
	
	let body = new Uint8Array(Buffer.from(block_header.body_hash,'hex'));
	data.set(body,offset);
	offset+=32;
	//io.write(body)
	
	//io.write(data);
	
	let target = new Uint8Array(Buffer.from(block_header.target,'hex'));
	//io.write(target)
	
	nonce = BigInt(0);
	var timestamp;
	var hash;
	while(true){
	      timestamp = BigInt(now());
	      buffer = new Uint8Array(toBytesInt64(timestamp));
	      data.set(buffer,offset);
	      nonce_buffer = new Uint8Array(toBytesInt64(nonce));
	      data.set(nonce_buffer,offset+8);
	      //io.write(data);
	      hash =  crypto.createHash('sha256').update(data).digest('hex');
	      
	      if(hash<=block_header.target){
	          block_header.timestamp = timestamp;
	          block_header.nonce = nonce;
	          break;
	      }
	      nonce++;
	}
	
	io.write("Timestamp: "+timestamp);
	io.write("Nonce: "+nonce);
	io.write("Hash: "+hash);
}

async function main(){
        
        block_header = new BlockHeader();

	io.write("Enter index of block");
	block_header.index = parseInt(await io.read());

	io.write("Enter hash of parent block");
	block_header.parent_hash = await io.read();
	
	io.write("Enter path to block data file");
	var path = await io.read();
	let data = fs.readFileSync(path);
	block_header.body_hash = crypto.createHash('sha256').update(data).digest('hex');
	
	io.write("Enter target value");
	block_header.target = await io.read();

        makeBlockHeader(block_header);

}
main();
