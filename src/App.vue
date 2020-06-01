<template>
  <v-app>
    <!-- header -->
    <div style="display: center;">
      <v-app-bar color="gray accent-4" dark>
        <v-toolbar-title>ワンナイト人狼DX</v-toolbar-title>
        <div class="flex-grow-1"></div>
        <div v-if="nameFlag" style="display: inline-flex;">
          <p>ログインユーザ：</p>
          <p>{{users.length}}人</p>
        </div>
      </v-app-bar>
    </div>
    <v-container>
      <div id="app">
        <button v-if="!isConnected" @click="connect">接続</button>
        <div v-if="isConnected">
          <div v-if="!nameFlag">
            <input placeholder="Enter your name" v-model="name" />
            <button @click="registerName">送信</button>
          </div>
          <div v-if="status == 'start'">
            <v-divider></v-divider>
            残り{{remainCounter}}枚、役職を増やしてください。
            <div class="counter-area" v-for="role in roles" v-bind:key="role.name">
              {{role.name}}：
              <div class="btn-counter">
                <button class="minus-button">-</button>
                <div style="flex: 1">
                  <input v-model="role.number" type="text" style="height: 100%;width: 100%;" />
                </div>
                <button class="plus-button">+</button>
              </div>人
            </div>
            <button @click="startGame">ゲーム開始</button>
          </div>
          <div v-if="status == 'morning'" class="direction-column">
            <!-- カードエリア -->
            <div id="inside-cards">
              <div
                class="direction-column card-area"
                v-for="card in insideCards"
                v-bind:key="card.name"
                @click="nightActionInside()"
              >
                <div class="card" v-bind:class="card.design"></div>
              </div>
            </div>
            <v-divider></v-divider>
            <div id="outside-cards">
              <div
                class="direction-column card-area"
                v-for="card in outsideCards"
                v-bind:key="card.name"
                @click="nightActionOutside(card)"
              >
                <div class="card" v-bind:class="card.design"></div>
                {{card.name}}
              </div>
            </div>
          </div>
          <!-- メッセージエリア -->
          <v-divider></v-divider>
          <ul style="list-style: none" v-for="message in messages" v-bind:key="message">
            <li>{{message}}</li>
          </ul>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      name: "",
      role: "",
      nameFlag: false,
      inputMessage: "",
      connection: null,
      status: "",
      doneNightActionFlag: false,
      messages: [],
      users: [],
      insideCards: [],
      outsideCards: [],
      roles: [
        { name: "村人", number: 1 },
        { name: "人狼", number: 0 },
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
    },
    remainCounter() {
      let roleCount = 0;
      console.log(roleCount);
      for (var role of this.roles) {
        roleCount = roleCount + role.number;
        console.log(roleCount);
      }
      return this.users.length - roleCount + 2;
    }
  },
  methods: {
    registerName() {
      const data = {
        action: "registerName",
        data: this.name
      };

      this.nameFlag = true;
      this.status = "start";

      this.connection.send(JSON.stringify(data));
    },
    sendMessage() {
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
        roles: this.roles,
        users: this.users
      };

      this.connection.send(JSON.stringify(data));
    },
    nightActionInside() {
      if (this.role == "占い師" && this.doneNightActionFlag == false) {
        for (let index = 0; index < 2; index++) {
          let card = this.insideCards[index];
          card.design = card.role;
          this.insideCards.splice(index, 1, card);
        }
      }
      this.doneNightActionFlag = true;
    },
    nightActionOutside(card) {
      if (this.doneNightActionFlag) {
        return;
      }
      if (this.role == "占い師") {
        card.design = card.role;
        this.outsideCards.splice(card.num, 1, card);
      } else if (this.role == "怪盗") {
        card.design = card.role;
        const myCardArray = this.outsideCards.filter(
          card => card.name === this.name
        );
        const myCard = myCardArray[0];
        this.role = card.role;
        myCard.name = card.name;
        card.name = this.name;
        this.outsideCards.splice(myCard.num, 1, card);
        this.outsideCards.splice(card.num, 1, myCard);
      }
      this.doneNightActionFlag = true;
    }
  },
  created() {
    console.log("Starting connection to WebSocket Server");
    this.connection = new WebSocket(
      "wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod"
    );

    this.connection.onmessage = event => {
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
        case "roles":
          {
            console.log(JSON.parse(event.data));
            let receivedRoles = JSON.parse(event.data).userRoles;
            console.log(receivedRoles);
            this.role = receivedRoles[this.name];
            this.messages.push("あなたの役職は" + this.role + "です。");

            // カードを配る
            let i = 0;
            Object.entries(receivedRoles).map(([key, value]) => {
              let obj = {};
              if (key == this.name) {
                obj = { name: key, role: value, design: value, num: i };
                // this.mycard = obj;
              } else {
                obj = { name: key, role: value, design: "back", num: i };
              }
              if (obj.name.match(/^notAssigned/)) {
                this.insideCards.push(obj);
              } else {
                this.outsideCards.push(obj);
              }
              i++;
            });
            this.status = "morning";
          }
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
}

.v-toolbar__content {
  display: inline-flex !important;
}

input {
  width: 15rem;
}

#outside-cards,
#inside-cards {
  display: flex;
  flex-wrap: wrap;
}

