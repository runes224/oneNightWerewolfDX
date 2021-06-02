<template>
  <div>
    <v-row justify="center" class="form">
      <v-switch
        v-model="state.createNewRoomFlag"
        label="新しく部屋を作成する"
        class="input_new_room_flag"
      ></v-switch>
      <div class="register">
        <v-form ref="register_name_form" class="input_name">
          <v-text-field
            v-if="!state.createNewRoomFlag"
            v-model="roomId"
            label="ルームIDを入力して下さい"
            :rules="[onlyNumbers]"
          ></v-text-field>
          <v-text-field
            v-model="state.name"
            label="名前を入力してください"
            :rules="[required, notDuplicated(users)]"
          ></v-text-field>
        </v-form>
        <v-btn class="btn" @click="registerName">送信</v-btn>
      </div>
    </v-row>
  </div>
</template>

<script>
import { reactive, ref, computed } from "@vue/composition-api";

export default {
  name: "RegisterNameForm",
  setup(props, context) {
    const store = context.root.$store;
    const router = context.root.$router;
    const websocket = context.root.$websocket;
    const register_name_form = ref(null);
    console.log('register_name_form', register_name_form);

    const state = reactive({
      name: "",
      roomId: "",
      createNewRoomFlag: true
    });

    const users = computed(() => state.min + state.sec > 0);

    store.dispatch("modules/clearMessages");

    const required = (value) => !!value || "必ず入力してください";

    const notDuplicated = (value, users) => {
      return (
        users === undefined ||
        users.filter((user) => user === value).length === 0 ||
        "他のユーザと名前が重複しています"
      );
    };

    const onlyNumbers = (value) => {
      return (
        (Number.isInteger(Number(value)) &&
          Number(value) < 100000 &&
          Number(value) > 10000) ||
        "整数5桁で入力してください"
      );
    };

    const registerName = () => {
      // if (!register_name_form.validate()) {
      //   return;
      // }
      const sendData = {
        action: "registerName",
        name: state.name,
        gameMasterFlag: state.createNewRoomFlag,
        roomId: state.roomId
      };
      websocket.send(JSON.stringify(sendData));
      if (state.roomId !== "") {
        store.dispatch("modules/setRoomId", state.roomId);
      }
      store.dispatch("modules/registerName", {
        name: state.name,
        gameMasterFlag: state.createNewRoomFlag
      });
      router.push("/choiceRole");
    };

    return {
      state,
      users,
      required,
      notDuplicated,
      onlyNumbers,
      registerName
    };
  }
};
</script>

<style scoped>
.btn {
  margin-top: 1.2rem;
  margin-left: 1rem;
}

.form {
  display: inline-block;
}

.input_new_room_flag {
  height: 2.4rem;
}

.input_name {
  width: 15rem;
}
</style>
