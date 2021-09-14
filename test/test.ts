/**** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 ***                                                                          *
 **                _          _              _                              _ *
 * _ __   ___   __| | ___    | | ___ __ __ _| | _____ _ __       __ _ _ __ (_)*
 *| '_ \ / _ \ / _` |/ _ \___| |/ / '__/ _` | |/ / _ \ '_ \ ___ / _` | '_ \| |*
 *| | | | (_) | (_| |  __/___|   <| | | (_| |   <  __/ | | |___| (_| | |_) | |*
 *|_| |_|\___/ \__,_|\___|   |_|\_\_|  \__,_|_|\_\___|_| |_|    \__,_| .__/|_|*
 *                                                                   |_|      *
 *                @link http://github.com/jpcx/node-kraken-api                *
 *                                                                            *
 * @license MIT                                                               *
 * @copyright 2020, 2021 @author Justin Collier <m@jpcx.dev>                  *
 *                                                                            *
 * Permission is hereby granted, free of charge, to any person obtaining a    *
 * copy of this software and associated documentation files (the "Software"), *
 * to deal in the Software without restriction, including without limitation  *
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,   *
 * and/or sell copies of the Software, and to permit persons to whom the      *
 * Software is furnished to do so, subject to the following conditions:       *
 *                                                                            *
 * The above copyright notice and this permission notice shall be included    *
 * in all copies or substantial portions of the Software.                     *
 *                                                                            *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,   *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL    *
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING    *
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER       **
 * DEALINGS IN THE SOFTWARE.                                                ***
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ****/

import * as fs from "fs";
import { test } from "@jpcx/testts";
import assert from "assert";

import * as _ from "../";

// Authentication required for testing
// Key management (OTP) must be turned off for this key.
// Make sure that the key has view permissions only!!!
const auth: { key: string; secret: string } = JSON.parse(fs.readFileSync("./auth.json", "utf8"));
assert(auth instanceof Object);
assert(typeof auth.key === "string" && auth.key);
assert(typeof auth.secret === "string" && auth.secret);

