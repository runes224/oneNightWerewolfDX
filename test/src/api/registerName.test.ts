type RegisterNameResponse = {
  type: string,
  member: {
    name: string,
    gameMasterFlag: boolean,
    notExistRoomFlag: boolean,
    roomId: number
  },
  room: object
}

describe('registerName', (): void => {
  const socket_1 = new WebSocket("wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod");
  const socket_2 = new WebSocket("wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod");
  const socket_3 = new WebSocket("wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod");
  let receivedDataList1: RegisterNameResponse[] = [];
  let receivedDataList2: RegisterNameResponse[] = [];
  let receivedDataList3: RegisterNameResponse[] = [];
  let roomId: number;

  jest.setTimeout(30000);

  socket_1.onmessage = event => {
    console.log('receive1')
    const receivedData = JSON.parse(event.data);
    roomId = receivedData.member.roomId;
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

    const sendData1 = {
      action: "registerName",
      name: "testName1",
      gameMasterFlag: true,
      roomId: ""
    };
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (1 === socket_1.readyState) {
      console.log('send1')
      socket_1.send(JSON.stringify(sendData1));
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(receivedDataList1[0]).toEqual(expectRegisterNameResponse1);
    expect(receivedDataList1.length).toBe(1);
    expect(receivedDataList2.length).toBe(0);
    expect(receivedDataList3.length).toBe(0);
  });

  test('別のユーザの名前登録', async () => {
    expect.assertions(5);

    const sendData2 = {
      action: "registerName",
      name: "testName2",
      gameMasterFlag: false,
      roomId: roomId
    };
    if (1 === socket_2.readyState) {
      console.log('send2')
      socket_2.send(JSON.stringify(sendData2));
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