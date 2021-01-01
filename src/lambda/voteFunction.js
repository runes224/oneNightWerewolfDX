const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

const werewolf_connections = "werewolf_connections";
const table_rooms = "werewolf_rooms";

exports.handler = async(event) => {

  const votedUser = JSON.parse(event.body).votedUser;
  const role = JSON.parse(event.body).role;
  const outsideCards = JSON.parse(event.body).outsideCards;
  const roomId = Number(JSON.parse(event.body).roomId);
  let room;
  let resultOutsideCards = [];

  if (role === "怪盗") {
    resultOutsideCards = outsideCards;
  }

  // ユーザの数を取得する
  let users = [];
  let votedUsers = [];
  const roomsParam = {
    TableName: table_rooms,
    Key: {
      roomId: roomId
    }
  };
  try {
    room = await getRecord(roomsParam);
    console.log("room.Item.lockFlag");
    console.log(room.Item.lockFlag);
    while (room.Item.lockFlag) {
      room = await getRecord(roomsParam);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    let putParamsWerewolfRooms = {
      TableName: table_rooms,
      Item: {
        roomId: roomId,
        users: room.Item.users,
        votedUsers: room.Item.votedUsers,
        resultOutsideCards: room.Item.resultOutsideCards,
        lockFlag: true,
      }
    };
    room.Item.lockFlag = true;
    try {
      await ddb.put(putParamsWerewolfRooms).promise();
    }
    catch (err) {
      console.log("faill");
      return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
    }
    users = room.Item.users;
    if (room.Item.votedUsers !== null) votedUsers = room.Item.votedUsers;
    if (room.Item.resultOutsideCards !== null && room.Item.resultOutsideCards.length !== 0) resultOutsideCards = room.Item.resultOutsideCards;
  }
  catch (err) {
    console.log('指定したルームIDの部屋が存在しません。');
    console.log('err:' + err);
  }

  votedUsers.push(votedUser);

  if (users.length === votedUsers.length) {
    console.log("メッセージ送信");

    let postData = {
      type: "vote",
      votedUsers: votedUsers,
      resultOutsideCards: resultOutsideCards
    };

    console.log("postData");
    console.log(postData);

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    });

    const postCalls = room.Item.users.map(async({ connectionId }) => {
      try {
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(postData) }).promise();
      }
      catch (e) {
        if (e.statusCode === 410) {
          console.log(`Found stale connection, deleting ${connectionId}`);
          await ddb.delete({ TableName: werewolf_connections, Key: { connectionId } }).promise();
        }
        else {
          throw e;
        }
      }
    });

    try {
      await Promise.all(postCalls);
    }
    catch (e) {
      return { statusCode: 500, body: e.stack };
    }
    votedUsers = [];
    resultOutsideCards = [];
  }
  // const params = {
  //   TableName: table_rooms,
  //   Key: {
  //     roomId: roomId
  //   },
  //   UpdateExpression: 'ADD #votedUsers = :addUsers, SET #resultOutsideCards = :setResultOutsideCards',
  //   ExpressionAttributeNames: {
  //     '#votedUsers': 'votedUsers',
  //     '#resultOutsideCards': 'resultOutsideCards',
  //   },
  //   ExpressionAttributeValues: {
  //     ':addUsers': ddb.createSet(["test"]),
  //     // ':addUsers': ddb.createSet([votedUser]),
  //     // ':setResultOutsideCards': resultOutsideCards,
  //     ':setResultOutsideCards': "test",
  //   }
  // };

  // await ddb.update(params, function(err, data) {
  //   if (err) {
  //     console.log("err");
  //     console.log(err);
  //   }
  //   else {
  //     console.log("data");
  //     console.log(data);

  //   }
  // });

  let putParamsWerewolfRooms = {
    TableName: table_rooms,
    Item: {
      roomId: roomId,
      users: users,
      votedUsers: votedUsers,
      resultOutsideCards: resultOutsideCards,
      lockFlag: false,
    }
  };
  try {
    console.log("post");
    await ddb.put(putParamsWerewolfRooms).promise();
  }
  catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }
  return { statusCode: 200, body: 'voted.' };
};

function getRecord(params) {
  return new Promise((resolve, reject) => {

    ddb.get(params, function(err, data) {
      if (err) {
        console.log("getRecord(params) ERROR");
        reject(err);
      }
      else {
        console.log("getRecord(params) SUCCESS");
        resolve(data);
      }
    });
  });
}
