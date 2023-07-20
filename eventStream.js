import { getApis, updateApiResponse } from "./models/index.js";

export default function eventStream(req, res) {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client
  console.log("client connected");
  setInterval(() => checkStatusChange(res), 30000);
  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    res.end();
  });
}

function sendFetchEvent(res) {
  res.write(`data: true\n\n`);
}

async function checkStatusChange(res) {
  const apiList = await getApis();
  let apiListUpdated = JSON.parse(JSON.stringify(apiList));
  for (const api of apiListUpdated) {
    try {
      async () => {
        const response = await fetch(api["endpoint_url"]);
        if (response.ok) {
          api.status = 1;
        } else {
          api.status = 0;
        }
        api["response_code"] = response.status;
      };
    } catch (err) {
      console.log(err.message);
    }
  }
  console.log("updated", apiListUpdated);

  for (let i = 0; i < apiList.length; i++) {
    if (apiList[i].status !== apiListUpdated[i].status) {
      // updateApiResponse(apiListUpdated[i])
      sendFetchEvent(res);
      break;
    }
  }
  // get list of apis from database at interval
  // create copy
  // send fetch requests to api end points and update copy
  // sendEvent to trigger getRequest on front end
}

// function writeEvent(res, sseId) {
//   res.write(`id: ${sseId}`);
//   res.write(`Hello`);

//   //   request.on("close", () => {
//   //     console.log("Connection closed.");
//   //   });
// }

// function sendEvent(request, response) {
//   response.writeHead(200, {
//     "Cache-Control": "no-cache",
//     Connection: "keep-alive",
//     "Content-Type": "text/event-stream",
//   });
//   const sseId = new Date().toDateString();

//   setInterval(() => {
//     writeEvent(request, sseId);
//   }, 2000);
// }

// export { writeEvent, sendEvent };
