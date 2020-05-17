<template>
  <!-- <v-app>
    <v-container>
      <ChatBoard/>
    </v-container>
  </v-app>-->
  <div id="app">
    <h2>ワンナイト人狼DX</h2>
    <button v-if="!isConnected" @click="connect">接続</button>
    <div v-if="isConnected">
      <ul style="list-style: none" v-for="message in messages" v-bind:key="message">
        <li>{{message}}</li>
      </ul>
      <input placeholder="Enter your message" v-model="inputMessage" />
      <button @click="sendMessage">送信</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      inputMessage: "",
      connection: null,
      messages: []
    };
  },
  computed: {
    isConnected() {
      return this.ws !== null;
    }
  },
  methods: {
    sendMessage() {
      console.log("Hello");
      console.log(this.connection);

      const msg = {
        action: "sendmessage",
        data: this.inputMessage
      };

      this.connection.send(JSON.stringify(msg));

      this.inputMessage = "";
    }
  },
  created() {
    console.log("Starting connection to WebSocket Server");
    this.connection = new WebSocket(
      "wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod"
    );

    this.connection.onmessage = event => {
      console.log(event.data);
      this.messages.push(event.data)
    };

    this.connection.onopen = event => {
      console.log(event);
      console.log("Successfully connected to the echo websocket server...");
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

input {
  width: 15rem;
}
</style>
