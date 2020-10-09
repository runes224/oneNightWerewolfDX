<template>
  <div>
    <v-row justify="center" class="form">
      <v-switch v-model="createNewRoomFlag" label="新しく部屋を作成する" class="input_new_room_flag"></v-switch>
      <div class="register">
        <v-form class="input_name" ref="register_name_form">
          <v-text-field v-if="!createNewRoomFlag" v-model="roomId" label="ルームIDを入力して下さい" :rules="[onlyNumbers]"></v-text-field>
          <v-text-field v-model="name" label="名前を入力してください" :rules="[required, notDuplicated(users)]"></v-text-field>
        </v-form>
        <v-btn @click="registerName" class="btn">送信</v-btn>
      </div>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "choiceRole",
  data() {
    return {
      name: '',
      roomId: '',
      createNewRoomFlag: true
    };
  },
  methods: {
    required(value) { return !!value || "必ず入力してください"}, // 入力必須の制約
    notDuplicated(value, users) { return users === undefined || users.filter(user => user === value).length === 0 || "他のユーザと名前が重複しています"}, // 入力必須の制約
    onlyNumbers(value) { return (Number.isInteger(Number(value)) && Number(value) < 100000 && Number(value) > 10000) || "整数5桁で入力してください"}, // 数字5桁のみ
    registerName() {
      if (!this.$refs.register_name_form.validate()) {
        return;
      }
      const sendData = {
        action: "registerName",
        name: this.name,
        gameMasterFlag: this.createNewRoomFlag,
        roomId: this.roomId
      };
      this.$websocket.connection.send(JSON.stringify(sendData));
      this.$store.dispatch('modules/registerName', { name: this.name, gameMasterFlag: this.createNewRoomFlag });
      this.$router.push('/choiceRole');
    }
  },
  computed: {
    users() {
      return this.$store.getters['modules/users'];
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