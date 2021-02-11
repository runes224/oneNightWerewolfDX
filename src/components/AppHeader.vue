<template>
  <div>
    <v-app-bar color="gray accent-4" dark>
      <v-toolbar-title>ワンナイト人狼DX</v-toolbar-title>
      <v-spacer></v-spacer>
      <button
        v-clipboard:copy="roomId"
        v-clipboard:success="onCopy"
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
    registerRoomIdFlag: {
      type: Boolean,
      required: true
    },
    roomId: {
      type: Number,
      default: 0
    }
  },
  setup() {
    const onCopy = () => {
      alert("ルームIDをコピーしました！");
    };

    return {
      onCopy
    };
  }
};
</script>
