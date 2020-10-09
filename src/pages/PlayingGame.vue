<template>
  <div class="direction-column">
    <div>test</div>
    <Timer :seccond="nightPeriodSecond" @startVoting="startVotingParent"></Timer>
    <v-row justify="center" v-if="status == 'voting'">
      <v-dialog v-model="dialog" scrollable max-width="25rem">
        <template v-slot:activator="{ on }">
          <v-btn color="red lighten-2" dark v-on="on">投票する</v-btn>
        </template>
        <v-card>
          <v-card-title>投票する相手を選択してください</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 300px;">
            <v-radio-group v-model="votedUser" column>
              <v-radio
                v-for="user in this.otherUsers"
                :key="user"
                :label="user"
                :value="user"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="dialog = false">キャンセル</v-btn>
            <v-btn color="blue darken-1" text @click="vote">送信</v-btn>
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
        :class="['direction-column', 'card-area', isMyCard(card.name)]"
        v-for="card in outsideCards"
        v-bind:key="card.name"
        @click="nightActionOutside(card)"
      >
        <div class="card" :class="card.design"></div>
        {{card.name}}
        <span
          v-if="status == 'resultAnnouncement'"
          style="color: black; font-weight: initial;"
        >投票数：{{card.votedNum}}</span>
      </div>
    </div>
  </div>
  <!-- メッセージエリア -->
  <!-- <div v-if="nameFlag" class="kakomi">
    <ul style="list-style: none" v-for="message in messages" v-bind:key="message">
      <li>{{message}}</li>
      <v-divider></v-divider>
    </ul>
  </div> -->
</template>

<script>
import Timer from "../components/Timer.vue";

