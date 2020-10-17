<template>
  <div v-if="messages.length > 0" class="kakomi">
    <ul v-for="message in messages" :key="message" style="list-style: none">
      <li>{{message}}</li>
      <v-divider></v-divider>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MessageBox",
  props: {
    messages: Array
  }
};
</script>

<style scoped>
.kakomi {
  padding: 1rem 1rem;
  width: 90%; /*幅の調節*/
  color: #777777; /* 文字色 */
  background-color: #fff; /* 背景色 */
  border: 4px solid #f6bfbc; /*線の太さ・色*/
  border-radius: 3em 0.8em 3em 0.7em/0.9em 2em 0.8em 3em;
  margin: 10px auto;
}
</style>