const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

app.post('/hash', function(req, res){
	data = req.body
	input_message = data['data']
	var hash = crypto.createHash('sha256');
	hash.update(input_message);
	var encrypted_message = hash.digest('hex');
	res.json({'hash':encrypted_message})
});

app.listen(8787);