test("main", async (test) => {
  await test("Kraken", async (test) => {
    test("Default Construciton", () => {
      new _.Kraken();
    });

    test.throws(_.Kraken.SettingsError, "Key provided without secret")("Key without secret", () => {
      new _.Kraken({ key: "foo" });
    });

    test.throws(_.Kraken.SettingsError, "Secret provided without key")("Secret without key", () => {
      new _.Kraken({ secret: "foo" });
    });

    await test(".request()", async (test) => {
      await test("performs a public  request", async () => {
        const k = new _.Kraken();
        const res = await k.request("Time", null, "public", "utf8");
        assert(res instanceof Object);
        type T = _.Kraken.Time;
        assert(typeof (<T>res).unixtime === "number");
        assert(typeof (<T>res).rfc1123 === "string");
      });
      await test("performs a private request", async () => {
        const k = new _.Kraken(auth);
        const res = await k.request("GetWebSocketsToken", null, "private", "utf8");
        assert(res instanceof Object);
        type T = _.Kraken.GetWebSocketsToken;
        assert(typeof (<T>res).token === "string");
        assert(typeof (<T>res).expires === "number");
      });
    });

    await test("Named requests", async (test) => {
      await test(".time()", async () => {
        const k = new _.Kraken();
        const res = await k.time();
        assert(res instanceof Object);
        type T = _.Kraken.Time;
        assert(typeof (<T>res).unixtime === "number");
        assert(typeof (<T>res).rfc1123 === "string");
      });

      await test(".getWebSocketsToken()", async () => {
        const k = new _.Kraken(auth);
        const res = await k.getWebSocketsToken();
        assert(res instanceof Object);
        type T = _.Kraken.GetWebSocketsToken;
        assert(typeof (<T>res).token === "string");
        assert(typeof (<T>res).expires === "number");
      });
    });

    await test(".ws", async (test) => {
      const k = new _.Kraken(auth);
      // k.ws.pub.on('read', console.log)
      test("connections", () => {
        assert(k.ws.pub instanceof _.Kraken.WS.Connection);
        assert(k.ws.priv instanceof _.Kraken.WS.Connection);
        assert(k.ws.pub.state === "closed");
        assert(k.ws.priv.state === "closed");
      });

      await test("public subscriptions", async (test) => {
        await test(".ticker()", async () => {
          const ticker = k.ws.ticker();
          await ticker.subscribe("XBT/USD");
          const [update, pair] = await ticker.once("update");
          assert(update instanceof Object && !(update instanceof Array));
          assert(pair === "XBT/USD");
          await ticker.unsubscribe("XBT/USD");
        });

        assert(k.ws.pub.state === "open");

        await test(".book()", async (test) => {
          await test("standard", async () => {
            const book = k.ws.book({ depth: 100 });
            await book.subscribe("XBT/USD");

            const [snapshot, snappair] = await book.once("snapshot");
            assert(snapshot.as.length === 100);
            assert(snapshot.bs.length === 100);
            assert(snappair === "XBT/USD");

            const [ask, askpair] = await book.once("ask");
            assert(ask.a);
            assert(askpair === "XBT/USD");

            const [bid, bidpair] = await book.once("bid");
            assert(bid.b);
            assert(bidpair === "XBT/USD");

            await book.unsubscribe("XBT/USD");
          });

          await test("mirror; multiple subscriptions, resubscriptions", async () => {
            const book = k.ws.book({ depth: 10 });
            await book.subscribe("XBT/USD", "ETH/USD");

            function copybookres([book]: [
              _.Kraken.WS.Book.Mirror,
              string
            ]): _.Kraken.WS.Book.Mirror {
              const res: _.Kraken.WS.Book.Mirror = { as: [], bs: [] };
              for (const as of book.as) res.as.push([...as]);
              for (const bs of book.bs) res.bs.push([...bs]);
              return res;
            }

            const xbtMirror0 = copybookres(
              await book.once("mirror", { filter: (_, pair) => pair === "XBT/USD" })
            );
            const ethMirror0 = copybookres(
              await book.once("mirror", { filter: (_, pair) => pair === "ETH/USD" })
            );

            const xbtMirror1 = copybookres(
              await book.once("mirror", { filter: (_, pair) => pair === "XBT/USD" })
            );
            const ethMirror1 = copybookres(
              await book.once("mirror", { filter: (_, pair) => pair === "ETH/USD" })
            );

            assert(xbtMirror0.as.length === 10);
            assert(xbtMirror0.bs.length === 10);
            assert(ethMirror0.as.length === 10);
            assert(ethMirror0.bs.length === 10);

            assert(xbtMirror1.as.length === 10);
            assert(xbtMirror1.bs.length === 10);
            assert(ethMirror1.as.length === 10);
            assert(ethMirror1.bs.length === 10);

            assert.notDeepStrictEqual(xbtMirror0, ethMirror0);
            assert.notDeepStrictEqual(xbtMirror1, ethMirror1);

            assert.notDeepStrictEqual(xbtMirror0, xbtMirror1);
            assert.notDeepStrictEqual(ethMirror0, ethMirror1);

            await book.unsubscribe("ETH/USD");

            let didResubscribe = false;
            let didReReceive = false;

            book.once(
              "mirror",
              () => {
                didReReceive = true;
                assert(didResubscribe);
              },
              { filter: (_, pair) => pair === "ETH/USD" }
            );

            assert(book.subscriptions.size === 1);
            assert([...book.subscriptions][0].status.pair === "XBT/USD");

            const xbtMirror2 = copybookres(
              await book.once("mirror", { filter: (_, pair) => pair === "XBT/USD" })
            );

            assert(xbtMirror2.as.length === 10);
            assert(xbtMirror2.bs.length === 10);
            assert(xbtMirror2.as.length === 10);
            assert(xbtMirror2.bs.length === 10);

            assert.notDeepStrictEqual(xbtMirror1, xbtMirror2);

            await book.subscribe("ETH/USD");
            didResubscribe = true;

            const xbtMirror3 = copybookres(
              await book.once("mirror", { filter: (_, pair) => pair === "XBT/USD" })
            );
            const ethMirror2 = copybookres(
              await book.once("mirror", { filter: (_, pair) => pair === "ETH/USD" })
            );

            const xbtMirror4 = copybookres(
              await book.once("mirror", { filter: (_, pair) => pair === "XBT/USD" })
            );
            const ethMirror3 = copybookres(
              await book.once("mirror", { filter: (_, pair) => pair === "ETH/USD" })
            );

            assert(xbtMirror3.as.length === 10);
            assert(xbtMirror3.bs.length === 10);
            assert(ethMirror2.as.length === 10);
            assert(ethMirror2.bs.length === 10);

            assert(xbtMirror4.as.length === 10);
            assert(xbtMirror4.bs.length === 10);
            assert(ethMirror3.as.length === 10);
            assert(ethMirror3.bs.length === 10);

            assert.notDeepStrictEqual(xbtMirror3, ethMirror2);
            assert.notDeepStrictEqual(xbtMirror4, ethMirror3);

            assert.notDeepStrictEqual(xbtMirror2, xbtMirror3);
            assert.notDeepStrictEqual(xbtMirror3, xbtMirror4);

            assert.notDeepStrictEqual(ethMirror2, ethMirror3);

            assert(didReReceive);
          });
        });
      });

      await test("private subscriptions", async (test) => {
        const k = new _.Kraken(auth);
        const { token } = await k.getWebSocketsToken();
        assert(typeof token === "string");
        await test(".ownTrades()", async () => {
          const ownTrades = k.ws.ownTrades({ token, snapshot: true });
          await ownTrades.subscribe();
          const [snapshot, sequence] = await ownTrades.once("update");
          assert(snapshot instanceof Array);
          assert(typeof sequence === "number");
          await ownTrades.unsubscribe();
        });
      });
    });

    await test("Emitter", async () => {
      const e = new _.Kraken.Emitter();

      let received: string = "";
      const l = (recv: string) => {
        received = recv;
      };

      e.on("foo", l);
      assert(received === "");

      // test on/emit
      e.emit("foo", "bar");
      assert((received as string) === "bar");

      // on remains
      e.emit("foo", "baz");
      assert((received as string) === "baz");

      // test all off
      e.off();
      e.emit("foo", "beh");
      assert((received as string) === "baz");

      // reset
      e.on("foo", l);
      e.emit("foo", "bar");
      assert((received as string) === "bar");

      // test all event off
      e.off("foo");
      e.emit("foo", "beh");
      assert((received as string) === "bar");

      // reset
      e.on("foo", l);
      e.emit("foo", "bar");
      assert((received as string) === "bar");

      // test listener off
      e.off("foo", l);
      e.emit("foo", "beh");
      assert((received as string) === "bar");

      // test once (cb)
      e.once("foo", l);
      e.emit("foo", "baar");
      assert((received as string) === "baar");
      e.emit("foo", "baaz");
      assert((received as string) === "baar");

      // test once (promise)
      setTimeout(() => e.emit("foo", "fooo"), 0);
      assert((await e.once("foo"))[0] === "fooo");
    });

    await test("WS", async (test) => {
      await test("Connection", async (test) => {
        await test("state cycle", async (test) => {
          const con = new _.Kraken.WS.Connection(_._WS_PUB_HOSTNAME, () => 1000);

          await test("Init state", () => {
            assert(con.state === "closed");
            assert(con.hostname === _._WS_PUB_HOSTNAME);
            assert(con.socket === null);
          });

          await test.throws("closing init throws", async () => {
            await con.close();
          });

          await test("opening", async () => {
            const oncestatestart = con.once("state");
            const onceopenstart = con.open();
            assert((await oncestatestart)[0] === "opening");
            assert(con.state === "opening");
            const onceopen = con.once("open");
            const oncestateopen = con.once("state");
            await onceopen;
            await onceopenstart;
            assert((await oncestateopen)[0] === "open");
            assert((con.state as string) === "open");
          });

          await test.throws("opening open throws", async () => {
            await con.open();
          });

          await test("closing open", async () => {
            const oncestatestart = con.once("state");
            const onceclosestart = con.close();
            assert((await oncestatestart)[0] === "closing");
            assert(con.state === "closing");
            const onceclose = con.once("close");
            const oncestateclosed = con.once("state");
            await onceclose;
            await onceclosestart;
            assert((await oncestateclosed)[0] === "closed");
            assert((con.state as string) === "closed");
          });

          await test.throws("closing closed throws", async () => {
            await con.close();
          });

          await test("re-opening closed", async () => {
            const oncestatestart = con.once("state");
            const onceopenstart = con.open();
            assert((await oncestatestart)[0] === "opening");
            assert(con.state === "opening");
            const onceopen = con.once("open");
            const oncestateopen = con.once("state");
            await onceopen;
            await onceopenstart;
            assert((await oncestateopen)[0] === "open");
            assert((con.state as string) === "open");
          });

          await test.throws("opening re-opened throws", async () => {
            await con.open();
          });

          await test("re-closing re-opened", async () => {
            const oncestatestart = con.once("state");
            const onceclosestart = con.close();
            assert((await oncestatestart)[0] === "closing");
            assert(con.state === "closing");
            const onceclose = con.once("close");
            const oncestateclosed = con.once("state");
            await onceclose;
            await onceclosestart;
            assert((await oncestateclosed)[0] === "closed");
            assert((con.state as string) === "closed");
          });

          await test.throws("closing re-closed throws", async () => {
            await con.close();
          });
        });

        await test("terminate", async () => {
          const con = new _.Kraken.WS.Connection(_._WS_PUB_HOSTNAME, () => 1000);

          await con.open();

          con.terminate();

          assert(con.state === "closed");
        });

        await test("write; automatic open", async () => {
          const con = new _.Kraken.WS.Connection(_._WS_PUB_HOSTNAME, () => 1000);

          const oncestateopening = con.once("state");
          const onceopen = con.once("open");

          con.write(JSON.stringify({ event: "ping" }));

          assert((await oncestateopening)[0] === "opening");
          const oncestateopen = con.once("state");

          assert((await oncestateopen)[0] === "open");
          await onceopen;

          assert(con.state === "open");

          await con.close();
        });

        await test("request", async () => {
          const con = new _.Kraken.WS.Connection(_._WS_PUB_HOSTNAME, () => 1000);

          const responsewithoutreqid = await con.request({ event: "ping" });
          assert(responsewithoutreqid.event === "pong");

          const responsewithreqid = await con.request({ event: "ping", reqid: 42 });
          assert(responsewithreqid.event === "pong");
          assert(responsewithreqid.reqid === 42);

          await con.close();
        });

        await test("requestMulti", async () => {
          const con = new _.Kraken.WS.Connection(_._WS_PUB_HOSTNAME, () => 1000);

          const responsewithoutreqid = await con.requestMulti({ event: "ping" }, 1);
          assert(responsewithoutreqid[0].event === "pong");

          const responsewithreqid = await con.requestMulti({ event: "ping", reqid: 42 }, 1);
          assert(responsewithreqid[0].event === "pong");
          assert(responsewithreqid[0].reqid === 42);

          await con.close();
        });

        await test("ping", async () => {
          const con = new _.Kraken.WS.Connection(_._WS_PUB_HOSTNAME, () => 1000);

          await con.ping();

          await con.close();
        });
      });

      await test("Subscriber", async (test) => {
        const con = new _.Kraken.WS.Connection(_._WS_PUB_HOSTNAME, () => 1000);
        const opt = { depth: 100 };
        const sub = new _.Kraken.WS.Subscriber(con, "book", () => {}, opt);

        assert(sub.name === "book");
        assert(sub.options === opt);

        let recvstatus: _.Kraken.WS.SubscriptionStatus;

        await test("emits subscribe status", async () => {
          const oncesub = sub.subscribe("XBT/USD");

          recvstatus = (await sub.once("status"))[0];
          assert(recvstatus.status === "subscribed");
          assert(recvstatus.event === "subscriptionStatus");
          assert(recvstatus.channelName === "book-100");

          await oncesub;
        });

        await test("emits payload", async () => {
          const [snapshot, status] = await sub.once("payload");

          assert(status === recvstatus);
          assert(snapshot instanceof Array);
          assert(snapshot.length === 4);
          assert(snapshot[1] instanceof Object);
          assert(
            snapshot[1].as instanceof Array &&
              snapshot[1].bs instanceof Array &&
              snapshot[1].as.length === 100 &&
              snapshot[1].bs.length === 100
          );
          assert(snapshot[2] === "book-100");
          assert(snapshot[3] === "XBT/USD");

          const [askbid, nextstatus] = await sub.once("payload");

          assert(nextstatus === recvstatus);
          assert(askbid instanceof Array);
          assert(askbid.length === 4);
          assert(askbid[1] instanceof Object);
          assert(askbid[1].a instanceof Array || askbid[1].b instanceof Array);

          assert(askbid[2] === "book-100");
          assert(askbid[3] === "XBT/USD");
        });

        await test("emits unsubscribe status", async () => {
          const onceunsub = sub.unsubscribe("XBT/USD");

          const status = (await sub.once("status"))[0];
          assert(status.status === "unsubscribed");
          assert(status.event === "subscriptionStatus");
          assert(status.channelName === "book-100");

          await onceunsub;
        });

        await con.close();
      });
    });
  });

  await test("Detail", async (test) => {
    await test("REST", async (test) => {
      test("_Authenticator", (test) => {
        test(".signedHeaders", () => {
          // using API-secret from documentation example
          const auth = new _._Authenticator(
            "some-key",
            "kQH5HW/8p1uGOVjbgWA7FunAmGO8lsSUXNsu3eow76sz84Q18fWxnyRzBHCd3pd5nE9qa99HAZtuZuj6F1huXg=="
          );

          // using request parameters from example
          const headers = auth.signedHeaders(
            "/0/private/AddOrder",
            "nonce=1616492376594&ordertype=limit&pair=XBTUSD&price=37500&type=buy&volume=1.25",
            1616492376594
          );
          assert(headers["User-Agent"] === _._USER_AGENT);
          assert(headers["API-Key"] === "some-key");
          assert(
            headers["API-Sign"] ===
              "4/dpxb3iT4tp/ZCVEwSnEsLxx0bqyhLpdfOpc6fn7OR8+UClSV5n9E6aSS8MPtnRfp32bAb0nmbRn6H8ndwLUQ=="
          );
        });
        test(".signedQuery", (test) => {
          test("  no otp", () => {
            const auth = new _._Authenticator("some-key", "some-secret");

            const query = auth.signedQuery({ foo: "bar" });
            assert(query.foo === "bar");
            assert(query.otp === undefined);
          });
          test("with otp", () => {
            let otp_counter = 0;
            const auth = new _._Authenticator("some-key", "some-secret", () => "" + ++otp_counter);

            const query0 = auth.signedQuery({ foo: "bar" });
            assert(query0.foo === "bar");
            assert(query0.otp === "1");

            const query1 = auth.signedQuery({ bar: "baz" });
            assert(query1.bar === "baz");
            assert(query1.otp === "2");
          });
        });
      });

      test("_UTF8Receiver", (test) => {
        test("standard", () => {
          let didRecv = false;
          const recvr = new _._UTF8Receiver(
            (json) => {
              assert(json.foo === "bar");
              didRecv = true;
            },
            () => {
              assert(false);
            }
          );
          recvr.nextChunk('{"foo"', 200, "ok");
          assert(!didRecv);
          recvr.nextChunk(':"bar"}', 200, "ok");
          assert(!didRecv);
          recvr.finalize(200, "ok");
          assert(didRecv);
        });
        test("unexpected end", () => {
          let didErr = false;
          const recvr = new _._UTF8Receiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.JSONParseError);
              assert(err.message.match("Unexpected end of JSON"));
              assert(err.source === '{"foo"');
              didErr = true;
            }
          );
          recvr.nextChunk('{"foo"', 200, "ok");
          recvr.finalize(200, "ok");
          assert(didErr);
        });
        test("invalid type", () => {
          let didErr = false;
          const recvr = new _._UTF8Receiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.JSONParseError);
              assert(err.message.match("Unexpected token"));
              assert(err.source === "<>");
              didErr = true;
            }
          );
          recvr.nextChunk("<>", 200, "ok");
          recvr.finalize(200, "ok");
          assert(didErr);
        });
        test("missing status", () => {
          let didErr = false;
          const recvr = new _._UTF8Receiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.HTTPRequestError);
              assert(err.message === "Expected an HTTP status code");
              assert(err.statusCode === undefined);
              assert(err.statusMessage === undefined);
              didErr = true;
            }
          );
          recvr.nextChunk('{"foo":"bar"}', void 0, void 0);
          assert(didErr);
        });
        test("lower status (rcv only)", () => {
          let didErr = false;
          const recvr = new _._UTF8Receiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.HTTPRequestError);
              assert(err.message === "199: bad");
              assert(err.statusCode === 199);
              assert(err.statusMessage === "bad");
              didErr = true;
            }
          );
          recvr.nextChunk('{"foo":"bar"}', 199, "bad");
          assert(didErr);
        });
        test("lower status (fin only)", () => {
          let didErr = false;
          const recvr = new _._UTF8Receiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.HTTPRequestError);
              assert(err.message === "199: bad");
              assert(err.statusCode === 199);
              assert(err.statusMessage === "bad");
              didErr = true;
            }
          );
          recvr.nextChunk('{"foo":"bar"}', 200, "ok");
          assert(!didErr);
          recvr.finalize(199, "bad");
          assert(didErr);
        });
        test("upper status (rcv only)", () => {
          let didErr = false;
          const recvr = new _._UTF8Receiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.HTTPRequestError);
              assert(err.message === "300: bad");
              assert(err.statusCode === 300);
              assert(err.statusMessage === "bad");
              didErr = true;
            }
          );
          recvr.nextChunk('{"foo":"bar"}', 300, "bad");
          assert(didErr);
        });
        test("upper status (fin only)", () => {
          let didErr = false;
          const recvr = new _._UTF8Receiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.HTTPRequestError);
              assert(err.message === "300: bad");
              assert(err.statusCode === 300);
              assert(err.statusMessage === "bad");
              didErr = true;
            }
          );
          recvr.nextChunk('{"foo":"bar"}', 200, "ok");
          assert(!didErr);
          recvr.finalize(300, "bad");
          assert(didErr);
        });
      });

      test("_BinaryReceiver", (test) => {
        test("standard", () => {
          let didRecv = false;
          const recvr = new _._BinaryReceiver(
            (buffer) => {
              assert(buffer instanceof Buffer);
              const arr = new Int8Array(buffer);
              assert(arr.length === 3);
              assert(arr[0] === 49);
              assert(arr[1] === 50);
              assert(arr[2] === 51);
              didRecv = true;
            },
            (_) => {
              assert(false);
            }
          );
          recvr.nextChunk("12", 200, "ok");
          assert(!didRecv);
          recvr.nextChunk("3", 200, "ok");
          assert(!didRecv);
          recvr.finalize(200, "ok");
          assert(didRecv);
        });
        test("invalid type", () => {
          let didErr = false;
          const recvr = new _._BinaryReceiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.BufferParseError);
              assert(
                err.message.match("must be of type string or an instance of Buffer") ||
                  err.message.match("must not be of type number")
              );
              assert(err.source === 1);
              didErr = true;
            }
          );
          recvr.nextChunk(1, 200, "ok");
          assert(didErr);
        });
        test("missing status", () => {
          let didErr = false;
          const recvr = new _._BinaryReceiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.HTTPRequestError);
              assert(err.message === "Expected an HTTP status code");
              assert(err.statusCode === undefined);
              assert(err.statusMessage === undefined);
              didErr = true;
            }
          );
          recvr.nextChunk("123", void 0, void 0);
          assert(didErr);
        });
        test("lower status (rcv only)", () => {
          let didErr = false;
          const recvr = new _._BinaryReceiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.HTTPRequestError);
              assert(err.message === "199: bad");
              assert(err.statusCode === 199);
              assert(err.statusMessage === "bad");
              didErr = true;
            }
          );
          recvr.nextChunk("123", 199, "bad");
          assert(didErr);
        });
        test("lower status (fin only)", () => {
          let didErr = false;
          const recvr = new _._BinaryReceiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.HTTPRequestError);
              assert(err.message === "199: bad");
              assert(err.statusCode === 199);
              assert(err.statusMessage === "bad");
              didErr = true;
            }
          );
          recvr.nextChunk('{"foo":"bar"}', 200, "ok");
          assert(!didErr);
          recvr.finalize(199, "bad");
          assert(didErr);
        });
        test("upper status (rcv only)", () => {
          let didErr = false;
          const recvr = new _._BinaryReceiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.HTTPRequestError);
              assert(err.message === "300: bad");
              assert(err.statusCode === 300);
              assert(err.statusMessage === "bad");
              didErr = true;
            }
          );
          recvr.nextChunk('{"foo":"bar"}', 300, "bad");
          assert(didErr);
        });
        test("upper status (fin only)", () => {
          let didErr = false;
          const recvr = new _._BinaryReceiver(
            () => {
              assert(false);
            },
            (err) => {
              assert(err instanceof _.Kraken.HTTPRequestError);
              assert(err.message === "300: bad");
              assert(err.statusCode === 300);
              assert(err.statusMessage === "bad");
              didErr = true;
            }
          );
          recvr.nextChunk('{"foo":"bar"}', 200, "ok");
          assert(!didErr);
          recvr.finalize(300, "bad");
          assert(didErr);
        });
      });

      test("_prepareRequest", (test) => {
        test("public;    no options", () => {
          const req = _._prepareRequest("foo", null, "public", () => 42, null);
          assert(req.requestOptions.hostname === _._REST_HOSTNAME);
          assert(req.requestOptions.path === `/${_._REST_VERSION}/public/foo`);
          assert(req.requestOptions.method === "GET");
          assert(req.requestOptions.headers instanceof Object);
          assert(req.requestOptions.headers["User-Agent"] === _._USER_AGENT);
          assert(req.postdata === null);
        });
        test("public;  with options", () => {
          const req = _._prepareRequest("foo", { bar: "baz" }, "public", () => 42, null);
          assert(req.requestOptions.hostname === _._REST_HOSTNAME);
          assert(req.requestOptions.path === `/${_._REST_VERSION}/public/foo`);
          assert(req.requestOptions.method === "POST");
          assert(req.requestOptions.headers instanceof Object);
          assert(req.requestOptions.headers["User-Agent"] === _._USER_AGENT);
          assert(req.postdata === "bar=baz&nonce=42");
        });
        test("public;    no options; authenticator", () => {
          const req = _._prepareRequest(
            "foo",
            null,
            "public",
            () => 42,
            new _._Authenticator("foo", "bar")
          );
          assert(req.requestOptions.hostname === _._REST_HOSTNAME);
          assert(req.requestOptions.path === `/${_._REST_VERSION}/public/foo`);
          assert(req.requestOptions.method === "GET");
          assert(req.requestOptions.headers instanceof Object);
          assert(req.requestOptions.headers["User-Agent"] === _._USER_AGENT);
          assert(req.postdata === null);
        });
        test("public;  with options; authenticator", () => {
          const req = _._prepareRequest(
            "foo",
            { bar: "baz" },
            "public",
            () => 42,
            new _._Authenticator("foo", "bar")
          );
          assert(req.requestOptions.hostname === _._REST_HOSTNAME);
          assert(req.requestOptions.path === `/${_._REST_VERSION}/public/foo`);
          assert(req.requestOptions.method === "POST");
          assert(req.requestOptions.headers instanceof Object);
          assert(req.requestOptions.headers["User-Agent"] === _._USER_AGENT);
          assert(req.postdata === "bar=baz&nonce=42");
        });
        test("private;   no options; authenticator;   no otp", () => {
          const auth = new _._Authenticator("qux", "quz");
          const req = _._prepareRequest("foo", null, "private", () => 42, auth);
          assert(req.requestOptions.hostname === _._REST_HOSTNAME);
          assert(req.requestOptions.path === `/${_._REST_VERSION}/private/foo`);
          assert(req.requestOptions.method === "POST");
          assert(req.requestOptions.headers instanceof Object);
          assert(req.postdata === "nonce=42");
          assert(req.requestOptions.headers["User-Agent"] === _._USER_AGENT);
          assert(req.requestOptions.headers["API-Key"] === "qux");
          assert(
            req.requestOptions.headers["API-Sign"] ===
              auth.signedHeaders(req.requestOptions.path, req.postdata, 42)["API-Sign"]
          );
        });
        test("private; with options; authenticator;   no otp", () => {
          const auth = new _._Authenticator("qux", "quz");
          const req = _._prepareRequest("foo", { bar: "baz" }, "private", () => 42, auth);
          assert(req.requestOptions.hostname === _._REST_HOSTNAME);
          assert(req.requestOptions.path === `/${_._REST_VERSION}/private/foo`);
          assert(req.requestOptions.method === "POST");
          assert(req.requestOptions.headers instanceof Object);
          assert(req.postdata === "bar=baz&nonce=42");
          assert(req.requestOptions.headers["User-Agent"] === _._USER_AGENT);
          assert(req.requestOptions.headers["API-Key"] === "qux");
          assert(
            req.requestOptions.headers["API-Sign"] ===
              auth.signedHeaders(req.requestOptions.path, req.postdata, 42)["API-Sign"]
          );
        });
        test("private;   no options; authenticator; with otp", () => {
          const auth = new _._Authenticator("qux", "quz", () => "quux");
          const req = _._prepareRequest("foo", null, "private", () => 42, auth);
          assert(req.requestOptions.hostname === _._REST_HOSTNAME);
          assert(req.requestOptions.path === `/${_._REST_VERSION}/private/foo`);
          assert(req.requestOptions.method === "POST");
          assert(req.requestOptions.headers instanceof Object);
          assert(req.postdata === "nonce=42&otp=quux");
          assert(req.requestOptions.headers["User-Agent"] === _._USER_AGENT);
          assert(req.requestOptions.headers["API-Key"] === "qux");
          assert(
            req.requestOptions.headers["API-Sign"] ===
              auth.signedHeaders(req.requestOptions.path, req.postdata, 42)["API-Sign"]
          );
        });
        test("private; with options; authenticator; with otp", () => {
          const auth = new _._Authenticator("qux", "quz", () => "quux");
          const req = _._prepareRequest("foo", { bar: "baz" }, "private", () => 42, auth);
          assert(req.requestOptions.hostname === _._REST_HOSTNAME);
          assert(req.requestOptions.path === `/${_._REST_VERSION}/private/foo`);
          assert(req.requestOptions.method === "POST");
          assert(req.requestOptions.headers instanceof Object);
          assert(req.postdata === "bar=baz&nonce=42&otp=quux");
          assert(req.requestOptions.headers["User-Agent"] === _._USER_AGENT);
          assert(req.requestOptions.headers["API-Key"] === "qux");
          assert(
            req.requestOptions.headers["API-Sign"] ===
              auth.signedHeaders(req.requestOptions.path, req.postdata, 42)["API-Sign"]
          );
        });
      });

      await test("_sendRequest", async (test) => {
        await test("performs a public  request", async () => {
          const req = _._prepareRequest("Time", null, "public", _._GENNONCE, null);
          const res = await _._sendRequest(req.requestOptions, req.postdata, "utf8", 1000);
          assert(res instanceof Object);
          type T = { error: []; result: _.Kraken.Time };
          assert((<T>res).error.length === 0);
          assert(typeof (<T>res).result.unixtime === "number");
          assert(typeof (<T>res).result.rfc1123 === "string");
        });

        await test("performs a private request", async () => {
          const req = _._prepareRequest(
            "GetWebSocketsToken",
            null,
            "private",
            _._GENNONCE,
            new _._Authenticator(auth.key, auth.secret)
          );
          const res = await _._sendRequest(req.requestOptions, req.postdata, "utf8", 1000);
          assert(res instanceof Object);
          type T = { error: []; result: _.Kraken.GetWebSocketsToken };
          assert((<T>res).error.length === 0);
          assert(typeof (<T>res).result.token === "string");
          assert(typeof (<T>res).result.expires === "number");
        });
      });

      await test("_request", async (test) => {
        await test("performs a public  request", async () => {
          const res = await _._request("Time", null, "public", "utf8", 1000, _._GENNONCE, null);
          assert(res instanceof Object);
          type T = _.Kraken.Time;
          assert(typeof (<T>res).unixtime === "number");
          assert(typeof (<T>res).rfc1123 === "string");
        });
        await test("performs a private request", async () => {
          const res = await _._request(
            "GetWebSocketsToken",
            null,
            "private",
            "utf8",
            1000,
            _._GENNONCE,
            new _._Authenticator(auth.key, auth.secret)
          );
          assert(res instanceof Object);
          type T = _.Kraken.GetWebSocketsToken;
          assert(typeof (<T>res).token === "string");
          assert(typeof (<T>res).expires === "number");
        });
      });
    });

    test("General", (test) => {
      test("_CountTrigger", (test) => {
        test.throws(_.Kraken.ArgumentError, "Invalid count, must be > 0")("count < 0", () => {
          new _._CountTrigger(-1, () => {});
        });

        test.throws(_.Kraken.ArgumentError, "Invalid count, must be > 0")("count = 0", () => {
          new _._CountTrigger(0, () => {});
        });

        test("count = 1", () => {
          let triggered = false;
          const t = new _._CountTrigger(1, () => {
            triggered = true;
          });
          assert(!triggered);
          t.fireWhenReady();
          assert(triggered);
        });

        test("count > 1", () => {
          let triggered = false;
          const t = new _._CountTrigger(2, () => {
            triggered = true;
          });
          assert(!triggered);
          t.fireWhenReady();
          assert(!triggered);
          t.fireWhenReady();
          assert(triggered);
        });
      });

      test("_hidePrivates", () => {
        const o = {
          foo: 1,
          _bar: 2,
          baz: {
            _beh: "qux",
          },
        };

        _._hidePrivates(o);

        assert(Object.getOwnPropertyDescriptor(o, "foo")!.enumerable);
        assert(!Object.getOwnPropertyDescriptor(o, "_bar")!.enumerable);
        assert(Object.getOwnPropertyDescriptor(o, "baz")!.enumerable);
        assert(Object.getOwnPropertyDescriptor(o.baz, "_beh")!.enumerable);
      });
    });
  });
});

// vim: fdm=syntax