.card {
  width: 70px;
  height: 90px;
  line-height: 90px;
  border: 1px solid silver;
  border-radius: 10px;
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  box-shadow: gray 2px 2px;
  background: white;
  float: left;
  cursor: pointer;
}
.card-area {
  padding: 8px 8px;
}
/* 裏の状態 */
.back {
  background-image: url("./assets/card_back.png");
  background-size: 70px 90px;
}
.村人 {
  background-image: url("./assets/村人.png");
  background-size: 70px 90px;
}
.怪盗 {
  background-image: url("./assets/怪盗.png");
  background-size: 70px 90px;
}
.軍人 {
  background-image: url("./assets/軍人.png");
  background-size: 70px 90px;
}
.人狼 {
  background-image: url("./assets/人狼.png");
  background-size: 70px 90px;
}
.占い師 {
  background-image: url("./assets/占い師.png");
  background-size: 70px 90px;
}
.狂人 {
  background-image: url("./assets/狂人.png");
  background-size: 70px 90px;
}

/* 表面の表示 */
.is-surface .card_surface {
  opacity: 1;
  transform: rotateY(0deg);
  transition: opacity 100ms 150ms, transform 300ms 150ms;
}
.is-surface .card_reverse {
  opacity: 0;
  transform: rotateY(90deg);
  transition: opacity 50ms 200ms, transform 300ms;
}
/* 裏面の表示 */
.is-reverse .card_surface {
  opacity: 0;
  transform: rotateY(90deg);
  transition: opacity 50ms 200ms, transform 300ms;
}
.is-reverse .card_reverse {
  opacity: 1;
  transform: rotateY(0deg);
  transition: opacity 100ms 150ms, transform 300ms 150ms;
}

.direction-column {
  display: flex;
  flex-direction: column;
}

.counter-area {
  display: flex;
  justify-content: center;
  margin-top: 2px;
  margin-bottom: 2px;
}

.btn-counter {
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.3);
  height: 32px;
  width: 100px;
  border-radius: 8px;
  margin-left: 2px;
  margin-right: 2px;
}

.minus-button {
  /* Center the content */
  align-items: center;
  background-color: rgba(0, 0, 0, 0.05);
  border-color: transparent;
  cursor: pointer;
  display: flex;
  justify-content: center;

  /* Size */
  width: 32px;
}

.plus-button {
  /* Center the content */
  align-items: center;
  background-color: rgba(0, 0, 0, 0.05);
  border-color: transparent;
  cursor: pointer;
  display: flex;
  justify-content: center;

  /* Size */
  width: 32px;
}
</style>
