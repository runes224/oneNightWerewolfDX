<template>
  <div class="direction-column">
    <header class="margin_5">
      <Timer
        :key="state.gameCount"
        :night-period-second="Number(nightPeriodSecond)"
        :day-period-minute="Number(dayPeriodMinute)"
        @start-voting="startVoting()"
      ></Timer>
      <VoteUser
        v-if="state.startVotingFlag"
        :other-users="otherUsers"
        :my-role="myRole"
        @end-voting="endVoting()"
      ></VoteUser>
      <v-row v-if="state.finishGameFlag && gameMasterFlag" justify="center">
        <v-btn color="red lighten-2" dark @click="nextGame"
          >次のゲームに進む</v-btn
        >
      </v-row>
    </header>
    <div id="inside-cards">
      <div
        v-for="card in state.insideCards"
        :key="card.name"
        class="direction-column card-area"
        @click="nightActionInside()"
      >
        <div class="card" :class="card.design"></div>
      </div>
    </div>
    <v-divider></v-divider>
    <div id="outside-cards">
      <div
        v-for="card in state.outsideCards"
        :key="card.name"
        :class="['direction-column', 'card-area', isMyCard(card.name)]"
        @click="nightActionOutside(card)"
      >
        <div class="card" :class="card.design"></div>
        {{ card.name }}
        <span
          v-if="state.finishGameFlag"
          style="color: black; font-weight: initial"
          >投票数：{{ card.votedNum }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import Timer from "../components/Timer.vue";
import VoteUser from "../components/VoteUser.vue";
import { reactive, computed } from "@vue/composition-api";

export default {
  components: {
    Timer,
    VoteUser
  },
  setup(props, context) {
    const store = context.root.$store;
    const router = context.root.$router;

    const state = reactive({
      insideCards: computed(() => store.getters["modules/insideCards"]),
      outsideCards: computed(() => store.getters["modules/outsideCards"]),
      finishGameFlag: computed(() => store.getters["modules/isFinishedGame"]),
      doneNightActionFlag: computed(() => store.getters["modules/isDoneNightAction"]),
      startVotingFlag: computed(() => store.getters["modules/isStartVoting"]),
      gameCount: computed(() => store.getters["modules/getGameCount"])
    });

    const myName = store.getters["modules/myName"];
    const myRole = store.getters["modules/myRole"];
    const users = store.getters["modules/users"];
    const gameMasterFlag = store.getters["modules/isGameMaster"];
    const nightPeriodSecond = store.getters["modules/nightPeriodSecond"];
    const dayPeriodMinute = store.getters["modules/dayPeriodMinute"];

    const otherUsers = computed(() => users.filter((user) => user !== myName));

    const isMyCard = (name) => {
      if (myName === name) {
        return "myCard";
      }
      return "";
    };

    const nightActionInside = () => {
      if (myRole === "占い師" && state.doneNightActionFlag === false) {
        clearMessages();
        for (let index = 0; index < 2; index++) {
          let card = state.insideCards[index];
          card.design = card.role;
          state.insideCards.splice(index, 1, card);
          addMessage("中央の伏せカード" + (index + 1) + ":" + card.role);
        }
      }
      store.dispatch("modules/doneNightAction");
    };

    const nightActionOutside = (choicedCard) => {
      if (state.doneNightActionFlag) {
        return;
      }
      if (myRole === "占い師") {
        choicedCard.design = choicedCard.role;
        state.outsideCards.splice(choicedCard.num, 1, choicedCard);
        clearMessages();
        addMessage(
          choicedCard.name + "さんのカードは" + choicedCard.role + "でした"
        );
      } else if (myRole === "怪盗") {
        choicedCard.design = choicedCard.role;
        const myCard = state.outsideCards.filter(
          (outsideCard) => outsideCard.name === myName
        )[0];
        myCard.name = choicedCard.name;
        choicedCard.name = myName;
        const myCardNum = myCard.num;
        const choicedCardNum = choicedCard.num;
        myCard.num = choicedCardNum;
        choicedCard.num = myCardNum;
        state.outsideCards.splice(myCardNum, 1, choicedCard);
        state.outsideCards.splice(choicedCardNum, 1, myCard);
        clearMessages();
        addMessage(
          myCard.name + "さんのカード（" + choicedCard.role + "）と交換しました"
        );
      }
      store.dispatch("modules/doneNightAction");
      store.dispatch("modules/setInsideCards", state.insideCards);
      store.dispatch("modules/setOutsideCards", state.outsideCards);
    };

    const startVoting = () => {
      clearMessages();
      addMessage("議論の時間が終わりました。投票をしてください。");
      store.dispatch("modules/setVoteState", true);
    };

    const endVoting = () => {
      clearMessages();
      addMessage(
        "投票が完了しました。他のプレイヤーの操作が完了するまでお待ちください。"
      );
      store.dispatch("modules/setVoteState", false);
    };

    const addMessage = (message) => {
      store.dispatch("modules/addMessage", message);
    };

    const clearMessages = () => {
      store.dispatch("modules/clearMessages");
    };

    const nextGame = () => {
      clearMessages();
      router.push("/choiceRole");
    };

    return {
      state,
      myRole,
      gameMasterFlag,
      nightPeriodSecond,
      dayPeriodMinute,
      nightActionInside,
      nightActionOutside,
      otherUsers,
      isMyCard,
      startVoting,
      endVoting,
      nextGame,
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

.margin_5 {
  margin: 0.5rem 0.5rem;
}

.myCard {
  color: red;
  font-weight: bold;
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
