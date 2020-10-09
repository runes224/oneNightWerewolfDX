<template>
  <v-app>
    <AppHeader :registerRoomIdFlag="roomId !== 0" :roomId="Number(roomId)"></AppHeader>
    <v-container>
      <div id="app">
        <button v-if="!isConnected" @click="connect">接続</button>
        <div v-if="isConnected">
          <router-view></router-view>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";

export default {
  name: "App",
  components: {
    AppHeader,
  },
  computed: {
    isConnected() {
      return this.$websocket.connection !== null;
    },
    roomId() {
      return this.$store.getters['modules/roomId'];
    }

  }
};
</script>

<style>
#app {
  font-family: "M PLUS Rounded 1c", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