export default {
    components: {
    Timer
  },
  name: "playingGame",
  data() {
    return {
      yourName: "",
      role: "",
      gameMasterFlag: false,
      roomId: 0,
      nameFlag: false,
      inputMessage: "",
      status: "",
      doneNightActionFlag: false,
      dialog: false,
      votedUser: "",
      votedCounter: 0,
      nightPeriodSecond: 0,
      messages: [],
      users: [],
      insideCards: [],
      outsideCards: [],
      resultOutsideCards: [],
      roles: []
    };
  },
  computed: {
    otherUsers() {
      return this.users.filter(user => user !== this.yourName);
    }
  },
  methods: {
    isMyCard(name) {
      if (this.yourName === name) {
        return "myCard";
      }
      return "";
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
    nightActionOutside(choicedCard) {
      if (this.doneNightActionFlag) {
        return;
      }
      if (this.role == "占い師") {
        choicedCard.design = choicedCard.role;
        this.outsideCards.splice(choicedCard.num, 1, choicedCard);
        this.messages = [];
        this.messages.push(
          choicedCard.name + "さんのカードは" + choicedCard.role + "でした"
        );
      } else if (this.role == "怪盗") {
        choicedCard.design = choicedCard.role;
        const myCard = this.outsideCards.filter(
          outsideCard => outsideCard.name === this.yourName
        )[0];
        myCard.name = choicedCard.name;
        choicedCard.name = this.yourName;
        const myCardNum = myCard.num;
        const choicedCardNum = choicedCard.num;
        myCard.num = choicedCardNum;
        choicedCard.num = myCardNum;
        this.outsideCards.splice(myCardNum, 1, choicedCard);
        this.outsideCards.splice(choicedCardNum, 1, myCard);
        this.messages = [];
        this.messages.push(
          myCard.name + "さんのカード（" + choicedCard.role + "）と交換しました"
        );
      }
      this.doneNightActionFlag = true;
    },
    startVotingParent() {
      this.status = "voting";
    },
    vote() {
      this.dialog = false;

      const data = {
        action: "vote",
        votedUser: this.votedUser,
        role: this.role,
        outsideCards: this.outsideCards
      };

      this.$websocket.connection.send(JSON.stringify(data));
    }
  },
  created() {
    this.$websocket.connection.onmessage = event => {
      const receivedData = JSON.parse(event.data);
      console.log(receivedData)
      switch (receivedData.type) {
        case "join":
          {
            const joinMember = receivedData.member;
            if (joinMember.notExistRoomFlag === true && joinMember.name === this.yourName) {
              this.messages.push("指定したルームID(" + this.roomId + ")の部屋が存在しません。もう一度接続し直してください。");
            } else if (this.gameMasterFlag === true && joinMember.name === this.yourName) {
              this.messages.push("部屋を作成しました。");
              this.messages.push("ルームIDは" + joinMember.roomId + "です。");
              this.$store.dispatch('modules/setRoomId', joinMember.roomId)
            } else {
              this.messages.push(joinMember.name + "が入室しました。");
            }
            this.$store.dispatch('modules/addUser', joinMember.name)
            break;
          }
        case "message":
          this.messages.push(receivedData.message);
          break;
        case "roles":
          {
            let receivedRoles = receivedData.userRoles;
            this.role = receivedRoles[this.yourName];
            this.messages = [];
            this.messages.push("あなたの役職は" + this.role + "です。");
            this.roles.forEach(role => {
              if (role.name === this.role) {
                this.messages.push(role.description);
              }
            });

            // カードを配る
            let i = 0;
            Object.entries(receivedRoles).map(([key, value]) => {
              let obj = {};
              if (key == this.yourName) {
                obj = {
                  name: key,
                  role: value,
                  design: value,
                  num: i,
                  votedNum: 0
                };
              } else {
                obj = {
                  name: key,
                  role: value,
                  design: "back",
                  num: i,
                  votedNum: 0
                };
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
                if (card.role === "人狼" && card.name !== this.yourName) {
                  card.design = card.role;
                  this.outsideCards.splice(card.num, 1, card);
                  this.messages.push(card.name + "さんも人狼です");
                }
              });
            }
            this.status = "morning";
            // this.nightPeriodSecond = 5;
            this.nightPeriodSecond = 20;
          }
          break;
        case "vote":
          {
            if (receivedData.role == "怪盗") {
              this.resultOutsideCards = receivedData.outsideCards;
            }
            let votedUser = receivedData.votedUser;
            this.outsideCards.forEach(card => {
              if (card.name == votedUser) {
                card.votedNum++;
                this.outsideCards.splice(card.num, 1, card);
              }
            });
            this.votedCounter++;
            if (this.votedCounter >= this.users.length) {
              // 勝敗を決める
              let maxNum = Math.max(
                ...this.outsideCards.map(card => card.votedNum)
              );
              let victims = this.outsideCards.filter(
                card => card.votedNum == maxNum
              );
              this.messages = [];
              victims.forEach(victim => {
                this.messages.push(victim.name + "が処刑されました");
              });
              if (victims.filter(victim => victim.role == "人狼").length > 0) {
                this.messages.push("人狼を処刑したので村人陣営の勝利です");
              } else {
                this.messages.push(
                  "村人陣営のユーザが処刑されたので人狼陣営の勝利です"
                );
              }
              for (let index = 0; index < 2; index++) {
                let card = this.insideCards[index];
                card.design = card.role;
                this.insideCards.splice(index, 1, card);
              }
              this.outsideCards.forEach(card => {
                if (this.resultOutsideCards.length > 0) {
                  let resultCard = this.resultOutsideCards.filter(
                    resultCard => resultCard.name === card.name
                  )[0];
                  card.design = resultCard.role;
                } else {
                  card.design = card.role;
                }
                this.outsideCards.splice(card.num, 1, card);
              });
              this.status = "resultAnnouncement";
            }
          }

          break;
        default:
          console.log(receivedData);
          this.messages.push("予期せぬデータを受信しました");
      }
    };

    this.$websocket.connection.onopen = event => {
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

.myCard {
  color: red;
  font-weight: bold;
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
  background-image: url("../assets/card_back.png");
  background-size: 70px 90px;
}
.村人 {
  background-image: url("../assets/村人.png");
  background-size: 70px 90px;
}
.怪盗 {
  background-image: url("../assets/怪盗.png");
  background-size: 70px 90px;
}
.軍人 {
  background-image: url("../assets/軍人.png");
  background-size: 70px 90px;
}
.人狼 {
  background-image: url("../assets/人狼.png");
  background-size: 70px 90px;
}
.占い師 {
  background-image: url("../assets/占い師.png");
  background-size: 70px 90px;
}
.狂人 {
  background-image: url("../assets/狂人.png");
  background-size: 70px 90px;
}

.direction-column {
  display: flex;
  flex-direction: column;
}
</style>