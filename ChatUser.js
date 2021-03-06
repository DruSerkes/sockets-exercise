/** Functionality related to chatting. */

// Room is an abstraction of a chat channel
const Room = require('./Room');
const axios = require('axios');

/** ChatUser is a individual connection from client -> server to chat. */

class ChatUser {
	/** make chat: store connection-device, room */

	constructor(send, roomName) {
		this._send = send; // "send" function for this user
		this.room = Room.get(roomName); // room user will be in
		this.name = null; // becomes the username of the visitor

		console.log(`created chat in ${this.room.name}`);
	}

	/** send msgs to this client using underlying connection-send-function */

	send(data) {
		try {
			this._send(data);
		} catch (e) {
			// If trying to send to a user fails, ignore it
			console.log(e);
		}
	}

	/** handle joining: add to room members, announce join */

	handleJoin(name) {
		this.name = name;
		this.room.join(this);
		this.room.broadcast({
			type : 'note',
			text : `${this.name} joined "${this.room.name}".`
		});
	}

	/** handle a chat: broadcast to room. */

	handleChat(text) {
		this.room.broadcast({
			name : this.name,
			type : 'chat',
			text : text
		});
	}

	/** Handle messages from client:
   *
   * - {type: "join", name: username} : join
   * - {type: "chat", text: msg }     : chat
   */

	async handleMessage(jsonData) {
		let msg = JSON.parse(jsonData);

		if (msg.type === 'join') this.handleJoin(msg.name);
		else if (msg.type === 'chat') this.handleChat(msg.text);
		else if (msg.type === 'get-joke') await this.handleJoke();
		else if (msg.type === 'get-members') this.handleMembers();
		else if (msg.type === 'set-name') this.handleChangeName(msg.text);
		else if (msg.type === 'private') this.handlePrivateMessage(msg);
		else throw new Error(`bad message: ${msg.type}`);
	}

	/** Handle asking for a joke: get a random dad joke from external API, sends joke to this user only */
	async handleJoke() {
		const response = await axios.get(`https://icanhazdadjoke.com/`, { headers: { Accept: 'application/json' } });
		const joke = response.data.joke;
		this.send(
			JSON.stringify({
				type : 'joke',
				name : 'Server',
				text : joke
			})
		);
	}

	/** Handle asking for members: returns list of members to this user */
	handleMembers() {
		const members = Array.from(this.room.members).map((member) => member.name);
		this.send(
			JSON.stringify({
				type    : 'members',
				name    : 'Server',
				members
			})
		);
	}

	/** Handle name change: updates this.name and broadcasts the name change to the room */
	handleChangeName(text) {
		this.room.broadcast({
			name : this.name,
			type : 'name-change',
			text : text
		});
		this.name = text;
	}

	/** Handle private message: sends a private message to a user */
	handlePrivateMessage(msg) {
		this.room.members.forEach((member) => {
			if (member.name === msg.toUser) {
				member.send(
					JSON.stringify({
						type : 'private',
						name : this.name,
						text : msg.text
					})
				);
				this.send(
					JSON.stringify({
						type : 'private',
						name : this.name,
						text : msg.text
					})
				);
			}
		});
	}

	/** Connection was closed: leave room, announce exit to others */

	handleClose() {
		this.room.leave(this);
		this.room.broadcast({
			type : 'note',
			text : `${this.name} left ${this.room.name}.`
		});
	}
}

module.exports = ChatUser;
