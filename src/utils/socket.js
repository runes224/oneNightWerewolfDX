import Vue from "vue"
import store from '../stores/store'
import router from '../router'

const socket = new WebSocket("wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod");

const emitter = new Vue({
  methods: {
    send(message) {
      console.log('send')
      console.log(message)
      if (1 === socket.readyState) {
        socket.send(message)
      }
    }
  }
})

socket.onmessage = msg => {
  console.log('received')
  const receivedData = JSON.parse(msg.data);
  console.log(receivedData)
  switch (receivedData.type) {
    case "join":
      join(receivedData);
      break;
    case "roles":
      roles(receivedData);
      break;
    case "vote":
      vote(receivedData);
      break;
    default:
      console.log(receivedData);
      addMessage("予期せぬデータを受信しました");
  }
};

const join = (receivedData) => {
  console.log("join")
  const joinMember = receivedData.member;
  const gameMasterFlag = store.getters['modules/isGameMaster'];
  const roomId = store.getters['modules/roomId'];
  const myName = store.getters['modules/myName'];

  if (joinMember.notExistRoomFlag === true && joinMember.name === myName) {
    addMessage("指定したルームID(" + roomId + ")の部屋が存在しません。もう一度接続し直してください。");
  } else if (gameMasterFlag === true && joinMember.name === myName) {
    addMessage("部屋を作成しました。");
    addMessage("ルームIDは" + joinMember.roomId + "です。");
    store.dispatch('modules/setRoomId', joinMember.roomId);
  } else {
    addMessage(joinMember.name + "が入室しました。");
  }
  store.dispatch('modules/addUser', joinMember.name)
}

const roles = (receivedData) => {
  let receivedRoles = receivedData.userRoles;
  const myName = store.getters['modules/myName'];
  const myRole = receivedRoles[myName];
  const roles = store.getters['modules/roles'];

  store.dispatch('modules/setNightPeriodSecond', receivedData.nightPeriodSecond);
  store.dispatch('modules/setDayPeriodMinute', receivedData.dayPeriodMinute);

  clearMessages();
  addMessage("あなたの役職は" + myRole + "です。");
  roles.forEach(role => {
    if (role.name === myRole) {
      addMessage(role.description);
    }
  });
  if (myRole === "占い師" || myRole === "怪盗") {
    addMessage("夜の行動を行ってください。");
  }

  // カードを配る
  let i = 0;
  let insideCards = [];
  let outsideCards = [];
  Object.entries(receivedRoles).map(([key, value]) => {
    let obj = {};
    if (key == myName) {
      obj = {
        name: key,
        role: value,
        design: value,
        num: i,
        votedNum: 0
      };
    } else {
      obj = {
        name: key,
        role: value,
        design: "back",
        num: i,
        votedNum: 0
      };
    }
    if (obj.name.match(/^notAssigned/)) {
      insideCards.push(obj);
    } else {
      outsideCards.push(obj);
    }
    i++;
  });
  if (myRole == "人狼") {
    outsideCards.forEach(card => {
      if (card.role === "人狼" && card.name !== myName) {
        card.design = card.role;
        outsideCards.splice(card.num, 1, card);
        addMessage(card.name + "さんも人狼です");
      }
    });
  }
  store.dispatch('modules/setMyRole', myRole);
  store.dispatch('modules/setInsideCards', insideCards);
  store.dispatch('modules/setOutsideCards', outsideCards);
  router.push('/playingGame');
}

const vote = (receivedData) => {
  let votedUsers = receivedData.votedUsers;
  let resultOutsideCards = receivedData.resultOutsideCards;
  const insideCards = store.getters["modules/insideCards"];
  const outsideCards = store.getters["modules/outsideCards"];
  if (resultOutsideCards.length === 0) {
    resultOutsideCards = outsideCards;
  }

  votedUsers.forEach(votedUser => {
    resultOutsideCards.map(card => {
      if (card.name === votedUser) {
        card.votedNum++;
      }
    });
  });
  const votedNumList = resultOutsideCards.map(card => Number(card.votedNum));
  const maxNum = Math.max.apply(null, votedNumList);
  const executioners = resultOutsideCards.filter(
    card => card.votedNum === maxNum
  );
  clearMessages();
  executioners.forEach(executioner => {
    addMessage(executioner.name + "が処刑されました");
  });
  const hangingPersonVictoryCondition = executioners.filter(executioner => executioner.role === "吊人").length > 0;
  const werewolfVictoryCondition = executioners.filter(executioner => executioner.role === "人狼").length > 0;
  if (hangingPersonVictoryCondition === true) {
    addMessage("吊人が処刑されたので吊人の勝利です");
  } else if (hangingPersonVictoryCondition === false && werewolfVictoryCondition === true) {
    addMessage("人狼を処刑したので村人陣営の勝利です");
  } else {
    addMessage(
      "村人陣営のユーザが処刑されたので人狼陣営の勝利です"
    );
  }
  insideCards.map(card => card.design = card.role);
  resultOutsideCards.map(card => card.design = card.role);
  store.dispatch('modules/setInsideCards', insideCards);
  store.dispatch('modules/setOutsideCards', resultOutsideCards);
  store.dispatch('modules/finishGame');
}

socket.onopen = msg => {
  console.log(msg);
  console.log("Successfully connected to the echo websocket server...");
};

socket.onerror = function (err) {
  console.log("error", err)
  addMessage("エラーが発生しました");
}

const addMessage = (message) => {
  store.dispatch('modules/addMessage', message);
}

const clearMessages = () => {
  store.dispatch('modules/clearMessages');
}

export default emitter