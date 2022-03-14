import {Kraken} from "./";

// works with zero nonce window
(async () => {
  const k = new Kraken(
      {...require("./auth.json"), gennonce : () => Date.now() * 1000});

  const p1 = k.getWebSocketsToken();

  console.log(await p1);
})();

// // MAY fail with zero nonce window
// (async () => {
//   const k = new Kraken(require("./auth.json"));

//   const p1 = k.getWebSocketsToken();
//   const p2 = k.getWebSocketsToken();

//   console.log(await p1);
//   console.log(await p2);
// })();

// // works with zero nonce window
// (async () => {
//   const k = new Kraken(require("./auth.json"));

//   console.log(await k.getWebSocketsToken());
//   console.log(await k.getWebSocketsToken());
// })();
