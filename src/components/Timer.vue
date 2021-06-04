<template>
  <div v-if="isShowTime" class="timer">
    <div class="time"></div>
    <div>残り時間：{{ formatTime }}</div>
  </div>
</template>

<script>
import { reactive, computed, onMounted } from "@vue/composition-api";

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
    }
  },
  setup(props, context) {
    const store = context.root.$store;

    const state = reactive({
      min: 0,
      sec: props.nightPeriodSecond,
      timerObj: null,
      doneNightActionFlag: false
    });

    const formatTime = computed(() => {
      let timeStrings = [state.min.toString(), state.sec.toString()].map(
        function (str) {
          if (str.length < 2) {
            return "0" + str;
          } else {
            return str;
          }
        }
      );
      return timeStrings[0] + ":" + timeStrings[1];
    });

    const isShowTime = computed(() => {
      return state.min + state.sec > 0;
    });

    const count = () => {
      if (state.sec <= 0 && state.min >= 1) {
        state.min--;
        state.sec = 59;
      } else if (state.sec <= 0 && state.min <= 0) {
        if (state.doneNightActionFlag === true) {
          console.log("state.doneNightActionFlag === true");
          clearTimeout(state.timerObj);
          context.emit("start-voting");
          return false;
        }
        state.min = props.dayPeriodMinute;
        store.dispatch("modules/clearMessages");
        store.dispatch(
          "modules/addMessage",
          "夜が明けました。議論を始めてください。"
        );
        state.doneNightActionFlag = true;
      } else {
        state.sec--;
      }
    };

    const start = () => {
      state.timerObj = setInterval(function () {
        count();
      }, 1000);
    };

    onMounted(() => {
      start();
    });

    return {
      state,
      formatTime,
      isShowTime,
      count,
      start
    };
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
