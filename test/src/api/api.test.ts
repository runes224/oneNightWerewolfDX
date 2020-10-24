type FunctionType = "join" | "roles" | "vote"

type Roles = "人狼" | "占い師" | "怪盗"

type RegisterNameResponse = {
  type: FunctionType,
  member: {
    name: string,
    gameMasterFlag: boolean,
    notExistRoomFlag: boolean,
    roomId: number
  },
  room: object
}

type User = {
  name: string,
  number: number,
  description: string
}

type Card = {
  design: string,
  name: string,
  num: number,
  role: string
  votedNum: number
}

type StartGameResponse = {
  type: FunctionType,
  userRoles: {
    testName2: Roles,
    testName1: Roles,
    notAssigned1: Roles,
    notAssigned2: Roles
  },
  nightPeriodSecond: number,
  dayPeriodMinute: number
};

type VoteResponse = {
  type: FunctionType,
  votedUsers: string[],
  resultOutsideCards: Card[]
};

describe('registerName', (): void => {
  const socket_1 = new WebSocket("wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod");
  const socket_2 = new WebSocket("wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod");
  const socket_3 = new WebSocket("wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod");
  let receivedDataList1: (RegisterNameResponse | StartGameResponse | VoteResponse)[] = [];
  let receivedDataList2: (RegisterNameResponse | StartGameResponse | VoteResponse)[] = [];
  let receivedDataList3: (RegisterNameResponse | StartGameResponse | VoteResponse)[] = [];
  let roomId: number = 0;
  let userRoles: StartGameResponse["userRoles"];

  jest.setTimeout(30000);

  socket_1.onmessage = event => {
    console.log('receive1')
    const receivedData = JSON.parse(event.data);
    if (roomId === 0) {
      roomId = receivedData.member.roomId;
    }
    receivedDataList1.push(receivedData);
  };

  socket_2.onmessage = event => {
    console.log('receive2')
    const receivedData = JSON.parse(event.data);
    receivedDataList2.push(receivedData);
  }

  socket_3.onmessage = event => {
    console.log('receive3')
    const receivedData = JSON.parse(event.data);
    receivedDataList3.push(receivedData);
  }


  test('ゲームマスターの名前登録。', async () => {
    expect.assertions(4);

    const sendData = {
      action: "registerName",
      name: "testName1",
      gameMasterFlag: true,
      roomId: ""
    };
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (1 === socket_1.readyState) {
      console.log('send1')
      socket_1.send(JSON.stringify(sendData));
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(receivedDataList1[0]).toEqual(expectRegisterNameResponse1);
    expect(receivedDataList1.length).toBe(1);
    expect(receivedDataList2.length).toBe(0);
    expect(receivedDataList3.length).toBe(0);
  });

  test('別のユーザの名前登録', async () => {
    expect.assertions(5);

    const sendData = {
      action: "registerName",
      name: "testName2",
      gameMasterFlag: false,
      roomId: roomId
    };
    if (1 === socket_2.readyState) {
      console.log('send2')
      socket_2.send(JSON.stringify(sendData));
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(receivedDataList1[1]).toEqual(expectRegisterNameResponse2);
    expect(receivedDataList2[0]).toEqual(expectRegisterNameResponse2);
    expect(receivedDataList1.length).toBe(2);
    expect(receivedDataList2.length).toBe(1);
    expect(receivedDataList3.length).toBe(0);
  });

  test('他の部屋のユーザには名前登録時にメッセージが送信されないこと。', async () => {
    expect.assertions(4);

    const sendData = {
      action: "registerName",
      name: "testName3",
      gameMasterFlag: true,
      roomId: ""
    };
    if (1 === socket_3.readyState) {
      console.log("send3")
      socket_3.send(JSON.stringify(sendData));
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(receivedDataList3[0]).toEqual(expectRegisterNameResponse3);
    expect(receivedDataList1.length).toBe(2);
    expect(receivedDataList2.length).toBe(1);
    expect(receivedDataList3.length).toBe(1);
  });

  test('ゲーム開始', async () => {
    expect.assertions(5);

    const sendData = {
      action: "startGame",
      roomId: roomId,
      roles: roles,
      users: ["testName1", "testName2"],
      nightPeriodSecond: 30,
      dayPeriodMinute: 3,
    };

    if (1 === socket_1.readyState) {
      console.log('startGame')
      socket_1.send(JSON.stringify(sendData));
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
    if ("userRoles" in receivedDataList1[2]) {
      userRoles = receivedDataList1[2].userRoles;
    }
    expect(receivedDataList1[2]).toEqual(expectStartGameResponse1);
    expect(receivedDataList2[1]).toEqual(expectStartGameResponse1);
    expect(receivedDataList1.length).toBe(3);
    expect(receivedDataList2.length).toBe(2);
    expect(receivedDataList3.length).toBe(1);
  });

  test('投票', async () => {
    expect.assertions(5);

    const sendData1 = {
      action: "vote",
      votedUser: "testName2",
      role: userRoles.testName1,
      outsideCards: [{ "name": "qwdq", "role": "怪盗", "design": "back", "num": 0, "votedNum": 0 }, { "name": "q", "role": "人狼", "design": "人狼", "num": 1, "votedNum": 0 }],
      roomId: roomId
    };

    if (1 === socket_1.readyState) {
      socket_1.send(JSON.stringify(sendData1));
    }

    const sendData2 = {
      action: "vote",
      votedUser: "testName1",
      role: userRoles.testName2,
      outsideCards: [{ "name": "qwdq", "role": "怪盗", "design": "back", "num": 0, "votedNum": 0 }, { "name": "q", "role": "人狼", "design": "人狼", "num": 1, "votedNum": 0 }],
      roomId: roomId
    };

    await new Promise(resolve => setTimeout(resolve, 3000));
    if (1 === socket_2.readyState) {
      socket_2.send(JSON.stringify(sendData2));
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    expect(receivedDataList1[3]).toEqual(expectVoteResponse);
    expect(receivedDataList2[2]).toEqual(expectVoteResponse);
    expect(receivedDataList1.length).toBe(4);
    expect(receivedDataList2.length).toBe(3);
    expect(receivedDataList3.length).toBe(1);
  });

  test('websocket server 1 との接続を切断できること.', (done) => {
    expect.assertions(1);
    socket_1.onclose = event => {
      expect(event.wasClean).toBe(true);
      done();
    };
    socket_1.close();
  });

  test('websocket server 2 との接続を切断できること.', (done) => {
    expect.assertions(1);
    socket_2.onclose = event => {
      expect(event.wasClean).toBe(true);
      done();
    };
    socket_2.close();
  });

  test('websocket server 3 との接続を切断できること.', (done) => {
    expect.assertions(1);
    socket_3.onclose = event => {
      expect(event.wasClean).toBe(true);
      done();
    };
    socket_3.close();
  });
})

const roles: User[] = [
  { name: "村人", number: 0, description: "狼の嘘を見破りましょう" },
  { name: "人狼", number: 2, description: "村人を欺きましょう" },
  {
    name: "占い師",
    number: 1,
    description: "誰かのカードか余ったカードを確認できます",
  },
  { name: "怪盗", number: 1, description: "誰かのカードと交換できます" },
  {
    name: "軍人",
    number: 0,
    description: "村人よりちょっとだけ強いです",
  },
  {
    name: "狂人",
    number: 0,
    description: "人狼陣営の勝利があなたの勝利です",
  },
  {
    name: "吊人",
    number: 0,
    description: "処刑されるとゲームに勝利します",
  },
]

const expectRegisterNameResponse1: RegisterNameResponse = {
  type: "join",
  member: {
    name: "testName1",
    gameMasterFlag: true,
    notExistRoomFlag: false,
    roomId: expect.any(Number)
  },
  room: expect.any(Object)
}

const expectRegisterNameResponse2: RegisterNameResponse = {
  type: "join",
  member: {
    name: "testName2",
    gameMasterFlag: false,
    notExistRoomFlag: false,
    roomId: expect.any(Number)
  },
  room: expect.any(Object)
}

const expectRegisterNameResponse3: RegisterNameResponse = {
  type: "join",
  member: {
    name: "testName3",
    gameMasterFlag: true,
    notExistRoomFlag: false,
    roomId: expect.any(Number)
  },
  room: expect.any(Object)
}

const expectStartGameResponse1: StartGameResponse = {
  type: "roles",
  userRoles: {
    testName2: expect.any(String),
    testName1: expect.any(String),
    notAssigned1: expect.any(String),
    notAssigned2: expect.any(String)
  },
  nightPeriodSecond: 30,
  dayPeriodMinute: 3
}

const expectVoteResponse: VoteResponse = {
  type: "vote",
  votedUsers: ["testName2", "testName1"],
  resultOutsideCards: [{ "name": "qwdq", "role": "怪盗", "design": "back", "num": 0, "votedNum": 0 }, { "name": "q", "role": "人狼", "design": "人狼", "num": 1, "votedNum": 0 }]
}