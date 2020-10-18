describe('registerName', (): void => {
  jest.setTimeout(30000);
  const socket_1 = new WebSocket("wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod");
  const socket_2 = new WebSocket("wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod");
  const socket_3 = new WebSocket("wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod");

  test.concurrent('1人目の名前の登録ができること。', async () => {
    expect.assertions(2);
    let i = 0;
    socket_1.onmessage = event => {
      const receivedData = JSON.parse(event.data);
      if (i === 0) {
        expect(receivedData).toEqual(expectReceivedData1);
        i++;
      } else {
        expect(receivedData).toEqual(expectReceivedData2);
      }
    };

    const sendData1 = {
      action: "registerName",
      name: "testName1",
      gameMasterFlag: true,
      roomId: "12345"
    };
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (1 === socket_1.readyState) {
      console.log('send1')
      socket_1.send(JSON.stringify(sendData1));
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  test.concurrent('2人目の名前の登録ができること.', async () => {
    expect.assertions(4);
    let i = 0;
    socket_2.onmessage = event => {
      const receivedData = JSON.parse(event.data);
      if (i === 0) {
        expect(receivedData).toEqual(expectReceivedData1);
        i++;
      } else {
        expect(receivedData).toEqual(expectReceivedData2);
      }
    }

    const sendData2 = {
      action: "registerName",
      name: "testName2",
      gameMasterFlag: false,
      roomId: "12345"
    };
    await new Promise(resolve => setTimeout(resolve, 3000));
    if (1 === socket_2.readyState) {
      console.log('send2')
      socket_2.send(JSON.stringify(sendData2));
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  test.concurrent('他の部屋のユーザにはメッセージが送信されないこと。', async () => {
    expect.assertions(5);
    let i = 0;
    socket_3.onmessage = () => {
      i++;
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    expect(i).toBe(0);
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

const expectReceivedData1 = {
  type: "join",
  member: {
    name: "testName1",
    gameMasterFlag: true,
    notExistRoomFlag: false,
    roomId: expect.any(Number)
  },
  room: expect.any(Object)
}

const expectReceivedData2 = {
  type: "join",
  member: {
    name: "testName2",
    gameMasterFlag: false,
    notExistRoomFlag: true,
    roomId: expect.any(Number)
  },
  room: expect.any(Object)
}