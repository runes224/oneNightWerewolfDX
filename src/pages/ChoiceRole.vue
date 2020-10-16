<template>
  <div>
    <div v-if="isGameMaster">
      <div class="margin_1">
        残り{{ remainCounter }}枚、役職を増やしてください。
      </div>
      <div
        class="input-area"
        v-for="role in state.roles"
        v-bind:key="role.name"
      >
        <div class="role-name">{{ role.name }}：</div>
        <number-input-spinner
          :min="0"
          :max="10"
          :step="1"
          :integerOnly="true"
          v-model="role.number"
        ></number-input-spinner>
      </div>
      <div class="margin_1">
        <div class="input-area">
          <label>夜の時間：</label>
          <input v-model="state.nightPeriodSecond" label="Standard">秒
        </div>
        <div class="input-area">
          <label>昼の時間：</label>
          <input v-model="state.dayPeriodMinute" label="Standard">分
        </div>
      </div>
      <v-btn color="primary" @click="startGame" class="margin_1" style="margin-top: 0;"
        >ゲーム開始</v-btn
      >
    </div>
    <div v-if="!isGameMaster">
      <span>ゲームマスターが操作中です。</span><br />
      <span>しばらくお待ち下さい。</span>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "@vue/composition-api";

export default {
  setup(props, context) {
    const websocket = context.root.$websocket;
    const store = context.root.$store;

    const state = reactive({
      roles: [
        { name: "村人", number: 0, description: "狼の嘘を見破りましょう" },
        { name: "人狼", number: 2, descriptioxn: "村人を欺きましょう" },
        {
          name: "占い師",
          number: 1,
          description: "誰かのカードか余ったカードを確認できます",
        },
        { name: "怪盗", number: 1, description: "誰かのカードと交換できます" },
        {
          name: "軍人",
          number: 0,
          description: "村人よりちょっとだけ強いです",
        },
        {
          name: "狂人",
          number: 0,
          description: "人狼陣営の勝利があなたの勝利です",
        },
        {
          name: "吊人",
          number: 0,
          description: "処刑されるとゲームに勝利します",
        },
      ],
      nightPeriodSecond: store.getters["modules/nightPeriodSecond"],
      dayPeriodMinute: store.getters["modules/dayPeriodMinute"],
    });

    const remainCounter = computed(() => {
      let roleCount = 0;
      for (var role of state.roles) {
        roleCount = roleCount + role.number;
      }
      const usersCount = store.getters["modules/getUsersNumber"];
      return usersCount - roleCount + 2;
    });

    const isGameMaster = computed(() => store.getters["modules/isGameMaster"]);

    const startGame = () => {
      console.log(state)
      store.dispatch("modules/setRoles", state.roles);
      const sendData = {
        action: "startGame",
        roles: state.roles,
        users: store.getters["modules/users"],
        nightPeriodSecond: state.nightPeriodSecond,
        dayPeriodMinute: state.dayPeriodMinute,
      };
      websocket.send(JSON.stringify(sendData));
    };

    return { state, remainCounter, isGameMaster, startGame };
  },
};
</script>

<style scoped>
.margin_1 {
  margin: 1rem 1rem;
}

.input-area {
  display: flex;
  justify-content: center;
  margin-top: 2px;
  margin-bottom: 2px;
}

.role-name {
  width: 5rem;
  line-height: 2.5rem;
}

input {
  width: 1.5rem;
  text-align: end;
}
</style>