/** Client-side of groupchat. */

const urlParts = document.URL.split('/');
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);

const name = prompt('Username?');

/** called when connection opens, sends join info to server. */

ws.onopen = function(evt) {
	console.log('open', evt);

	let data = { type: 'join', name: name };
	ws.send(JSON.stringify(data));
};

/** called when msg received from server; displays it. */

ws.onmessage = function(evt) {
	console.log('message', evt);

	let msg = JSON.parse(evt.data);
	let item;

	if (msg.type === 'note') {
		item = $(`<li><i>${msg.text}</i></li>`);
	} else if (msg.type === 'chat' || msg.type === 'joke') {
		item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
	} else if (msg.type === 'members') {
		listMembers(msg);
	} else if (msg.type === 'name-change') {
		item = $(`<li><i><b>${msg.name}</b> has changed their name to <b>${msg.text}</b></i></li>`);
	} else if (msg.type === 'private') {
		item = $(`<li><i>(Whisper) <b>${msg.name}: </b>${msg.text} </i></li>`);
	} else {
		return console.error(`bad message: ${msg}`);
	}

	$('#messages').append(item);
};

/** called on error; logs it. */

ws.onerror = function(evt) {
	console.error(`err ${evt}`);
};

/** called on connection-closed; logs it. */

ws.onclose = function(evt) {
	console.log('close', evt);
};

/** send message when button pushed. */

$('form').submit(function(evt) {
	evt.preventDefault();

	let data = { type: 'chat', text: $('#m').val() };
	if (data.text === '/joke') data.type = 'get-joke';
	if (data.text === '/members') data.type = 'get-members';
	if (data.text.slice(0, 5) === '/name') {
		data.type = 'set-name';
		data.text = data.text.slice(6);
	}
	if (data.text.slice(0, 5) === '/priv') {
		data.type = 'private';
		data.toUser = data.text.split(' ')[1];
		data.text = data.text.split(' ').slice(2).join(' ');
	}

	ws.send(JSON.stringify(data));

	$('#m').val('');
});

/** Helpers to keep onmessage clean  */

/** list members on the DOM   
 * msg: parsed JSON event data from a web socket connection 
 * contains .name: who is delivering msg, .members: list of member names 
 */

function listMembers(msg) {
	let item;
	let heading = $(`<li><b>${msg.name}: </b></li>`);
	$('#messages').append(heading);
	msg.members.forEach((member) => {
		item = $(`<li><i>${member}</i></li>`);
		$('#messages').append(item);
	});
}
