<template>
  <v-row justify="center">
    <v-dialog v-model="state.dialog" scrollable max-width="25rem">
      <template v-slot:activator="{ on }">
        <v-btn color="red lighten-2" dark v-on="on">投票する</v-btn>
      </template>
      <v-card>
        <v-card-title>投票する相手を選択してください</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-model="state.votedUser" column>
            <v-radio
              v-for="user in state.otherUsers"
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
</template>

<script>
import { reactive } from '@vue/composition-api'

export default {
  props: {
    otherUsers: {
      type: Array,
      required: true
    },
    myRole: {
      type: String,
      required: true
    }
  },
  setup(props, context) {
    const websocket = context.root.$websocket

    const state = reactive({
      dialog: false,
      votedUser: {},
      otherUsers: props.otherUsers
    })

    const vote = () => {
      this.dialog = false;

      const data = {
        action: "vote",
        votedUser: state.votedUser,
        role: props.myRole,
        outsideCards: props.outsideCards
      };

      websocket.send(JSON.stringify(data));
    }

    return { state, vote }
  }
}
</script>