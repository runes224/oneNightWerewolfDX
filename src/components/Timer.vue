<template>
  <div class="timer">
    <div class="time" v-html="msg"></div><div v-if="!startVotingFlag">残り時間：{{ formatTime }}</div>
  </div>
</template>

<script>
export default {
  name: "timer",
  props: ["seccond"],
  data() {
    return {
      min: 0,
      sec: this.seccond,
      timerObj: null,
      msg: "",
      doneNightActionFlag: false,
      startVotingFlag: false,
    };
  },
  methods: {
    count: function() {
      if (this.sec <= 0 && this.min >= 1) {
        this.min--;
        this.sec = 59;
      } else if (this.sec <= 0 && this.min <= 0) {
        if (this.doneNightActionFlag == true) {
          clearTimeout(this.timerObj);
          this.startVotingFlag = true;
          this.msg = "議論の時間が終わりました。<br>投票をしてください。";
          this.$emit('startVoting');
          return false;
        }
        this.min = 5;
        // this.sec = 5;
        this.msg = "夜が明けました。議論を始めてください。";
        this.doneNightActionFlag = true;
      } else {
        this.sec--;
      }
    },

    start: function() {
      let self = this;
      this.timerObj = setInterval(function() {
        self.count();
      }, 1000);
    },

    stop: function() {
      clearInterval(this.timerObj);
    },

  },
  watch: {
    second: {
      immediate: true,
      handler: function() {
        this.msg = "夜の行動を行ってください。";
        this.start();
      }
    }
  },
  computed: {
    formatTime: function() {
      let timeStrings = [this.min.toString(), this.sec.toString()].map(function(
        str
      ) {
        if (str.length < 2) {
          return "0" + str;
        } else {
          return str;
        }
      });
      return timeStrings[0] + ":" + timeStrings[1];
    }
  }
};
</script>

<style scoped>
.timer {
  justify-content: center;
  display: flex;
  flex-direction: column;
}
.time {
  font-size: 1rem;
}
</style>