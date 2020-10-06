<template>
    <div>
      <v-app-bar color="gray accent-4" dark>
        <v-toolbar-title>ワンナイト人狼DX</v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="registerRoomIdFlag" style="display: inline-flex; padding-bottom: 0;">
          <p>ルームID：</p>
          <p>{{roomId}}</p>
        </div>
      </v-app-bar>
    </div>
</template>

<script>
export default {
  name: "AppHeader",
  props: {
    registerRoomIdFlag: Boolean,
    roomId: Number
  }
};
</script>