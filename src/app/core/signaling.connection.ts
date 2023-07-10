export class SignalingConnection {
    connection: any;
    messageListeners: any[]=[];
    socketURL: string;
    onOpen: any;
    username: string;
    room: string;
    constructor(socketURL: string, onOpen: any, onMessage: any, username: string, room: string) {
        this.onOpen = onOpen;
        this.socketURL = socketURL;
        this.messageListeners = [onMessage];
        this.username = username;
        this.room = room;
        this.connectToSocket();
    }
    sendToServer = (msg: any) => {
        const msgJSON = JSON.stringify(msg);
        this.connection.send(msgJSON);
    }
    connectToSocket = () => {
        const serverUrl = `wss://${this.socketURL}`;
        this.connection = new WebSocket(serverUrl);
        this.connection.onopen = () => {
            if (this.username) {
                this.sendToServer({
                    event: 'id',
                    data: this.username,
                    room: this.room
                });
            }
            return this.onOpen;
        };
        this.connection.onmessage = (event: any) => {
            const msg = JSON.parse(event.data);
            this.messageListeners.forEach(func => func(msg));
            console.log(event.data);
        };
    }
    addMsgListener = (func: any) => {
        this.messageListeners = [...this.messageListeners, func];
        return () => {
            this.messageListeners = this.messageListeners.filter(f => f !== func);
        };
    }
}
