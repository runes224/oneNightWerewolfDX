<template>
  <div>
    <div v-if="isGameMaster">
      <div class="margin_1">残り{{remainCounter}}枚、役職を増やしてください。</div>
      <div class="counter-area" v-for="role in roles" v-bind:key="role.name">
        <div class="role-name">{{role.name}}：</div>
        <number-input-spinner :min="0" :max="10" :step="1" :integerOnly="true" v-model="role.number"></number-input-spinner>
      </div>
      <v-btn color="primary" @click="startGame" class="margin_1">ゲーム開始</v-btn>
    </div>
    <div v-if="!isGameMaster">
      <span>ゲームマスターが操作中です。</span><br>
      <span>しばらくお待ち下さい。</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "choise",
  data() {
    return {
      roles: [
        { name: "村人", number: 0, description: "狼の嘘を見破りましょう" },
        { name: "人狼", number: 2, descriptioxn: "村人を欺きましょう" },
        {
          name: "占い師",
          number: 1,
          description: "誰かのカードか余ったカードを確認できます"
        },
        { name: "怪盗", number: 1, description: "誰かのカードと交換できます" },
        {
          name: "軍人",
          number: 0,
          description: "村人よりちょっとだけ強いです"
        },
        { name: "狂人", number: 0, description: "人狼の勝利があなたの勝利です" }
      ]
    };
  },
  computed: {
    remainCounter() {
      let roleCount = 0;
      for (var role of this.roles) {
        roleCount = roleCount + role.number;
      }
      const usersCount = this.$store.getters['modules/getUsersNumber'];
      return usersCount - roleCount + 2;
    },
    isGameMaster() {
      return this.$store.getters['modules/isGameMaster'];
    }
  },
  methods: {
    startGame: function() {
      this.$store.dispatch('modules/setRoles', this.roles);
      const sendData = {
        action: "startGame",
        roles: this.roles,
        users: this.$store.getters['modules/users']
      };
      this.$websocket.send(JSON.stringify(sendData));
      this.$router.push('/playingGame');
    }
  }
}
</script>

<style scoped>
.margin_1 {
  margin: 1rem 1rem;
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
</style>