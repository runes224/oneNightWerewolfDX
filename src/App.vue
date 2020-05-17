<template>
  <!-- <v-app>
    <v-container>
      <ChatBoard/>
    </v-container>
  </v-app>-->
  <div id="app">
    <h2>ワンナイト人狼DX</h2>
    <button v-if="!isConnected" @click="connect">接続</button>
    <div v-if="nameFlag" style="display: inline-flex;">
      <p>ログインユーザ：</p>
      <p>{{users.length}}人</p>
    </div>
    <br />
    <div v-if="nameFlag" style="display: inline-flex;">
      <p>あなたの名前：</p>
      <ul style="list-style: none" v-for="user in users" v-bind:key="user">
        <li>{{user}}</li>
      </ul>
    </div>
    <div v-if="isConnected">
      <div v-if="!nameFlag">
        <input placeholder="Enter your name" v-model="name" />
        <button @click="registerName">送信</button>
      </div>
      <div v-if="nameFlag">
        <v-divider></v-divider>
        <ul style="list-style: none" v-for="role in roles" v-bind:key="role.name">
          <li>
            {{role.name}}：
            <input v-model="role.number" style="width: 0.5rem;" />人
          </li>
        </ul>
        <button @click="startGame">ゲーム開始</button>
        <v-divider></v-divider>
      </div>
      <ul style="list-style: none" v-for="message in messages" v-bind:key="message">
        <li>{{message}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      name: "",
      nameFlag: false,
      inputMessage: "",
      connection: null,
      messages: [],
      users: [],
      roles: [
        { name: "村人", number: 1 },
        { name: "人狼", number: 2 },
        { name: "占い師", number: 1 },
        { name: "怪盗", number: 1 },
        { name: "軍人", number: 0 },
        { name: "狂人", number: 0 }
      ]
    };
  },
  computed: {
    isConnected() {
      return this.ws !== null;
    }
  },
  methods: {
    registerName() {
      console.log(this.connection);

      const data = {
        action: "registerName",
        data: this.name
      };

      this.nameFlag = true;

      this.connection.send(JSON.stringify(data));
    },
    sendMessage() {
      console.log("Hello");
      console.log(this.connection);

      const data = {
        action: "sendmessage",
        data: this.inputMessage
      };

      this.connection.send(JSON.stringify(data));

      this.inputMessage = "";
    },
    startGame() {
      const data = {
        action: "startGame",
        data: this.roles
      };

      console.log(JSON.stringify(data));
      this.connection.send(JSON.stringify(data));
    }
  },
  created() {
    console.log("Starting connection to WebSocket Server");
    this.connection = new WebSocket(
      "wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod"
    );

    this.connection.onmessage = event => {
      console.log(JSON.parse(event.data).type);
      switch (JSON.parse(event.data).type) {
        case "join":
          this.messages.push(
            JSON.parse(event.data).message + "が入室しました。"
          );
          this.users.push(JSON.parse(event.data).message);
          break;
        case "message":
          this.messages.push(JSON.parse(event.data).message);
          break;
        default:
          this.messages.push("予期せぬデータを受信しました");
      }
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
