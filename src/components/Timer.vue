<template>
  <div v-if="isShowTime" class="timer">
    <div class="time"></div>
    <div>残り時間：{{ formatTime }}</div>
  </div>
</template>

<script>
export default {
  name: "Timer",
  props: {
    nightPeriodSecond: {
      type: Number,
      default: 20
    },
    dayPeriodMinute: {
      type: Number,
      default: 5
    },
  },
  data() {
    return {
      min: 0,
      sec: this.nightPeriodSecond,
      timerObj: null,
      doneNightActionFlag: false,
    };
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
    },
    isShowTime: function() {
      return this.min + this.sec > 0;
    }
  },
  watch: {
    second: {
      immediate: true,
      handler: function() {
        this.start();
      }
    }
  },
  methods: {
    count: function() {
      if (this.sec <= 0 && this.min >= 1) {
        this.min--;
        this.sec = 59;
      } else if (this.sec <= 0 && this.min <= 0) {
        if (this.doneNightActionFlag === true) {
          clearTimeout(this.timerObj);
          this.$emit('start-voting');
          return false;
        }
        this.min = this.dayPeriodMinute;
        this.$store.dispatch("modules/clearMessages");
        this.$store.dispatch("modules/addMessage", "夜が明けました。議論を始めてください。");
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