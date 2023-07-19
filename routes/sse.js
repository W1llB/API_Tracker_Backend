function writeEvent(res, sseId) {
  res.write(`id: ${sseId}`);
  res.write(`Hello`);

  //   request.on("close", () => {
  //     console.log("Connection closed.");
  //   });
}

function sendEvent(request, response) {
  response.writeHead(200, {
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
  });
  const sseId = new Date().toDateString();

  setInterval(() => {
    writeEvent(request, sseId);
  }, 2000);
}

export { writeEvent, sendEvent };
