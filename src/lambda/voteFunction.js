const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

const werewolf_connections = "werewolf_connections";
const table_rooms = "werewolf_rooms";

exports.handler = async (event) => {

  const votedUser = JSON.parse(event.body).votedUser;
  const role = JSON.parse(event.body).role;
  const outsideCards = JSON.parse(event.body).outsideCards;
  const roomId = Number(JSON.parse(event.body).roomId);
  // let room;
  let resultOutsideCards = [];

  if (role === "怪盗") {
    resultOutsideCards = outsideCards;
  }

  let params = {
    TableName: table_rooms,
    Key: {
      "roomId": roomId
    },
    ExpressionAttributeNames: { '#lockFlag': 'lockFlag' },
    ExpressionAttributeValues: { ':false': false, ':true': true },
    ConditionExpression: "#lockFlag = :false",
    UpdateExpression: 'SET #lockFlag = :true'
  };
  let res = null;
  while (res === null) {
    res = await updateRecord(params);
  }

  // ユーザの数を取得する
  let room;
  let users = [];
  let votedUsers = [];
  const roomsParam = {
    TableName: table_rooms,
    Key: {
      roomId: roomId
    },
    ConsistentRead: true
  };
  try {
    room = await getRecord(roomsParam);
    // ユーザ全員の数を把握する
    users = room.Item.users;
    if (room.Item.votedUsers !== null) {votedUsers = room.Item.votedUsers;}
    if (room.Item.resultOutsideCards !== null && room.Item.resultOutsideCards.length !== 0) {resultOutsideCards = room.Item.resultOutsideCards;}
  }
  catch (err) {
    console.log('指定したルームIDの部屋が存在しません。');
    console.log('err:' + err);
  }

  votedUsers.push(votedUser);

  // ユーザ全員が投票してたら、メッセージ送信
  if (users.length === votedUsers.length) {
    let postData = {
      type: "vote",
      votedUsers: votedUsers,
      resultOutsideCards: resultOutsideCards
    };

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    });

    const postCalls = room.Item.users.map(async ({ connectionId }) => {
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
    await ddb.put(putParamsWerewolfRooms).promise();
  }
  catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }
  return { statusCode: 200, body: 'voted.' };
};

function getRecord(params) {
  return new Promise((resolve, reject) => {

    ddb.get(params, function (err, data) {
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


async function updateRecord(params) {
  try {
    console.log("set a lockFlag");
    return await ddb.update(params).promise();
  } catch (e) {
    if (e.code === 'ConditionalCheckFailedException') {
      console.log('ConditionalCheckFailedException');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return null;
    }
    throw e;
  }
}
