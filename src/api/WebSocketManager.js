import { w3cwebsocket as W3CWebSocket } from "websocket"

import Configuration from 'config.js'
import Utils from 'helpers/Utils.js'


class WebSocketManager {

  static TIMEOUT = 15000;
  static instance = null;

  static getInstance() {
    if(!WebSocketManager.instance)
      WebSocketManager.instance = new WebSocketManager();
    return WebSocketManager.instance
  }

  constructor() {
    this.protocol = (Configuration.ssl ? "wss" : "ws") + "://";
    this.ip = Configuration.ip;
    this.port = Configuration.port;
    this.handshake = Configuration.handshake;
  }

  getClient() {
    if(!this.client || this.client.readyState === this.client.OPEN)
      this.client = this.initConnection();
    return this.client;
  }

  initConnection() {
    let socketUrl = this.getUrl();
    return new Promise(async (resolve, reject) => {
      let completed = false;
      setTimeout(() => {
        if(!completed) {
          completed = true;
          return reject("initConnection(): Timeout error");
        }
      }, WebSocketManager.TIMEOUT)

      let client = new W3CWebSocket(socketUrl);

      client.onopen = async () => {
        console.log('WebSocket Client Connected');
        if(this.handshake) {
          try {
            await this.doHandshake(client);
          } catch(err) {
            completed = true;
            return reject(err);
          }
        }
        completed = true;
        return resolve(client);
      };

      client.onerror = () => {
        completed = true;
        return reject("initConnection(): Connection Error");
      };
    });
  }

  getUrl() {
    let url = this.protocol +  this.ip;
    if(this.port)
      url += ":" + this.port;
    return url;
  }

  doHandshake(client) {
    return new Promise(async (resolve, reject) => {
      let completed = false;
      setTimeout(() => {
        if(!completed) {
          completed = true;
          return reject("doHandshake(): Timeout error");
        }
      }, WebSocketManager.TIMEOUT)
      if (client.readyState === client.OPEN) {
        let handshake = {
          Handshake: this.handshake
        }
        client.send(JSON.stringify(handshake));
        client.onmessage = (message) => {
          let parsedMessage = this.messageResponseToJson(message);
          if (Utils.objectDeepEqual(parsedMessage, handshake)) {
            completed = true;
            return resolve(true);
          } else {
            completed = true;
            return reject("Handshake failed")
          }
        };
      } else {
        completed = true;
        return reject("Handshake failed: client not connected")
      }
    });
  }

  sendJson(body) {
    return new Promise(async (resolve, reject) => {
      let completed = false;
      setTimeout(() => {
        if(!completed) {
          completed = true;
          return reject("sendJson(): Timeout error")
        }
      }, WebSocketManager.TIMEOUT)

      let client;
      try {
        client = await this.getClient();
      } catch(err) {
        completed = true;
        return reject(err);
      }
      
      if (client.readyState === client.OPEN) {
        let jsonOfBody = JSON.stringify(body);
        client.send(jsonOfBody);
        client.onmessage = (message) => {
          let parsedMessage = this.messageResponseToJson(message);
          completed = true;
          return resolve(parsedMessage);
        }
        client.onclose = () => {
          completed = true;
          return reject("The message sent is incorrect");
          // setTimeout(function() {
          //   initConnection();
          // }, 1000);
        };
      } else {
        completed = true;
        return reject("Client is not connected");
      }
    });
  }

  messageResponseToJson(message) {
    if (typeof message.data === 'string') {
      return JSON.parse(message.data);
    } else {
      console.error("messageToJson(): the message is not a string")
      return {}
    }
  }

  getClientState() {
    let client = this.getClient();
    switch (client.readyState) {
      case client.CONNECTING:
        return "Connecting";
      case client.OPEN:
        return "Open";
      case client.CLOSING:
        return "Closing";
      case client.CLOSED:
        return "Clsoed";
      default:
        return "Unknown state";
    }
  }
}

const webSocketManager = WebSocketManager.getInstance();
export default webSocketManager;