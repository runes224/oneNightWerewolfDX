<template>
  <v-app>
    <!-- header -->
    <div>
      <v-app-bar color="gray accent-4" dark>
        <v-toolbar-title>ワンナイト人狼DX</v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="nameFlag" style="display: inline-flex; padding-bottom: 0;">
          <p>ログインユーザ：</p>
          <p>{{users.length}}人</p>
        </div>
      </v-app-bar>
    </div>
    <v-container>
      <div id="app">
        <button v-if="!isConnected" @click="connect">接続</button>
        <div v-if="isConnected">
          <div v-if="!nameFlag" class="register-name">
            <v-form style="width: 15rem;" ref="register_name_form">
              <v-text-field v-model="name" label="名前を入力してください" :rules="[required]"></v-text-field>
            </v-form>
            <v-btn @click="registerName" style="margin-top: 0.8rem; margin-left: 1rem;">送信</v-btn>
          </div>
          <div v-if="status == 'start'">
            <div class="margin_1">残り{{remainCounter}}枚、役職を増やしてください。</div>
            <div class="counter-area" v-for="role in roles" v-bind:key="role.name">
              <div class="role-name">{{role.name}}：</div>
              <number-input-spinner
                :min="0"
                :max="10"
                :step="1"
                :integerOnly="true"
                v-model="role.number"
              ></number-input-spinner>
            </div>
            <v-btn color="primary" @click="startGame" class="margin_1">ゲーム開始</v-btn>
          </div>
          <div v-if="status != 'start' && nameFlag" class="direction-column">
            <Timer :seccond="nightPeriodSecond" @startVoting="startVotingParent"></Timer>
            <v-row justify="center">
              <v-dialog v-model="dialog" scrollable max-width="25rem">
                <template v-slot:activator="{ on }">
                  <v-btn color="red lighten-2" dark v-on="on">投票する</v-btn>
                </template>
                <v-card>
                  <v-card-title>投票する相手を選択してください</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text style="height: 300px;">

                    <v-radio-group v-model="votedUser" column>
                      <div v-for="user in users" v-bind:key="user">
                        <v-radio label="user" value="user"></v-radio>
                      </div>
                    </v-radio-group>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn color="blue darken-1" text @click="dialog = false">キャンセル</v-btn>
                    <v-btn color="blue darken-1" text @click="dialog = false">送信</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
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
          <div v-if="nameFlag" class="kakomi">
            <ul style="list-style: none" v-for="message in messages" v-bind:key="message">
              <li>{{message}}</li>
              <v-divider></v-divider>
            </ul>
          </div>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import Timer from "./components/Timer.vue";

export default {
  components: {
    Timer
  },
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
      dialog: false,
      votedUser: "",
      nightPeriodSecond: 0,
      messages: [],
      users: [],
      insideCards: [],
      outsideCards: [],
      roles: [
        { name: "村人", number: 0, description: "狼の嘘を見破りましょう" },
        { name: "人狼", number: 2, description: "村人を欺きましょう" },
        {
          name: "占い師",
          number: 3,
          description: "誰かのカードか余ったカードを確認できます"
        },
        { name: "怪盗", number: 1, description: "誰かのカードと交換できます" },
        {
          name: "軍人",
          number: 0,
          description: "村人よりちょっとだけ強いです"
        },
        { name: "狂人", number: 0, description: "人狼の勝利があなたの勝利です" }
      ],
      required: value => !!value || "必ず入力してください" // 入力必須の制約
    };
  },
  computed: {
    isConnected() {
      return this.ws !== null;
    },
    remainCounter() {
      let roleCount = 0;
      for (var role of this.roles) {
        roleCount = roleCount + role.number;
      }
      return this.users.length - roleCount + 2;
    }
  },
  methods: {
    registerName() {
      if (!this.$refs.register_name_form.validate()) {
        return;
      }

      const data = {
        action: "registerName",
        data: this.name
      };

      this.nameFlag = true;
      this.status = "start";

      this.connection.send(JSON.stringify(data));
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
          this.messages.push(
            "中央の伏せカード" + (index + 1) + ":" + card.role
          );
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
        this.messages.push(card.name + "さんのカードは" + card.role + "でした");
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
        this.messages.push(
          myCard.name + "さんのカード（" + card.role + "）と交換しました"
        );
      }
      this.doneNightActionFlag = true;
    },
    startVotingParent() {
      this.status = "voting";
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
            this.role = receivedRoles[this.name];
            this.messages = [];
            this.messages.push("あなたの役職は" + this.role + "です。");
            this.roles.forEach(role => {
              if (role.name === this.role) {
                this.messages.push(role.description);
              }
            });

            // カードを配る
            let i = 0;
            console.log(receivedRoles);
            Object.entries(receivedRoles).map(([key, value]) => {
              let obj = {};
              if (key == this.name) {
                obj = { name: key, role: value, design: value, num: i };
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
            if (this.role == "人狼") {
              this.outsideCards.forEach(card => {
                if (card.role === "人狼" && card.name !== this.name) {
                  card.design = card.role;
                  this.outsideCards.splice(card.num, 1, card);
                  this.messages.push(card.name + "さんも人狼です");
                }
              });
            }
            this.status = "morning";
            this.nightPeriodSecond = 10;
          }
          break;
        default:
          console.log(JSON.parse(event.data));
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
  font-family: "M PLUS Rounded 1c", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.register-name {
  display: flex;
  justify-content: center;
}

.kakomi {
  padding: 1rem 1rem;
  width: 90%; /*幅の調節*/
  color: #777777; /* 文字色 */
  background-color: #fff; /* 背景色 */
  border: 4px solid #f6bfbc; /*線の太さ・色*/
  border-radius: 3em 0.8em 3em 0.7em/0.9em 2em 0.8em 3em;
  margin: 10px auto;
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

.role-name {
  width: 5rem;
  line-height: 2.5rem;
}

.margin_1 {
  margin: 1rem 1rem;
}
</style>
