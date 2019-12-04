const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

// web socket
const wss = new WebSocket.Server({ port: 8082, clientTracking: true });
// collection of connected clients
const connectedUsers = new Map();

wss.on('connection', (ws, req) => {
  let client = '';
  let token;
  // client authentication
  if (req.headers.token !== '') {
    token = req.headers.token;
  }
  if (ws.protocol !== '') {
    token = ws.protocol;
  }

  jwt.verify(token, 'watch_the_fun', (err, decoded) => {
    if (err) {
      console.log(`Error: ${err}`);
      return;
    }
    client = decoded.name;
    if (client !== 'cis557server') {
      // add client to map of clients
      connectedUsers.set(String(client), ws);
    }
  });

  ws.on('message', (message) => {
    console.log(`Received message ${message} from user ${client}`);
    if (client === 'cis557server') {
      // get list of recipients
      const recipients = new Array(JSON.parse(message));
      recipients.forEach((element) => {
        if (connectedUsers.get(String(element)) !== undefined) {
          connectedUsers.get(String(element)).send('update');
        }
      });
    }
  });

  ws.send('Welcome');
});
