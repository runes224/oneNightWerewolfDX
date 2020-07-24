<template>
  <div class="register">
    <v-form style="width: 15rem;" ref="register_name_form">
      <v-text-field v-model="name" label="名前を入力してください" :rules="[required, notDuplicated]"></v-text-field>
    </v-form>
    <v-btn @click="registerName" class="btn">送信</v-btn>
  </div>
</template>

<script>
export default {
  name: "choiceRole",
  props: ['users'],
  data() {
    return {
      name: '',
      required: value => !!value || "必ず入力してください", // 入力必須の制約
      notDuplicated: value => this.users.filter(user => user === value).length === 0 || "他のユーザと名前が重複しています" // 入力必須の制約
    };
  },
  methods: {
    registerName: function() {
      if (!this.$refs.register_name_form.validate()) {
        return;
      }
      this.$emit('chileEvent', this.name)
    }
  }
}
</script>

<style scoped>
.btn {
  margin-top: 0.8rem;
  margin-left: 1rem;
}

.register {
  display: flex;
  justify-content: center;
}
</style>