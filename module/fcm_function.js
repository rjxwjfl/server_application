const messaging = require("../configs/fbConfig");
const connection = require("../configs/dbConfig");

async function backGroundPush(query, title, content, data) {
//   const query = `
//         SELECT ud.device_token
//         FROM project_members pm
//         LEFT JOIN user_dtl ud ON pm.user_id = ud.user_id
//         WHERE pm.project_id = ${id}
//     `;

  connection.query(query, (error, tokens) => {
    if (error) {
      console.log(error);
    }

    let payload = {
      notification: {
        title: title,
        body: content,
        icon: "",
      },
      data: data,
      tokens: tokens,
    };

    messaging.sendMulticast(payload).then((response) => {
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((res, index) => {
          if (!res.success) {
            failedTokens.push(deviceToken[index]);
          }
        });
        console.log("List of tokens that caused failures: " + failedTokens);
      }
    });
  });
}

module.exports = { backGroundPush };
