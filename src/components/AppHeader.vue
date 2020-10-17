<template>
  <div>
    <v-app-bar color="gray accent-4" dark>
      <v-toolbar-title>ワンナイト人狼DX</v-toolbar-title>
      <v-spacer></v-spacer>
      <button
        v-clipboard:copy="roomId"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        type="button"
      >
        <div
          v-if="registerRoomIdFlag"
          style="display: inline-flex; padding-bottom: 0"
        >
          <p>ルームID：</p>
          <p>{{ roomId }}</p>
        </div>
      </button>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "AppHeader",
  props: {
    registerRoomIdFlag: Boolean,
    roomId: Number
  },
  methods: {
    onCopy: function () {
      alert("ルームIDをコピーしました！");
    }
  }
};
</script>
