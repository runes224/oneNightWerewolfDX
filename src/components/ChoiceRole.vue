yarn add vue-router --dev<template>
  <div>
    <div class="margin_1">残り{{remainCounter}}枚、役職を増やしてください。</div>
    <div class="counter-area" v-for="role in roles" v-bind:key="role.name">
      <div class="role-name">{{role.name}}：</div>
      <number-input-spinner :min="0" :max="10" :step="1" :integerOnly="true" v-model="role.number"></number-input-spinner>
    </div>
    <v-btn color="primary" @click="startGame" class="margin_1">ゲーム開始</v-btn>
  </div>
</template>

<script>
export default {
  name: "choise",
  props: ['usersCount'],
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
      return this.usersCount - roleCount + 2;
    }
  },
  methods: {
    startGame: function() {
      this.$emit("childEvent", this.roles);
    }
  }
};
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