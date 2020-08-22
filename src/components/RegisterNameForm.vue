<template>
<div>
  <v-row justify="center" class="form">
    <v-switch v-model="createNewRoomFlag" label="新しく部屋を作成する" class="input_new_room_flag"></v-switch>
    <div class="register">
      <v-form class="input_name" ref="register_name_form">
        <v-text-field v-if="!createNewRoomFlag" v-model="name" label="ルームIDを入力して下さい" :rules="[required]"></v-text-field>
        <v-text-field v-model="name" label="名前を入力してください" :rules="[required, notDuplicated]"></v-text-field>
      </v-form>
      <v-btn @click="registerName" class="btn">送信</v-btn>
    </div>
  </v-row>
</div>
</template>

<script>
export default {
  name: "choiceRole",
  props: ['users'],
  data() {
    return {
      name: '',
      createNewRoomFlag: true,
      required: value => !!value || "必ず入力してください", // 入力必須の制約
      notDuplicated: value => this.users.filter(user => user === value).length === 0 || "他のユーザと名前が重複しています" // 入力必須の制約
    };
  },
  methods: {
    registerName: function() {
      if (!this.$refs.register_name_form.validate()) {
        return;
      }
      this.$emit('chileEvent', [this.name, this.createNewRoomFlag])
    }
  }
}
</script>

<style scoped>
.btn {
  margin-top:1.2rem;
  margin-left: 1rem;
}

.form {
  display: inline-block;
}

.input_new_room_flag {
  height: 2.4rem
}

.input_name {
  width: 15rem;
}

</style>