import Vue from "vue"
import store from '../stores/store'

const socket = new WebSocket("wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod")

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
    store.dispatch('modules/setRoomId', joinMember.roomId)
  } else {
    addMessage(joinMember.name + "が入室しました。");
  }
  store.dispatch('modules/addUser', joinMember.name)
}

const roles = (receivedData) => {
  console.log(receivedData)
  const myName = store.getters['modules/myName'];
  let receivedRoles = receivedData.userRoles;
  this.role = receivedRoles[myName];
  clearMessages();
  addMessage("あなたの役職は" + this.role + "です。");
  this.roles.forEach(role => {
    if (role.name === this.role) {
      addMessage(role.description);
    }
  });

  // カードを配る
  let i = 0;
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
      this.insideCards.push(obj);
    } else {
      this.outsideCards.push(obj);
    }
    i++;
  });
  if (this.role == "人狼") {
    this.outsideCards.forEach(card => {
      if (card.role === "人狼" && card.name !== myName) {
        card.design = card.role;
        this.outsideCards.splice(card.num, 1, card);
        addMessage(card.name + "さんも人狼です");
      }
    });
  }
  // this.nightPeriodSecond = 5;
  this.nightPeriodSecond = 20;
}

const vote = (receivedData) => {
  console.log(receivedData)
  // if (receivedData.role == "怪盗") {
  //   this.resultOutsideCards = receivedData.outsideCards;
  // }
  // let votedUser = receivedData.votedUser;
  // this.outsideCards.forEach(card => {
  //   if (card.name == votedUser) {
  //     card.votedNum++;
  //     this.outsideCards.splice(card.num, 1, card);
  //   }
  // });
  // this.votedCounter++;
  // if (this.votedCounter >= this.users.length) {
  //   // 勝敗を決める
  //   let maxNum = Math.max(
  //     ...this.outsideCards.map(card => card.votedNum)
  //   );
  //   let victims = this.outsideCards.filter(
  //     card => card.votedNum == maxNum
  //   );
  //   clearMessages();
  //   victims.forEach(victim => {
  //     addMessage(victim.name + "が処刑されました");
  //   });
  //   if (victims.filter(victim => victim.role == "人狼").length > 0) {
  //     addMessage("人狼を処刑したので村人陣営の勝利です");
  //   } else {
  //     addMessage(
  //       "村人陣営のユーザが処刑されたので人狼陣営の勝利です"
  //     );
  //   }
  //   for (let index = 0; index < 2; index++) {
  //     let card = this.insideCards[index];
  //     card.design = card.role;
  //     this.insideCards.splice(index, 1, card);
  //   }
  //   this.outsideCards.forEach(card => {
  //     if (this.resultOutsideCards.length > 0) {
  //       let resultCard = this.resultOutsideCards.filter(
  //         resultCard => resultCard.name === card.name
  //       )[0];
  //       card.design = resultCard.role;
  //     } else {
  //       card.design = card.role;
  //     }
  //     this.outsideCards.splice(card.num, 1, card);
  //   });
  //   this.status = "resultAnnouncement";
  // }
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