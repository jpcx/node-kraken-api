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
 * @copyright 2018-2021 @author Justin Collier <m@jpcx.dev>                   *
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

import { URLSearchParams } from "url";
import * as http from "http";
import * as https from "https";
import { Emitter } from "ts-ev";
import { crc32 } from "crc";
import crypto from "crypto";
import WebSocket from "ws";

/*                                                                 constants {*/

/** Our user agent for REST request. */
export const _USER_AGENT = "node-kraken-api/2.1.0";
/** REST server hostname. */
export const _REST_HOSTNAME = "api.kraken.com";
/** WS public server hostname. */
export const _WS_PUB_HOSTNAME = "ws.kraken.com";
/** WS private server hostname. */
export const _WS_PRIV_HOSTNAME = "ws-auth.kraken.com";
/** REST server version. */
export const _REST_VERSION = "0";
/**
 * Generates a unique number based on the current millisecond time.
 * Guarantees that each number generated is greater than the last.
 */
export const _GENNONCE = (() => {
  let prev = -1;
  let next = -1;
  return Object.freeze(() => {
    next = Date.now();
    if (next <= prev) next = prev + 1;
    prev = next;
    return next;
  });
})();

/*                                                                 constants }*/

/**
 * Create a new node-kraken-api instance.
 *
 * @example
 *   // Create the API (key and secret optional)
 *   const kraken = new Kraken({ key: "...", secret: "..." });
 *
 *   // REST API
 *
 *   const { unixtime, rfc1123 } = await kraken.time();
 *   const { XXBT }              = await kraken.balance();
 *
 *   // note: all response properties are typed according to the documentation
 *   //       but are listed as optional; they are not verified by this library.
 *
 *   // WebSocket API
 *
 *   // Subscribe to pair publications
 *
 *   const ticker = await kraken.ws.ticker()
 *     .on("update", (update, pair) => console.log(update, pair))
 *     .on("error",  (error, pair)  => console.log(error,  pair))
 *     .on("status", (status)       => console.log(status)
 *     .subscribe("XBT/USD")
 *
 *   // Subscribe to book publications
 *
 *   const book = kraken.ws.book({ depth: 10 })
 *     // live book construction from "snapshot", "ask", and "bid" events.
 *     .on("mirror", (mirror, pair) => console.log(mirror, pair))
 *     .on("error",  (error,  pair) => console.log(error,  pair))
 *     // resubscribes if there is a checksum validation issue (emits statuses).
 *     .on("status", (status)       => console.log(status)
 *     .subscribe("XBT/USD", "ETH/USD"); // subscribe to multiple pairs at once
 *
 *   // Subscribe to user publications (requires token)
 *
 *   const { token } = await kraken.getWebSocketsToken();
 *
 *   const ownTrades = await kraken.ws.ownTrades({ token: token! })
 *     .on("update", (update, sequence) => console.log(update, sequence))
 *     .on("error",  (error)            => console.log(error))
 *     .on("status", (status)           => console.log(status)
 *     .subscribe()
 *
 *   // make a private WS request
 *   await kraken.ws.cancelAll({ token });
 *
 *   // unsubscribe from an existing subscription
 *   await book.unsubscribe("XBT/USD", "ETH/USD"); // specify some or all pairs
 *   await ownTrades.unsubscribe();
 */
export class Kraken {
  private _gennonce: () => number;
  private _auth: _Authenticator | null;
  /** @deprecated */
  private _legacy = _Legacy.Settings.defaults();

  public timeout: number;

  constructor({
    key,
    secret,
    genotp,
    gennonce = _GENNONCE,
    timeout = 1000,
    /** @deprecated */
    pubMethods,
    /** @deprecated */
    privMethods,
    /** @deprecated */
    parse,
    /** @deprecated */
    dataFormatter,
  }: Readonly<
    {
      /** REST API key. */
      key?: string;
      /** REST API secret. */
      secret?: string;
      /** REST API OTP generator. */
      genotp?: () => string;
      /** Nonce generator (the default is ms time with an incrementation guarantee). */
      gennonce?: () => number;
      /** Connection timeout. */
      timeout?: number;
    } & _Legacy.Settings
  > = {}) {
    /*· {*/

    // verify settings

    if (key && !secret) {
      throw new Kraken.SettingsError("Key provided without secret");
    }
    if (!key && secret) {
      throw new Kraken.SettingsError("Secret provided without key");
    }
    if (genotp && !key && !secret) {
      throw new Kraken.SettingsError("OTPGen provided without key or secret");
    }
    if (timeout <= 0) {
      throw new Kraken.SettingsError("Timeout must be > 0");
    }

    this.timeout = timeout;
    this._gennonce = gennonce;
    this._auth = key && secret ? new _Authenticator(key, secret, genotp) : null;

    if (pubMethods) this._legacy.pubMethods = pubMethods;
    if (privMethods) this._legacy.privMethods = privMethods;
    if (parse) this._legacy.parse = parse;
    if (dataFormatter) this._legacy.dataFormatter = dataFormatter;

    _hidePrivates(this);

    /*· }*/
  }

  /*                                                    Manual REST Requests {*/

  /**
   * Perform a manual REST request.
   * See the named methods below for typed options and responses.
   */
  public request(
    endpoint: string,
    options: NodeJS.Dict<any> | null = null,
    type: "public" | "private" = "public",
    encoding: "utf8" | "binary" = "utf8"
  ): Promise<any> {
    return _request(endpoint, options, type, encoding, this.timeout, this._gennonce, this._auth);
  }

  /** @deprecated legacy request function */
  public call(method: any, options?: any, cb?: (err: any, data: any) => any): any {
    /*· {*/

    let type: "public" | "private";
    if (this._legacy.pubMethods.includes(method)) {
      type = "public";
    } else if (this._legacy.privMethods.includes(method)) {
      type = "private";
    } else {
      throw Error(`Bad method: ${method}. See documentation and check settings.`);
    }

    const onceresponse = new Promise(async (resolve, reject) => {
      try {
        const res = _Legacy.parseNested(
          await this.request(method, options || null, type, "utf8"),
          this._legacy.parse
        );
        if (this._legacy.dataFormatter) {
          resolve(this._legacy.dataFormatter(method, options, res));
        } else {
          resolve(res);
        }
      } catch (e) {
        reject(e);
      }
    });

    if (cb) {
      onceresponse.then((data) => cb(null, data)).catch((err) => cb(err, null));
    } else {
      return onceresponse;
    }

    /*· }*/
  }

  /*                                                    Manual REST Requests }*/

  /*                                                                REST API {*/

  /**
   * Get the server's time.
   */
  public time(): Promise<Kraken.Time> {
    return this.request("Time");
  }

  /**
   * Get the current system status or trading mode.
   */
  public systemStatus(): Promise<Kraken.SystemStatus> {
    return this.request("SystemStatus");
  }

  /**
   * Get information about the assets that are available for deposit, withdrawal, trading and staking.
   */
  public assets(options?: {
    /*· {*/

    /**
     * Comma delimited list of assets to get info on.
     * @example "XBT,ETH".
     */
    asset?: string;
    /**
     * Asset class.  (optional, default: `currency`).
     * @example "currency".
     */
    aclass?: string;

    /*· }*/
  }): Promise<Kraken.Assets> {
    return this.request("Assets", options);
  }

  /**
   * Get tradable asset pairs
   */
  public assetPairs(options?: {
    /*· {*/

    /**
     * Asset pairs to get data for.
     * @example "XXBTCZUSD,XETHXXBT".
     */
    pair?: string;
    /**
     * Info to retrieve.  (optional)
     *   * `info` = all info
     *   * `leverage` = leverage info
     *   * `fees` = fees schedule
     *   * `margin` = margin info
     * @default "info".
     */
    info?: string;

    /*· }*/
  }): Promise<Kraken.AssetPairs> {
    return this.request("AssetPairs", options);
  }

  /**
   * Note: Today's prices start at midnight UTC
   */
  public ticker(options: {
    /*· {*/

    /**
     * Asset pair to get data for.
     * @example "XBTUSD".
     */
    pair: string;

    /*· }*/
  }): Promise<Kraken.Ticker> {
    return this.request("Ticker", options);
  }

  /**
   * Note: the last entry in the OHLC array is for the current, not-yet-committed frame and will always be present, regardless of the value of `since`.
   */
  public ohlc(options: {
    /*· {*/

    /**
     * Asset pair to get data for.
     * @example "XBTUSD".
     */
    pair: string;
    /**
     * Time frame interval in minutes.
     * @default 1.
     * @example 60.
     */
    interval?: number;
    /**
     * Return committed OHLC data since given ID.
     * @example 1548111600.
     */
    since?: number;

    /*· }*/
  }): Promise<Kraken.OHLC> {
    return this.request("OHLC", options);
  }

  /**
   * Get Order Book
   */
  public depth(options: {
    /*· {*/

    /**
     * Asset pair to get data for.
     * @example "XBTUSD".
     */
    pair: string;
    /**
     * maximum number of asks/bids.
     * @default 100.
     * @example 2.
     */
    count?: number;

    /*· }*/
  }): Promise<Kraken.Depth> {
    return this.request("Depth", options);
  }

  /**
   * Returns the last 1000 trades by default
   */
  public trades(options: {
    /*· {*/

    /**
     * Asset pair to get data for.
     * @example "XBTUSD".
     */
    pair: string;
    /**
     * Return trade data since given timestamp.
     * @example "1616663618".
     */
    since?: string;

    /*· }*/
  }): Promise<Kraken.Trades> {
    return this.request("Trades", options);
  }

  /**
   * Get Recent Spreads
   */
  public spread(options: {
    /*· {*/

    /**
     * Asset pair to get data for.
     * @example "XBTUSD".
     */
    pair: string;
    /**
     * Return spread data since given ID.
     * @example 1548122302.
     */
    since?: number;

    /*· }*/
  }): Promise<Kraken.Spread> {
    return this.request("Spread", options);
  }

  /**
   * An authentication token must be requested via this REST API endpoint in order to connect to and authenticate with our [Websockets API](https://docs.kraken.com). The token should be used within 15 minutes of creation, but it does not expire once a successful Websockets connection and private subscription has been made and is maintained.
   * > The 'Access WebSockets API' permission must be enabled for the API key in order to generate the authentication token.
   */
  public getWebSocketsToken(): Promise<Kraken.GetWebSocketsToken> {
    return this.request("GetWebSocketsToken", null, "private");
  }

  /**
   * Retrieve all cash balances, net of pending withdrawals.
   */
  public balance(): Promise<Kraken.Balance> {
    return this.request("Balance", null, "private");
  }

  /**
   * Retrieve a summary of collateral balances, margin position valuations, equity and margin level.
   */
  public tradeBalance(options?: {
    /*· {*/

    /**
     * Base asset used to determine balance.
     * @default "ZUSD".
     */
    asset?: string;

    /*· }*/
  }): Promise<Kraken.TradeBalance> {
    return this.request("TradeBalance", options, "private");
  }

  /**
   * Retrieve information about currently open orders.
   */
  public openOrders(options?: {
    /*· {*/

    /**
     * Whether or not to include trades related to position in output.
     */
    trades?: boolean;
    /**
     * Restrict results to given user reference id.
     */
    userref?: number;

    /*· }*/
  }): Promise<Kraken.OpenOrders> {
    return this.request("OpenOrders", options, "private");
  }

  /**
   * Retrieve information about orders that have been closed (filled or cancelled). 50 results are returned at a time, the most recent by default.
   * **Note:** If an order's tx ID is given for `start` or `end` time, the order's opening time (`opentm`) is used
   */
  public closedOrders(options?: {
    /*· {*/

    /**
     * Whether or not to include trades related to position in output.
     */
    trades?: boolean;
    /**
     * Restrict results to given user reference id.
     */
    userref?: number;
    /**
     * Starting unix timestamp or order tx ID of results (exclusive).
     */
    start?: number;
    /**
     * Ending unix timestamp or order tx ID of results (inclusive).
     */
    end?: number;
    /**
     * Result offset for pagination.
     */
    ofs?: number;
    /**
     * Which time to use to search.
     * @default "both".
     */
    closetime?: string;

    /*· }*/
  }): Promise<Kraken.ClosedOrders> {
    return this.request("ClosedOrders", options, "private");
  }

  /**
   * Retrieve information about specific orders.
   */
  public queryOrders(options: {
    /*· {*/

    /**
     * Whether or not to include trades related to position in output.
     */
    trades?: boolean;
    /**
     * Restrict results to given user reference id.
     */
    userref?: number;
    /**
     * Comma delimited list of transaction IDs to query info about (20 maximum).
     */
    txid: string;

    /*· }*/
  }): Promise<Kraken.QueryOrders> {
    return this.request("QueryOrders", options, "private");
  }

  /**
   * Retrieve information about trades/fills. 50 results are returned at a time, the most recent by default.
   * * Unless otherwise stated, costs, fees, prices, and volumes are specified with the precision for the asset pair (`pair_decimals` and `lot_decimals`), not the individual assets' precision (`decimals`).
   */
  public tradesHistory(options?: {
    /*· {*/

    /**
     * Type of trade.
     * @default "all".
     */
    type?: string;
    /**
     * Whether or not to include trades related to position in output.
     */
    trades?: boolean;
    /**
     * Starting unix timestamp or trade tx ID of results (exclusive).
     */
    start?: number;
    /**
     * Ending unix timestamp or trade tx ID of results (inclusive).
     */
    end?: number;
    /**
     * Result offset for pagination.
     */
    ofs?: number;

    /*· }*/
  }): Promise<Kraken.TradesHistory> {
    return this.request("TradesHistory", options, "private");
  }

  /**
   * Retrieve information about specific trades/fills.
   */
  public queryTrades(options?: {
    /*· {*/

    /**
     * Comma delimited list of transaction IDs to query info about (20 maximum).
     */
    txid?: string;
    /**
     * Whether or not to include trades related to position in output.
     */
    trades?: boolean;

    /*· }*/
  }): Promise<Kraken.QueryTrades> {
    return this.request("QueryTrades", options, "private");
  }

  /**
   * Get information about open margin positions.
   */
  public openPositions(options?: {
    /*· {*/

    /**
     * Comma delimited list of txids to limit output to.
     */
    txid?: string;
    /**
     * Whether to include P&L calculations.
     */
    docalcs?: boolean;
    /**
     * Consolidate positions by market/pair.
     */
    consolidation?: string;

    /*· }*/
  }): Promise<Kraken.OpenPositions> {
    return this.request("OpenPositions", options, "private");
  }

  /**
   * Retrieve information about ledger entries. 50 results are returned at a time, the most recent by default.
   */
  public ledgers(options?: {
    /*· {*/

    /**
     * Comma delimited list of assets to restrict output to.
     * @default "all".
     */
    asset?: string;
    /**
     * Asset class.
     * @default "currency".
     */
    aclass?: string;
    /**
     * Type of ledger to retrieve.
     * @default "all".
     */
    type?: string;
    /**
     * Starting unix timestamp or ledger ID of results (exclusive).
     */
    start?: number;
    /**
     * Ending unix timestamp or ledger ID of results (inclusive).
     */
    end?: number;
    /**
     * Result offset for pagination.
     */
    ofs?: number;

    /*· }*/
  }): Promise<Kraken.Ledgers> {
    return this.request("Ledgers", options, "private");
  }

  /**
   * Retrieve information about specific ledger entries.
   */
  public queryLedgers(options?: {
    /*· {*/

    /**
     * Comma delimited list of ledger IDs to query info about (20 maximum).
     */
    id?: string;
    /**
     * Whether or not to include trades related to position in output.
     */
    trades?: boolean;

    /*· }*/
  }): Promise<Kraken.QueryLedgers> {
    return this.request("QueryLedgers", options, "private");
  }

  /**
   * Note: If an asset pair is on a maker/taker fee schedule, the taker side is given in `fees` and maker side in `fees_maker`. For pairs not on maker/taker, they will only be given in `fees`.
   */
  public tradeVolume(options: {
    /*· {*/

    /**
     * Comma delimited list of asset pairs to get fee info on (optional).
     */
    pair: string;
    /**
     * Whether or not to include fee info in results (optional).
     */
    "fee-info"?: boolean;

    /*· }*/
  }): Promise<Kraken.TradeVolume> {
    return this.request("TradeVolume", options, "private");
  }

  /**
   * Request export of trades or ledgers.
   */
  public addExport(options: {
    /*· {*/

    /**
     * Type of data to export.
     */
    report: string;
    /**
     * File format to export.
     * @default "CSV".
     */
    format?: string;
    /**
     * Description for the export.
     */
    description: string;
    /**
     * Comma-delimited list of fields to include
     * * `trades`: ordertxid, time, ordertype, price, cost, fee, vol, margin, misc, ledgers
     * * `ledgers`: refid, time, type, aclass, asset, amount, fee, balance
     * @default "all".
     */
    fields?: string;
    /**
     * UNIX timestamp for report start time (default 1st of the current month).
     */
    starttm?: number;
    /**
     * UNIX timestamp for report end time (default now).
     */
    endtm?: number;

    /*· }*/
  }): Promise<Kraken.AddExport> {
    return this.request("AddExport", options, "private");
  }

  /**
   * Get status of requested data exports.
   */
  public exportStatus(options: {
    /*· {*/

    /**
     * Type of reports to inquire about.
     */
    report: string;

    /*· }*/
  }): Promise<Kraken.ExportStatus> {
    return this.request("ExportStatus", options, "private");
  }

  /**
   * Retrieve a processed data export
   */
  public retrieveExport(options: {
    /*· {*/

    /**
     * Report ID to retrieve.
     */
    id: string;

    /*· }*/
  }): Promise<Kraken.RetrieveExport> {
    return this.request("RetrieveExport", options, "private", "binary");
  }

  /**
   * Delete exported trades/ledgers report
   */
  public removeExport(options: {
    /*· {*/

    /**
     * ID of report to delete or cancel.
     */
    id: string;
    /**
     * `delete` can only be used for reports that have already been processed. Use `cancel` for queued or processing reports.
     */
    type: string;

    /*· }*/
  }): Promise<Kraken.RemoveExport> {
    return this.request("RemoveExport", options, "private");
  }

  /**
   * Place a new order.
   * **Note**: See the [AssetPairs](#operation/getTradableAssetPairs) endpoint for details on the available trading pairs, their price and quantity precisions, order minimums, available leverage, etc.
   */
  public addOrder(options: {
    /*· {*/

    /**
     * User reference id
     * `userref` is an optional user-specified integer id that can be associated with any number of orders. Many clients choose a `userref` corresponding to a unique integer id generated by their systems (e.g. a timestamp). However, because we don't enforce uniqueness on our side, it can also be used to easily group orders by pair, side, strategy, etc. This allows clients to more readily cancel or query information about orders in a particular group, with fewer API calls by using `userref` instead of our `txid`, where supported.
     */
    userref?: number;
    /**
     * Order type
     */
    ordertype: string;
    /**
     * Order direction (buy/sell).
     */
    type: string;
    /**
     * Order quantity in terms of the base asset
     * > Note: Volume can be specified as `0` for closing margin orders to automatically fill the requisite quantity.
     */
    volume?: string;
    /**
     * Asset pair `id` or `altname`.
     */
    pair: string;
    /**
     * Price
     * * Limit price for `limit` orders
     * * Trigger price for `stop-loss`, `stop-loss-limit`, `take-profit` and `take-profit-limit` orders
     */
    price?: string;
    /**
     * Secondary Price
     * * Limit price for `stop-loss-limit` and `take-profit-limit` orders
     * >  Note: Either `price` or `price2` can be preceded by `+`, `-`, or `#` to specify the order price as an offset relative to the last traded price. `+` adds the amount to, and `-` subtracts the amount from the last traded price. `#` will either add or subtract the amount to the last traded price, depending on the direction and order type used. Relative prices can be suffixed with a `%` to signify the relative amount as a percentage.
     */
    price2?: string;
    /**
     * Amount of leverage desired (default = none)
     */
    leverage?: string;
    /**
     * Comma delimited list of order flags
     *   * `post` post-only order (available when ordertype = limit)
     *   * `fcib` prefer fee in base currency (default if selling)
     *   * `fciq` prefer fee in quote currency (default if buying, mutually exclusive with `fcib`)
     *   * `nompp` disable [market price protection](https://support.kraken.com/hc/en-us/articles/201648183-Market-Price-Protection) for market orders
     */
    oflags?: string;
    /**
     * Time-in-force of the order to specify how long it should remain in the order book before being cancelled. GTC (Good-'til-cancelled) is default if the parameter is omitted. IOC (immediate-or-cancel) will immediately execute the amount possible and cancel any remaining balance rather than resting in the book. GTD (good-'til-date), if specified, must coincide with a desired `expiretm`.
     * @default "GTC".
     */
    timeinforce?: string;
    /**
     * Scheduled start time. Can be specified as an absolute timestamp or as a number of seconds in the future.
     *   * `0` now (default)
     *   * `+<n>` schedule start time <n> seconds from now
     *   * `<n>` = unix timestamp of start time
     */
    starttm?: string;
    /**
     * Expiration time
     *   * `0` no expiration (default)
     *   * `+<n>` = expire <n> seconds from now, minimum 5 seconds
     *   * `<n>` = unix timestamp of expiration time
     */
    expiretm?: string;
    /**
     * Conditional close order type.
     * > Note: [Conditional close orders](https://support.kraken.com/hc/en-us/articles/360038640052-Conditional-Close) are triggered by execution of the primary order in the same quantity and opposite direction, but once triggered are __independent orders__ that may reduce or increase net position.
     */
    "close[ordertype]"?: string;
    /**
     * Conditional close order `price`
     */
    "close[price]"?: string;
    /**
     * Conditional close order `price2`
     */
    "close[price2]"?: string;
    /**
     * Validate inputs only. Do not submit order.
     */
    validate?: boolean;

    /*· }*/
  }): Promise<Kraken.AddOrder> {
    return this.request("AddOrder", options, "private");
  }

  /**
   * Cancel a particular open order (or set of open orders) by `txid` or `userref`
   */
  public cancelOrder(options: {
    /*· {*/

    /**
     * Open order transaction ID (txid) or user reference (userref).
     */
    txid: string | number;

    /*· }*/
  }): Promise<Kraken.CancelOrder> {
    return this.request("CancelOrder", options, "private");
  }

  /**
   * Cancel all open orders
   */
  public cancelAll(): Promise<Kraken.CancelAll> {
    return this.request("CancelAll", null, "private");
  }

  /**
   * CancelAllOrdersAfter provides a "Dead Man's Switch" mechanism to protect the client from network malfunction, extreme latency or unexpected matching engine downtime. The client can send a request with a timeout (in seconds), that will start a countdown timer which will cancel *all* client orders when the timer expires. The client has to keep sending new requests to push back the trigger time, or deactivate the mechanism by specifying a timeout of 0. If the timer expires, all orders are cancelled and then the timer remains disabled until the client provides a new (non-zero) timeout.
   * The recommended use is to make a call every 15 to 30 seconds, providing a timeout of 60 seconds. This allows the client to keep the orders in place in case of a brief disconnection or transient delay, while keeping them safe in case of a network breakdown. It is also recommended to disable the timer ahead of regularly scheduled trading engine maintenance (if the timer is enabled, all orders will be cancelled when the trading engine comes back from downtime - planned or otherwise).
   */
  public cancelAllOrdersAfter(options: {
    /*· {*/

    /**
     * Duration (in seconds) to set/extend the timer by.
     */
    timeout: number;

    /*· }*/
  }): Promise<Kraken.CancelAllOrdersAfter> {
    return this.request("CancelAllOrdersAfter", options, "private");
  }

  /**
   * Retrieve methods available for depositing a particular asset.
   */
  public depositMethods(options: {
    /*· {*/

    /**
     * Asset being deposited.
     */
    asset: string;

    /*· }*/
  }): Promise<Kraken.DepositMethods> {
    return this.request("DepositMethods", options, "private");
  }

  /**
   * Retrieve (or generate a new) deposit addresses for a particular asset and method.
   */
  public depositAddresses(options: {
    /*· {*/

    /**
     * Asset being deposited.
     */
    asset: string;
    /**
     * Name of the deposit method.
     */
    method: string;
    /**
     * Whether or not to generate a new address.
     */
    new?: boolean;

    /*· }*/
  }): Promise<Kraken.DepositAddresses> {
    return this.request("DepositAddresses", options, "private");
  }

  /**
   * Retrieve information about recent deposits made.
   */
  public depositStatus(options: {
    /*· {*/

    /**
     * Asset being deposited.
     */
    asset: string;
    /**
     * Name of the deposit method.
     */
    method?: string;

    /*· }*/
  }): Promise<Kraken.DepositStatus> {
    return this.request("DepositStatus", options, "private");
  }

  /**
   * Retrieve fee information about potential withdrawals for a particular asset, key and amount.
   */
  public withdrawInfo(options: {
    /*· {*/

    /**
     * Asset being withdrawn.
     */
    asset: string;
    /**
     * Withdrawal key name, as set up on your account.
     */
    key: string;
    /**
     * Amount to be withdrawn.
     */
    amount: string;

    /*· }*/
  }): Promise<Kraken.WithdrawInfo> {
    return this.request("WithdrawInfo", options, "private");
  }

  /**
   * Make a withdrawal request.
   */
  public withdraw(options: {
    /*· {*/

    /**
     * Asset being withdrawn.
     */
    asset: string;
    /**
     * Withdrawal key name, as set up on your account.
     */
    key: string;
    /**
     * Amount to be withdrawn.
     */
    amount: string;

    /*· }*/
  }): Promise<Kraken.Withdraw> {
    return this.request("Withdraw", options, "private");
  }

  /**
   * Retrieve information about recently requests withdrawals.
   */
  public withdrawStatus(options: {
    /*· {*/

    /**
     * Asset being withdrawn.
     */
    asset: string;
    /**
     * Name of the withdrawal method.
     */
    method?: string;

    /*· }*/
  }): Promise<Kraken.WithdrawStatus> {
    return this.request("WithdrawStatus", options, "private");
  }

  /**
   * Cancel a recently requested withdrawal, if it has not already been successfully processed.
   */
  public withdrawCancel(options: {
    /*· {*/

    /**
     * Asset being withdrawn.
     */
    asset: string;
    /**
     * Withdrawal reference ID.
     */
    refid: string;

    /*· }*/
  }): Promise<Kraken.WithdrawCancel> {
    return this.request("WithdrawCancel", options, "private");
  }

  /**
   * Transfer from Kraken spot wallet to Kraken Futures holding wallet. Note that a transfer in the other direction must be requested via the Kraken Futures [API endpoint](https://support.kraken.com/hc/en-us/articles/360028105972-Withdrawal-to-Spot-Wallet).
   */
  public walletTransfer(options: {
    /*· {*/

    /**
     * Asset to transfer (asset ID or `altname`).
     * @example "XBT".
     */
    asset: string;
    /**
     * Source wallet.
     */
    from: string;
    /**
     * Destination wallet.
     */
    to: string;
    /**
     * Amount to transfer.
     */
    amount: string;

    /*· }*/
  }): Promise<Kraken.WalletTransfer> {
    return this.request("WalletTransfer", options, "private");
  }

  /**
   * Stake an asset from your spot wallet. This operation requires an API key with `Withdraw funds` permission.
   */
  public stake(options: {
    /*· {*/

    /**
     * Asset to stake (asset ID or `altname`).
     * @example "XBT".
     */
    asset: string;
    /**
     * Amount of the asset to stake.
     */
    amount: string;
    /**
     * Name of the staking option to use (refer to the Staking Assets endpoint for the correct method names for each asset).
     */
    method: string;

    /*· }*/
  }): Promise<Kraken.Stake> {
    return this.request("Stake", options, "private");
  }

  /**
   * Unstake an asset from your staking wallet. This operation requires an API key with `Withdraw funds` permission.
   */
  public unstake(options: {
    /*· {*/

    /**
     * Asset to unstake (asset ID or `altname`). Must be a valid staking asset (e.g. `XBT.M`, `XTZ.S`, `ADA.S`).
     * @example "XBT.M".
     */
    asset: string;
    /**
     * Amount of the asset to stake.
     */
    amount: string;

    /*· }*/
  }): Promise<Kraken.Unstake> {
    return this.request("Unstake", options, "private");
  }

  /**
   * Returns the list of assets that the user is able to stake. This operation
   * requires an API key with both `Withdraw funds` and `Query funds` permission.
   */
  public stakingAssets(): Promise<Kraken.StakingAssets> {
    return this.request("Staking/Assets", null, "private");
  }

  /**
   * Returns the list of pending staking transactions. Once resolved, these transactions
   * will appear on the `List of Staking Transactions` endpoint.
   * This operation requires an API key with both `Query funds` and `Withdraw funds` permissions.
   */
  public stakingPending(): Promise<Kraken.StakingPending> {
    return this.request("Staking/Pending", null, "private");
  }

  /**
   * Returns the list of all staking transactions. This endpoint can only return
   * up to 1000 of the most recent transactions.
   * This operation requires an API key with `Query funds` permissions.
   */
  public stakingTransactions(): Promise<Kraken.StakingTransactions> {
    return this.request("Staking/Transactions", null, "private");
  }

  /*                                                                REST API }*/

  /** Interface for all WebSockets functionality */
  public readonly ws = new (class WS {
    /*                                                        WebSockets API {*/

    /** Direct interface to the public WebSocket connection */
    public readonly pub: Kraken.WS.Connection;
    /** Direct interface to the private WebSocket connection */
    public readonly priv: Kraken.WS.Connection;

    constructor(kraken: Kraken) {
      /*· {*/

      this.pub = new Kraken.WS.Connection(_WS_PUB_HOSTNAME, () => kraken.timeout);
      this.priv = new Kraken.WS.Connection(_WS_PRIV_HOSTNAME, () => kraken.timeout);

      /*· }*/
    }

    /** Publication: Ticker information on currency pair.  */
    public ticker(): Kraken.WS.Subscriber<{
      update: (ticker: Kraken.WS.Ticker, pair: string) => any;
    }> {
      /*· {*/

      return new Kraken.WS.Subscriber(
        this.pub,
        "ticker",
        (self, payload, status) => {
          for (let i = 1; i < payload.length - 2; ++i)
            self.emit("update", payload[i], status.pair!);
        },
        {}
      );

      /*· }*/
    }

    /**
     * Publication: Open High Low Close (Candle) feed for a currency pair and interval period.
     *
     * Description: When subscribed for OHLC, a snapshot of the last valid candle (irrespective of the endtime) will be sent, followed by updates to the running candle. For example, if a subscription is made to 1 min candle and there have been no trades for 5 mins, a snapshot of the last 1 min candle from 5 mins ago will be published. The endtime can be used to determine that it is an old candle.
     */
    public ohlc(options?: {
      /** Optional - Time interval associated with ohlc subscription in minutes. Default 1. Valid Interval values: 1|5|15|30|60|240|1440|10080|21600 */
      interval?: number;
    }): Kraken.WS.Subscriber<
      { update: (ohlc: Kraken.WS.OHLC, pair: string) => any },
      { interval?: number }
    > {
      /*· {*/

      return new Kraken.WS.Subscriber(
        this.pub,
        "ohlc",
        (self, payload, status) => {
          for (let i = 1; i < payload.length - 2; ++i)
            self.emit("update", payload[i], status.pair!);
        },
        options || {}
      );

      /*· }*/
    }

    /** Publication: Trade feed for a currency pair.  */
    public trade(): Kraken.WS.Subscriber<{
      update: (trade: Kraken.WS.Trade, pair: string) => any;
    }> {
      /*· {*/

      return new Kraken.WS.Subscriber(
        this.pub,
        "trade",
        (self, payload, status) => {
          for (let i = 1; i < payload.length - 2; ++i)
            self.emit("update", payload[i], status.pair!);
        },
        {}
      );

      /*· }*/
    }

    /** Publication: Spread feed for a currency pair.  */
    public spread(): Kraken.WS.Subscriber<{
      update: (spread: Kraken.WS.Spread, pair: string) => any;
    }> {
      /*· {*/

      return new Kraken.WS.Subscriber(
        this.pub,
        "spread",
        (self, payload, status) => {
          for (let i = 1; i < payload.length - 2; ++i)
            self.emit("update", payload[i], status.pair!);
        },
        {}
      );

      /*· }*/
    }

    /** Publication: Order book levels. On subscription, a snapshot will be published at the specified depth, following the snapshot, level updates will be published */
    public book(options?: {
      /** Optional - depth associated with book subscription in number of levels each side, default 10. Valid Options are: 10, 25, 100, 500, 1000 */
      depth?: number;
    }): Kraken.WS.Subscriber<
      {
        snapshot: (snapshot: Kraken.WS.Book.Snapshot, pair: string) => any;
        ask: (ask: Kraken.WS.Book.Ask, pair: string) => any;
        bid: (bid: Kraken.WS.Book.Bid, pair: string) => any;
        mirror: (mirror: Kraken.WS.Book.Mirror, pair: string) => any;
      },
      { depth?: number }
    > {
      /*· {*/

      const mirrors: { [pair: string]: Kraken.WS.Book.Mirror } = {};
      const locks: { [pair: string]: true } = {};

      async function spawnResubscribe(
        sub: Kraken.WS.Book.Subscriber,
        status: Kraken.WS.SubscriptionStatus
      ) {
        if (locks[status.pair!]) return;
        locks[status.pair!] = true;

        try {
          delete mirrors[status.pair!];
          await sub.unsubscribe(status.pair!);
          await sub.subscribe(status.pair!);
        } catch (e) {
          if (e instanceof Error) sub.emit("error", e, status);
          else sub.emit("error", new Kraken.UnknownError("received an unknown error", e), status);
        }

        delete locks[status.pair!];
      }

      return new Kraken.WS.Subscriber(
        this.pub,
        "book",
        async (self, payload, status) => {
          for (let i = 1; i < payload.length - 2; ++i) {
            try {
              if (payload[i].as && payload[i].bs) {
                self.emit("snapshot", payload[i], status.pair!);
                mirrors[status.pair!] = payload[i];
              } else {
                if (payload[i].a) self.emit("ask", payload[i], status.pair!);
                if (payload[i].b) self.emit("bid", payload[i], status.pair!);

                if (mirrors[status.pair!]) {
                  const { modified, verified } = Kraken.WS.Book.applyUpdate(
                    mirrors[status.pair!],
                    payload[i]
                  );
                  if (modified && verified) {
                    self.emit("mirror", mirrors[status.pair!], status.pair!);
                  } else if (!verified) {
                    spawnResubscribe(self, status);
                  }
                }
              }
            } catch (e) {
              if (e instanceof Error) self.emit("error", e, status);
              else
                self.emit("error", new Kraken.UnknownError("received an unknown error", e), status);
            }
          }
        },
        options || {}
      );

      /*· }*/
    }

    /** Publication: Own trades. On subscription last 50 trades for the user will be sent, followed by new trades.  */
    public ownTrades(options: {
      /** base64-encoded authentication token for private-data endpoints */
      token: string;
      /** Optional - whether to send historical feed data snapshot upon subscription (supported only for ownTrades subscriptions; default = true) */
      snapshot?: boolean;
    }): Kraken.WS.Subscriber<
      { update: (ownTrades: Kraken.WS.OwnTrades, sequence?: number) => any },
      { token: string; snapshot?: boolean }
    > {
      /*· {*/

      return new Kraken.WS.Subscriber(
        this.priv,
        "ownTrades",
        (self, payload) => {
          for (let i = 0; i < payload.length - 2; ++i)
            self.emit("update", payload[i], payload[payload.length - 1].sequence);
        },
        options
      );

      /*· }*/
    }

    /** Publication: Open orders. Feed to show all the open orders belonging to the authenticated user. Initial snapshot will provide list of all open orders and then any updates to the open orders list will be sent. For status change updates, such as 'closed', the fields orderid and status will be present in the payload.  */
    public openOrders(options: {
      /** base64-encoded authentication token for private-data endpoints */
      token: string;
      /** Optional - whether to send rate-limit counter in updates (supported only for openOrders subscriptions; default = false) */
      ratecounter?: boolean;
    }): Kraken.WS.Subscriber<
      { update: (openOrders: Kraken.WS.OpenOrders, sequence?: number) => any },
      { token: string; ratecounter?: boolean }
    > {
      /*· {*/

      return new Kraken.WS.Subscriber(
        this.priv,
        "openOrders",
        (self, payload) => {
          for (let i = 0; i < payload.length - 2; ++i)
            self.emit("update", payload[i], payload[payload.length - 1].sequence);
        },
        options
      );

      /*· }*/
    }

    /** Request. Add new order.  */
    public addOrder(options: {
      /*· {*/

      /** Session token string */
      token: string;
      /** Optional - client originated requestID sent as acknowledgment in the message response */
      reqid?: number;
      /** Order type - market|limit|stop-loss|take-profit|stop-loss-limit|take-profit-limit|settle-position */
      ordertype: string;
      /** Side, buy or sell */
      type: string;
      /** Currency pair */
      pair: string;
      /** Optional dependent on order type - order price */
      price?: string;
      /** Optional dependent on order type - order secondary price */
      price2?: string;
      /** Order volume in lots */
      volume: string;
      /** amount of leverage desired (optional; default = none) */
      leverage?: string;
      /** Optional - comma delimited list of order flags. viqc = volume in quote currency (not currently available), fcib = prefer fee in base currency, fciq = prefer fee in quote currency, nompp = no market price protection, post = post only order (available when ordertype = limit) */
      oflags?: string;
      /** Optional - scheduled start time. 0 = now (default) +<n> = schedule start time <n> seconds from now <n> = unix timestamp of start time */
      starttm?: string;
      /** Optional - expiration time. 0 = no expiration (default) +<n> = expire <n> seconds from now <n> = unix timestamp of expiration time */
      expiretm?: string;
      /** Optional - RFC3339 timestamp (e.g. 2021-04-01T00:18:45Z) after which matching engine should reject new order request, in presence of latency or order queueing. min now() + 5 seconds, max now() + 90 seconds. Defaults to 90 seconds if not specified. */
      deadline?: string;
      /** Optional - user reference ID (should be an integer in quotes) */
      userref?: string;
      /** Optional - validate inputs only; do not submit order */
      validate?: string;
      /** Optional - close order type. */
      "close[ordertype]"?: string;
      /** Optional - close order price. */
      "close[price]"?: string;
      /** Optional - close order secondary price. */
      "close[price2]"?: string;
      /** Optional - time in force. Supported values include GTC (good-til-cancelled; default), IOC (immediate-or-cancel), GTD (good-til-date; expiretm must be specified). */
      trading_agreement?: string;

      /*· }*/
    }): Promise<Kraken.WS.AddOrder> {
      return this.priv.request({ ...options, event: "addOrder" });
    }

    /**
     * Request. Cancel order or list of orders.
     *
     * For every cancelOrder message, an update message 'closeOrderStatus' is sent. For multiple orderid in cancelOrder, multiple update messages for 'closeOrderStatus' will be sent.
     *
     * For example, if a cancelOrder request is sent for cancelling three orders [A, B, C], then if two update messages for 'closeOrderStatus' are received along with an error such as 'EOrder: Unknown order', then it would imply that the third order is not cancelled. The error message could be different based on the condition which was not met by the 'cancelOrder' request.
     */
    public cancelOrder(options: {
      /*· {*/

      /** Session token string */
      token: string;
      /** Optional - client originated requestID sent as acknowledgment in the message response */
      reqid?: number;
      /** Array of order IDs to be canceled. These can be user reference IDs. */
      txid: string[];

      /*· }*/
    }): Promise<Kraken.WS.CancelOrder> {
      return this.priv.requestMulti({ ...options, event: "cancelOrder" }, options.txid.length);
    }

    /** Request. Cancel all open orders. Includes partially-filled orders.  */
    public cancelAll(options: {
      /*· {*/

      /** Session token string */
      token: string;
      /** Optional - client originated requestID sent as acknowledgment in the message response */
      reqid?: number;

      /*· }*/
    }): Promise<Kraken.WS.CancelAll> {
      return this.priv.request({ ...options, event: "cancelAll" });
    }

    /**
     * Request.
     *
     * cancelAllOrdersAfter provides a "Dead Man's Switch" mechanism to protect the client from network malfunction, extreme latency or unexpected matching engine downtime. The client can send a request with a timeout (in seconds), that will start a countdown timer which will cancel *all* client orders when the timer expires. The client has to keep sending new requests to push back the trigger time, or deactivate the mechanism by specifying a timeout of 0. If the timer expires, all orders are cancelled and then the timer remains disabled until the client provides a new (non-zero) timeout.
     *
     * The recommended use is to make a call every 15 to 30 seconds, providing a timeout of 60 seconds. This allows the client to keep the orders in place in case of a brief disconnection or transient delay, while keeping them safe in case of a network breakdown. It is also recommended to disable the timer ahead of regularly scheduled trading engine maintenance (if the timer is enabled, all orders will be cancelled when the trading engine comes back from downtime - planned or otherwise).
     */
    public cancelAllOrdersAfter(options: {
      /*· {*/

      /** Session token string */
      token: string;
      /** Optional - client originated requestID sent as acknowledgment in the message response */
      reqid?: number;
      /** Timeout specified in seconds. 0 to disable the timer. */
      timeout: number;

      /*· }*/
    }): Promise<Kraken.WS.CancelAllOrdersAfter> {
      return this.priv.request({ ...options, event: "cancelAllOrdersAfter" });
    }

    /*                                                        WebSockets API }*/
  })(this);
}

export module Kraken {
  /*                                                           Kraken Errors {*/

  /** Thrown when this API fails due to some kind of design error. */
  export class InternalError extends Error {
    constructor(message: string) {
      super(message);
    }
  }

  /** Thrown when something unexpected happens. */
  export class UnknownError extends Error {
    public info?: unknown;

    constructor(message: string, info?: unknown) {
      super(message);
      this.info = info;
    }
  }

  /** Thrown for any argument errors. */
  export class ArgumentError extends Error {
    constructor(message: string) {
      super(message);
    }
  }

  /** Thrown when API settings are incorrect for a given operation. */
  export class SettingsError extends ArgumentError {
    constructor(description: string) {
      super(description);
    }
  }

  /** Thrown if a JSON parse error occurs. */
  export class JSONParseError extends Error {
    public source: string;

    constructor(source: string, parseError: Error) {
      super(parseError.message);
      this.source = source;
    }
  }

  /** Thrown if a Buffer parse error occurs. */
  export class BufferParseError extends Error {
    public source: any;

    constructor(source: any, parseError: Error) {
      super(parseError.message);
      this.source = source;
    }
  }

  /** Thrown if an HTTP error occurs. */
  export class HTTPRequestError extends Error {
    public statusCode: number | undefined;
    public statusMessage: string | undefined;

    constructor(statusCode: number | undefined, statusMessage: string | undefined) {
      if (statusCode === undefined) {
        super("Expected an HTTP status code");
      } else {
        super(statusCode + ": " + statusMessage);
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
      }
    }
  }

  /** Thrown if an API response yields a sizey error property. */
  export class RESTAPIError extends Error {
    public body: { result?: any; error: string[] };

    constructor(body: RESTAPIError["body"]) {
      super(JSON.stringify(body.error));
      this.body = body;
    }
  }

  /** Thrown if a network operation times out. */
  export class TimeoutError extends Error {
    constructor(message: string) {
      super(message);
    }
  }

  /** Thrown if a WebSocket subscriptionStatus has an errorMessage. */
  export class WSAPIError extends Error {
    public eventMessage: NodeJS.Dict<any> & { errorMessage: string };

    constructor(eventMessage: NodeJS.Dict<any> & { errorMessage: string }) {
      super(eventMessage.errorMessage);
      this.eventMessage = eventMessage;
    }
  }

  /*                                                           Kraken Errors }*/

  /*                                                        Kraken Utilities {*/

  /** Extract the first parameter type of a function, else void. */
  export type FirstParam<T extends (...args: any[]) => any> = Parameters<T> extends []
    ? void
    : Parameters<T>[0];

  /*                                                        Kraken Utilities }*/

  /*                                                              REST Types {*/

  /**
   * Success response
   * @example {"unixtime":1616336594,"rfc1123":"Sun, 21 Mar 21 14:23:14 +0000"}
   */
  export type Time = {
    /*· {*/

    /**
     * Unix timestamp.
     */
    unixtime?: number | null;
    /**
     * RFC 1123 time format.
     */
    rfc1123?: string | null;

    /*· }*/
  };
  export module Time {
    export type Options = Exclude<FirstParam<Kraken["time"]>, undefined>;
  }

  /**
   * @example {"status":"online","timestamp":"2021-03-21T15:33:02Z"}
   */
  export type SystemStatus = {
    /*· {*/

    /**
     * Current system status
     * * `online`  Kraken is operating normally. All order types may be submitted and trades can occur.
     * * `maintenance`  The exchange is offline. No new orders or cancellations may be submitted.
     * * `cancel_only`  Resting (open) orders can be cancelled but no new orders may be submitted. No trades will occur.
     * * `post_only`  Only post-only limit orders can be submitted. Existing orders may still be cancelled. No trades will occur.
     */
    status?: string | null;
    /**
     * Current timestamp (RFC3339).
     */
    timestamp?: string | null;

    /*· }*/
  };
  export module SystemStatus {
    export type Options = Exclude<FirstParam<Kraken["systemStatus"]>, undefined>;
  }

  /**
   * @example {"XXBT":{"aclass":"currency","altname":"XBT","decimals":10,"display_decimals":5},"ZEUR":{"aclass":"currency","altname":"EUR","decimals":4,"display_decimals":2},"ZUSD":{"aclass":"currency","altname":"USD","decimals":4,"display_decimals":2}}
   */
  export type Assets = {
    /*· {*/

    /**
     * Asset Info.
     */
    [asset: string]: {
      /**
       * Asset Class.
       */
      aclass?: string | null;
      /**
       * Alternate name.
       */
      altname?: string | null;
      /**
       * Scaling decimal places for record keeping.
       */
      decimals?: number | null;
      /**
       * Scaling decimal places for output display.
       */
      display_decimals?: number | null;
    };

    /*· }*/
  };
  export module Assets {
    export type Options = Exclude<FirstParam<Kraken["assets"]>, undefined>;
  }

  /**
   * @example {"XETHXXBT":{"altname":"ETHXBT","wsname":"ETH/XBT","aclass_base":"currency","base":"XETH","aclass_quote":"currency","quote":"XXBT","lot":"unit","pair_decimals":5,"lot_decimals":8,"lot_multiplier":1,"leverage_buy":[2,3,4,5],"leverage_sell":[2,3,4,5],"fees":[[0,0.26],[50000,0.24],[100000,0.22],[250000,0.2],[500000,0.18],[1000000,0.16],[2500000,0.14],[5000000,0.12],[10000000,0.1]],"fees_maker":[[0,0.16],[50000,0.14],[100000,0.12],[250000,0.1],[500000,0.08],[1000000,0.06],[2500000,0.04],[5000000,0.02],[10000000,0]],"fee_volume_currency":"ZUSD","margin_call":80,"margin_stop":40,"ordermin":"0.005"},"XXBTZUSD":{"altname":"XBTUSD","wsname":"XBT/USD","aclass_base":"currency","base":"XXBT","aclass_quote":"currency","quote":"ZUSD","lot":"unit","pair_decimals":1,"lot_decimals":8,"lot_multiplier":1,"leverage_buy":[2,3,4,5],"leverage_sell":[2,3,4,5],"fees":[[0,0.26],[50000,0.24],[100000,0.22],[250000,0.2],[500000,0.18],[1000000,0.16],[2500000,0.14],[5000000,0.12],[10000000,0.1]],"fees_maker":[[0,0.16],[50000,0.14],[100000,0.12],[250000,0.1],[500000,0.08],[1000000,0.06],[2500000,0.04],[5000000,0.02],[10000000,0]],"fee_volume_currency":"ZUSD","margin_call":80,"margin_stop":40,"ordermin":"0.0002"}}
   */
  export type AssetPairs = {
    /*· {*/

    /**
     * Pair names and their info.
     */
    [pair: string]: {
      /**
       * Alternate pair name.
       */
      altname?: string | null;
      /**
       * WebSocket pair name (if available).
       */
      wsname?: string | null;
      /**
       * Asset class of base component.
       */
      aclass_base?: string | null;
      /**
       * Asset ID of base component.
       */
      base?: string | null;
      /**
       * Asset class of quote component.
       */
      aclass_quote?: string | null;
      /**
       * Asset ID of quote component.
       */
      quote?: string | null;
      /**
       * Volume lot size.
       * @deprecated.
       */
      lot?: string | null;
      /**
       * Scaling decimal places for pair.
       */
      pair_decimals?: number | null;
      /**
       * Scaling decimal places for volume.
       */
      lot_decimals?: number | null;
      /**
       * Amount to multiply lot volume by to get currency volume.
       */
      lot_multiplier?: number | null;
      /**
       * Array of leverage amounts available when buying.
       */
      leverage_buy?: Array<number> | null;
      /**
       * Array of leverage amounts available when selling.
       */
      leverage_sell?: Array<number> | null;
      /**
       * Fee schedule array in `[<volume>, <percent fee>]` tuples.
       * @example [undefined].
       */
      fees?: Array<Array<number>> | null;
      /**
       * Maker fee schedule array in `[<volume>, <percent fee>]`  tuples (if on maker/taker).
       * @example [undefined].
       */
      fees_maker?: Array<Array<number>> | null;
      /**
       * Volume discount currency.
       */
      fee_volume_currency?: string | null;
      /**
       * Margin call level.
       */
      margin_call?: number | null;
      /**
       * Stop-out/liquidation margin level.
       */
      margin_stop?: number | null;
      /**
       * Minimum order size (in terms of base currency).
       */
      ordermin?: string | null;
    };

    /*· }*/
  };
  export module AssetPairs {
    export type Options = Exclude<FirstParam<Kraken["assetPairs"]>, undefined>;
  }

  /**
   * @example {"XXBTZUSD":{"a":["52609.60000","1","1.000"],"b":["52609.50000","1","1.000"],"c":["52641.10000","0.00080000"],"v":["1920.83610601","7954.00219674"],"p":["52389.94668","54022.90683"],"t":[23329,80463],"l":["51513.90000","51513.90000"],"h":["53219.90000","57200.00000"],"o":"52280.40000"}}
   */
  export type Ticker = {
    /*· {*/

    /**
     * Asset Ticker Info.
     */
    [pair: string]: {
      /**
       * Ask `[<price>, <whole lot volume>, <lot volume>]`.
       */
      a?: Array<string> | null;
      /**
       * Bid `[<price>, <whole lot volume>, <lot volume>]`.
       */
      b?: Array<string> | null;
      /**
       * Last trade closed `[<price>, <lot volume>]`.
       */
      c?: Array<string> | null;
      /**
       * Volume `[<today>, <last 24 hours>]`.
       */
      v?: Array<string> | null;
      /**
       * Volume weighted average price `[<today>, <last 24 hours>]`.
       */
      p?: Array<string> | null;
      /**
       * Number of trades `[<today>, <last 24 hours>]`.
       */
      t?: Array<number> | null;
      /**
       * Low `[<today>, <last 24 hours>]`.
       */
      l?: Array<string> | null;
      /**
       * High `[<today>, <last 24 hours>]`.
       */
      h?: Array<string> | null;
      /**
       * Today's opening price.
       */
      o?: string | null;
    };

    /*· }*/
  };
  export module Ticker {
    export type Options = Exclude<FirstParam<Kraken["ticker"]>, undefined>;
  }

  /**
   * @example {"XXBTZUSD":[[1616662740,"52591.9","52599.9","52591.8","52599.9","52599.1","0.11091626",5],[1616662800,"52600.0","52674.9","52599.9","52665.2","52643.3","2.49035996",30],[1616662860,"52677.7","52686.4","52602.1","52609.5","52634.5","1.25810675",20],[1616662920,"52603.9","52627.5","52601.2","52616.4","52614.0","3.42391799",23],[1616662980,"52601.2","52601.2","52599.9","52599.9","52599.9","0.43748934",7]],"last":1616662920}
   */
  export type OHLC = {
    /*· {*/

    /**
     * Array of tick data arrays
     * `[int <time>, string <open>, string <high>, string <low>, string <close>, string <vwap>, string <volume>, int <count>]`
     * @example [[1548115200,"3533.4","3543.7","3530.7","3539.4","3539.8","83.09287787",232]].
     */
    [pair: string]: Array<Array<string | number>>;
  } & {
    /**
     * ID to be used as since when polling for new, committed OHLC data.
     */
    last?: number | null;

    /*· }*/
  };
  export module OHLC {
    export type Options = Exclude<FirstParam<Kraken["ohlc"]>, undefined>;
  }

  /**
   * @example {"XXBTZUSD":{"asks":[["52523.00000","1.199",1616663113],["52536.00000","0.300",1616663112]],"bids":[["52522.90000","0.753",1616663112],["52522.80000","0.006",1616663109]]}}
   */
  export type Depth = {
    /*· {*/

    /**
     * Asset Pair Order Book Entries.
     */
    [pair: string]: {
      /**
       * Ask side array of entries `[<price>, <volume>, <timestamp>]`.
       * @example [["3539.90000","0.801",1548119951]].
       */
      asks?: Array<Array<string | number>> | null;
      /**
       * Bid side array of entries `[<price>, <volume>, <timestamp>]`.
       * @example [["3538.70000","0.798",1548119924]].
       */
      bids?: Array<Array<string | number>> | null;
    };

    /*· }*/
  };
  export module Depth {
    export type Options = Exclude<FirstParam<Kraken["depth"]>, undefined>;
  }

  /**
   * @example {"XXBTZUSD":[["52478.90000","0.00640000",1616663618.0362,"b","m",""],["52490.50000","0.01169993",1616663618.0377,"b","m",""],["52478.80000","0.04107375",1616663622.1366,"b","m",""]],"last":"1616663622136576459"}
   */
  export type Trades = {
    /*· {*/

    /**
     * Array of trade entries
     * `[<price>, <volume>, <time>, <buy/sell>, <market/limit>, <miscellaneous>]`
     * @example [["3535.40000","0.09670735",1548111757.2558,"b","m",""]].
     */
    [pair: string]: Array<Array<string | number>>;
  } & {
    /**
     * ID to be used as since when polling for new trade data.
     */
    last?: string | null;

    /*· }*/
  };
  export module Trades {
    export type Options = Exclude<FirstParam<Kraken["trades"]>, undefined>;
  }

  /**
   * @example {"XXBTZUSD":[[1548120550,"3538.70000","3541.50000"],[1548120551,"3538.80000","3541.50000"],[1548120554,"3538.80000","3541.40000"]],"last":1548122302}
   */
  export type Spread = {
    /*· {*/

    /**
     * Array of spread entries
     * `[int <time>, string <bid>, string <ask>]`
     * @example [[1548120550,"3538.70000","3541.50000"]].
     */
    [pair: string]: Array<Array<string | number>>;
  } & {
    /**
     * ID to be used as since when polling for new spread data.
     */
    last?: number | null;

    /*· }*/
  };
  export module Spread {
    export type Options = Exclude<FirstParam<Kraken["spread"]>, undefined>;
  }

  /**
   * @example {"token":"1Dwc4lzSwNWOAwkMdqhssNNFhs1ed606d1WcF3XfEMw","expires":900}
   */
  export type GetWebSocketsToken = {
    /*· {*/

    /**
     * Websockets token.
     */
    token?: string | null;
    /**
     * Time (in seconds) after which the token expires.
     */
    expires?: number | null;

    /*· }*/
  };
  export module GetWebSocketsToken {
    export type Options = Exclude<FirstParam<Kraken["getWebSocketsToken"]>, undefined>;
  }

  /**
   * @example {"ZUSD":"171288.6158","ZEUR":"504861.8946","ZGBP":"459567.9171","ZAUD":"500000.0000","ZCAD":"500000.0000","CHF":"500000.0000","XXBT":"1011.1908877900","XXRP":"100000.00000000","XLTC":"2000.0000000000","XETH":"818.5500000000","XETC":"1000.0000000000","XREP":"1000.0000000000","XXMR":"1000.0000000000","USDT":"500000.00000000","DASH":"1000.0000000000","GNO":"1000.0000000000","EOS":"1000.0000000000","BCH":"1016.6005000000","ADA":"100000.00000000","QTUM":"1000.0000000000","XTZ":"100000.00000000","ATOM":"100000.00000000","SC":"9999.9999999999","LSK":"1000.0000000000","WAVES":"1000.0000000000","ICX":"1000.0000000000","BAT":"1000.0000000000","OMG":"1000.0000000000","LINK":"1000.0000000000","DAI":"9999.9999999999","PAXG":"1000.0000000000","ALGO":"100000.00000000","USDC":"100000.00000000","TRX":"100000.00000000","DOT":"2.5000000000","OXT":"1000.0000000000","ETH2.S":"198.3970800000","ETH2":"2.5885574330","USD.M":"1213029.2780"}
   */
  export type Balance = {
    /*· {*/

    /**
     * Account Balance.
     * @example {"ZUSD":"2970172.7962"}.
     */
    [asset: string]: string;

    /*· }*/
  };
  export module Balance {
    export type Options = Exclude<FirstParam<Kraken["balance"]>, undefined>;
  }

  /**
   * @example {"eb":"1101.3425","tb":"392.2264","m":"7.0354","n":"-10.0232","c":"21.1063","v":"31.1297","e":"382.2032","mf":"375.1678","ml":"5432.57"}
   */
  export type TradeBalance = {
    /*· {*/

    /**
     * Equivalent balance (combined balance of all currencies).
     * @example "3224744.0162".
     */
    eb?: string | null;
    /**
     * Trade balance (combined balance of all equity currencies).
     * @example "3224744.0162".
     */
    tb?: string | null;
    /**
     * Margin amount of open positions.
     * @example "0.0000".
     */
    m?: string | null;
    /**
     * Unrealized net profit/loss of open positions.
     * @example "0.0000".
     */
    n?: string | null;
    /**
     * Cost basis of open positions.
     * @example "0.0000".
     */
    c?: string | null;
    /**
     * Current floating valuation of open positions.
     * @example "0.0000".
     */
    v?: string | null;
    /**
     * Equity: `trade balance + unrealized net profit/loss`.
     * @example "3224744.0162".
     */
    e?: string | null;
    /**
     * Free margin: `Equity - initial margin (maximum margin available to open new positions)`.
     * @example "3224744.0162".
     */
    mf?: string | null;
    /**
     * Margin level: `(equity / initial margin) * 100`.
     */
    ml?: string | null;

    /*· }*/
  };
  export module TradeBalance {
    export type Options = Exclude<FirstParam<Kraken["tradeBalance"]>, undefined>;
  }

  /**
   * @example {"open":{"OQCLML-BW3P3-BUCMWZ":{"refid":null,"userref":0,"status":"open","opentm":1616666559.8974,"starttm":0,"expiretm":0,"descr":{"pair":"XBTUSD","type":"buy","ordertype":"limit","price":"30010.0","price2":"0","leverage":"none","order":"buy 1.25000000 XBTUSD @ limit 30010.0","close":""},"vol":"1.25000000","vol_exec":"0.37500000","cost":"11253.7","fee":"0.00000","price":"30010.0","stopprice":"0.00000","limitprice":"0.00000","misc":"","oflags":"fciq","trades":["TCCCTY-WE2O6-P3NB37"]},"OB5VMB-B4U2U-DK2WRW":{"refid":null,"userref":120,"status":"open","opentm":1616665899.5699,"starttm":0,"expiretm":0,"descr":{"pair":"XBTUSD","type":"buy","ordertype":"limit","price":"14500.0","price2":"0","leverage":"5:1","order":"buy 0.27500000 XBTUSD @ limit 14500.0 with 5:1 leverage","close":""},"vol":"0.27500000","vol_exec":"0.00000000","cost":"0.00000","fee":"0.00000","price":"0.00000","stopprice":"0.00000","limitprice":"0.00000","misc":"","oflags":"fciq"},"OXHXGL-F5ICS-6DIC67":{"refid":null,"userref":120,"status":"open","opentm":1616665894.0036,"starttm":0,"expiretm":0,"descr":{"pair":"XBTUSD","type":"buy","ordertype":"limit","price":"17500.0","price2":"0","leverage":"5:1","order":"buy 0.27500000 XBTUSD @ limit 17500.0 with 5:1 leverage","close":""},"vol":"0.27500000","vol_exec":"0.00000000","cost":"0.00000","fee":"0.00000","price":"0.00000","stopprice":"0.00000","limitprice":"0.00000","misc":"","oflags":"fciq"},"OLQCVY-B27XU-MBPCL5":{"refid":null,"userref":251,"status":"open","opentm":1616665556.7646,"starttm":0,"expiretm":0,"descr":{"pair":"XBTUSD","type":"buy","ordertype":"limit","price":"23500.0","price2":"0","leverage":"none","order":"buy 0.27500000 XBTUSD @ limit 23500.0","close":""},"vol":"0.27500000","vol_exec":"0.00000000","cost":"0.00000","fee":"0.00000","price":"0.00000","stopprice":"0.00000","limitprice":"0.00000","misc":"","oflags":"fciq"},"OQCGAF-YRMIQ-AMJTNJ":{"refid":null,"userref":0,"status":"open","opentm":1616665511.0373,"starttm":0,"expiretm":0,"descr":{"pair":"XBTUSD","type":"buy","ordertype":"limit","price":"24500.0","price2":"0","leverage":"none","order":"buy 1.25000000 XBTUSD @ limit 24500.0","close":""},"vol":"1.25000000","vol_exec":"0.00000000","cost":"0.00000","fee":"0.00000","price":"0.00000","stopprice":"0.00000","limitprice":"0.00000","misc":"","oflags":"fciq"}}}
   */
  export type OpenOrders = {
    /*· {*/

    open?: {
      /**
       * Open Order.
       */
      [key: string]: {
        /**
         * Referral order transaction ID that created this order.
         */
        refid?: string | null;
        /**
         * User reference id.
         */
        userref?: number | null;
        /**
         * Status of order
         *   * pending = order pending book entry
         *   * open = open order
         *   * closed = closed order
         *   * canceled = order canceled
         *   * expired = order expired
         */
        status?: string | null;
        /**
         * Unix timestamp of when order was placed.
         */
        opentm?: number | null;
        /**
         * Unix timestamp of order start time (or 0 if not set).
         */
        starttm?: number | null;
        /**
         * Unix timestamp of order end time (or 0 if not set).
         */
        expiretm?: number | null;
        /**
         * Order description info.
         */
        descr?: {
          /**
           * Asset pair.
           */
          pair?: string | null;
          /**
           * Type of order (buy/sell).
           */
          type?: string | null;
          /**
           * Order type
           */
          ordertype?: string | null;
          /**
           * primary price.
           */
          price?: string | null;
          /**
           * Secondary price.
           */
          price2?: string | null;
          /**
           * Amount of leverage.
           */
          leverage?: string | null;
          /**
           * Order description.
           */
          order?: string | null;
          /**
           * Conditional close order description (if conditional close set).
           */
          close?: string | null;
        } | null;
        /**
         * Volume of order (base currency).
         */
        vol?: string | null;
        /**
         * Volume executed (base currency).
         */
        vol_exec?: string | null;
        /**
         * Total cost (quote currency unless).
         */
        cost?: string | null;
        /**
         * Total fee (quote currency).
         */
        fee?: string | null;
        /**
         * Average price (quote currency).
         */
        price?: string | null;
        /**
         * Stop price (quote currency).
         */
        stopprice?: string | null;
        /**
         * Triggered limit price (quote currency, when limit based order type triggered).
         */
        limitprice?: string | null;
        /**
         * Comma delimited list of miscellaneous info
         *   * `stopped` triggered by stop price
         *   * `touched` triggered by touch price
         *   * `liquidated` liquidation
         *   * `partial` partial fill
         */
        misc?: string | null;
        /**
         * Comma delimited list of order flags
         *   * `post` post-only order (available when ordertype = limit)
         *   * `fcib` prefer fee in base currency (default if selling)
         *   * `fciq` prefer fee in quote currency (default if buying, mutually exclusive with `fcib`)
         *   * `nompp` disable [market price protection](https://support.kraken.com/hc/en-us/articles/201648183-Market-Price-Protection) for market orders
         */
        oflags?: string | null;
        /**
         * List of trade IDs related to order (if trades info requested and data available).
         */
        trades?: Array<string> | null;
      };
    } | null;

    /*· }*/
  };
  export module OpenOrders {
    export type Options = Exclude<FirstParam<Kraken["openOrders"]>, undefined>;
  }

  /**
   * @example {"closed":{"O37652-RJWRT-IMO74O":{"refid":null,"userref":36493663,"status":"canceled","reason":"User requested","opentm":1616148493.7708,"closetm":1616148610.0482,"starttm":0,"expiretm":0,"descr":{"pair":"XBTGBP","type":"buy","ordertype":"limit","price":"2506.0","price2":"0","leverage":"none","order":"buy 0.00100000 XBTGBP @ limit 2506.0","close":""},"vol":"0.00100000","vol_exec":"0.00000000","cost":"0.00000","fee":"0.00000","price":"0.00000","stopprice":"0.00000","limitprice":"0.00000","misc":"","oflags":"fciq"},"O6YDQ5-LOMWU-37YKEE":{"refid":null,"userref":36493663,"status":"canceled","reason":"User requested","opentm":1616148493.7708,"closetm":1616148610.0477,"starttm":0,"expiretm":0,"descr":{"pair":"XBTGBP","type":"buy","ordertype":"limit","price":"2518.0","price2":"0","leverage":"none","order":"buy 0.00100000 XBTGBP @ limit 2518.0","close":""},"vol":"0.00100000","vol_exec":"0.00000000","cost":"0.00000","fee":"0.00000","price":"0.00000","stopprice":"0.00000","limitprice":"0.00000","misc":"","oflags":"fciq"}},"count":2}
   */
  export type ClosedOrders = {
    /*· {*/

    closed?: {
      /**
       * Closed Order.
       */
      [key: string]: {
        /**
         * Referral order transaction ID that created this order.
         */
        refid?: string | null;
        /**
         * User reference id.
         */
        userref?: number | null;
        /**
         * Status of order
         *   * pending = order pending book entry
         *   * open = open order
         *   * closed = closed order
         *   * canceled = order canceled
         *   * expired = order expired
         */
        status?: string | null;
        /**
         * Unix timestamp of when order was placed.
         */
        opentm?: number | null;
        /**
         * Unix timestamp of order start time (or 0 if not set).
         */
        starttm?: number | null;
        /**
         * Unix timestamp of order end time (or 0 if not set).
         */
        expiretm?: number | null;
        /**
         * Order description info.
         */
        descr?: {
          /**
           * Asset pair.
           */
          pair?: string | null;
          /**
           * Type of order (buy/sell).
           */
          type?: string | null;
          /**
           * Order type
           */
          ordertype?: string | null;
          /**
           * primary price.
           */
          price?: string | null;
          /**
           * Secondary price.
           */
          price2?: string | null;
          /**
           * Amount of leverage.
           */
          leverage?: string | null;
          /**
           * Order description.
           */
          order?: string | null;
          /**
           * Conditional close order description (if conditional close set).
           */
          close?: string | null;
        } | null;
        /**
         * Volume of order (base currency).
         */
        vol?: string | null;
        /**
         * Volume executed (base currency).
         */
        vol_exec?: string | null;
        /**
         * Total cost (quote currency unless).
         */
        cost?: string | null;
        /**
         * Total fee (quote currency).
         */
        fee?: string | null;
        /**
         * Average price (quote currency).
         */
        price?: string | null;
        /**
         * Stop price (quote currency).
         */
        stopprice?: string | null;
        /**
         * Triggered limit price (quote currency, when limit based order type triggered).
         */
        limitprice?: string | null;
        /**
         * Comma delimited list of miscellaneous info
         *   * `stopped` triggered by stop price
         *   * `touched` triggered by touch price
         *   * `liquidated` liquidation
         *   * `partial` partial fill
         */
        misc?: string | null;
        /**
         * Comma delimited list of order flags
         *   * `post` post-only order (available when ordertype = limit)
         *   * `fcib` prefer fee in base currency (default if selling)
         *   * `fciq` prefer fee in quote currency (default if buying, mutually exclusive with `fcib`)
         *   * `nompp` disable [market price protection](https://support.kraken.com/hc/en-us/articles/201648183-Market-Price-Protection) for market orders
         */
        oflags?: string | null;
        /**
         * List of trade IDs related to order (if trades info requested and data available).
         */
        trades?: Array<string> | null;
      } & {
        /**
         * Unix timestamp of when order was closed.
         */
        closetm?: number | null;
        /**
         * Additional info on status (if any).
         */
        reason?: string | null;
      };
    } | null;
    /**
     * Amount of available order info matching criteria.
     */
    count?: number | null;

    /*· }*/
  };
  export module ClosedOrders {
    export type Options = Exclude<FirstParam<Kraken["closedOrders"]>, undefined>;
  }

  /**
   * @example {"OBCMZD-JIEE7-77TH3F":{"refid":null,"userref":0,"status":"closed","reason":null,"opentm":1616665496.7808,"closetm":1616665499.1922,"starttm":0,"expiretm":0,"descr":{"pair":"XBTUSD","type":"buy","ordertype":"limit","price":"37500.0","price2":"0","leverage":"none","order":"buy 1.25000000 XBTUSD @ limit 37500.0","close":""},"vol":"1.25000000","vol_exec":"1.25000000","cost":"37526.2","fee":"37.5","price":"30021.0","stopprice":"0.00000","limitprice":"0.00000","misc":"","oflags":"fciq","trades":["TZX2WP-XSEOP-FP7WYR"]},"OMMDB2-FSB6Z-7W3HPO":{"refid":null,"userref":0,"status":"closed","reason":null,"opentm":1616592012.2317,"closetm":1616592012.2335,"starttm":0,"expiretm":0,"descr":{"pair":"XBTUSD","type":"sell","ordertype":"market","price":"0","price2":"0","leverage":"none","order":"sell 0.25000000 XBTUSD @ market","close":""},"vol":"0.25000000","vol_exec":"0.25000000","cost":"7500.0","fee":"7.5","price":"30000.0","stopprice":"0.00000","limitprice":"0.00000","misc":"","oflags":"fcib","trades":["TJUW2K-FLX2N-AR2FLU"]}}
   */
  export type QueryOrders = {
    /*· {*/

    [txid: string]:
      | {
          /**
           * Referral order transaction ID that created this order.
           */
          refid?: string | null;
          /**
           * User reference id.
           */
          userref?: number | null;
          /**
           * Status of order
           *   * pending = order pending book entry
           *   * open = open order
           *   * closed = closed order
           *   * canceled = order canceled
           *   * expired = order expired
           */
          status?: string | null;
          /**
           * Unix timestamp of when order was placed.
           */
          opentm?: number | null;
          /**
           * Unix timestamp of order start time (or 0 if not set).
           */
          starttm?: number | null;
          /**
           * Unix timestamp of order end time (or 0 if not set).
           */
          expiretm?: number | null;
          /**
           * Order description info.
           */
          descr?: {
            /**
             * Asset pair.
             */
            pair?: string | null;
            /**
             * Type of order (buy/sell).
             */
            type?: string | null;
            /**
             * Order type
             */
            ordertype?: string | null;
            /**
             * primary price.
             */
            price?: string | null;
            /**
             * Secondary price.
             */
            price2?: string | null;
            /**
             * Amount of leverage.
             */
            leverage?: string | null;
            /**
             * Order description.
             */
            order?: string | null;
            /**
             * Conditional close order description (if conditional close set).
             */
            close?: string | null;
          } | null;
          /**
           * Volume of order (base currency).
           */
          vol?: string | null;
          /**
           * Volume executed (base currency).
           */
          vol_exec?: string | null;
          /**
           * Total cost (quote currency unless).
           */
          cost?: string | null;
          /**
           * Total fee (quote currency).
           */
          fee?: string | null;
          /**
           * Average price (quote currency).
           */
          price?: string | null;
          /**
           * Stop price (quote currency).
           */
          stopprice?: string | null;
          /**
           * Triggered limit price (quote currency, when limit based order type triggered).
           */
          limitprice?: string | null;
          /**
           * Comma delimited list of miscellaneous info
           *   * `stopped` triggered by stop price
           *   * `touched` triggered by touch price
           *   * `liquidated` liquidation
           *   * `partial` partial fill
           */
          misc?: string | null;
          /**
           * Comma delimited list of order flags
           *   * `post` post-only order (available when ordertype = limit)
           *   * `fcib` prefer fee in base currency (default if selling)
           *   * `fciq` prefer fee in quote currency (default if buying, mutually exclusive with `fcib`)
           *   * `nompp` disable [market price protection](https://support.kraken.com/hc/en-us/articles/201648183-Market-Price-Protection) for market orders
           */
          oflags?: string | null;
          /**
           * List of trade IDs related to order (if trades info requested and data available).
           */
          trades?: Array<string> | null;
        }
      | ({
          /**
           * Referral order transaction ID that created this order.
           */
          refid?: string | null;
          /**
           * User reference id.
           */
          userref?: number | null;
          /**
           * Status of order
           *   * pending = order pending book entry
           *   * open = open order
           *   * closed = closed order
           *   * canceled = order canceled
           *   * expired = order expired
           */
          status?: string | null;
          /**
           * Unix timestamp of when order was placed.
           */
          opentm?: number | null;
          /**
           * Unix timestamp of order start time (or 0 if not set).
           */
          starttm?: number | null;
          /**
           * Unix timestamp of order end time (or 0 if not set).
           */
          expiretm?: number | null;
          /**
           * Order description info.
           */
          descr?: {
            /**
             * Asset pair.
             */
            pair?: string | null;
            /**
             * Type of order (buy/sell).
             */
            type?: string | null;
            /**
             * Order type
             */
            ordertype?: string | null;
            /**
             * primary price.
             */
            price?: string | null;
            /**
             * Secondary price.
             */
            price2?: string | null;
            /**
             * Amount of leverage.
             */
            leverage?: string | null;
            /**
             * Order description.
             */
            order?: string | null;
            /**
             * Conditional close order description (if conditional close set).
             */
            close?: string | null;
          } | null;
          /**
           * Volume of order (base currency).
           */
          vol?: string | null;
          /**
           * Volume executed (base currency).
           */
          vol_exec?: string | null;
          /**
           * Total cost (quote currency unless).
           */
          cost?: string | null;
          /**
           * Total fee (quote currency).
           */
          fee?: string | null;
          /**
           * Average price (quote currency).
           */
          price?: string | null;
          /**
           * Stop price (quote currency).
           */
          stopprice?: string | null;
          /**
           * Triggered limit price (quote currency, when limit based order type triggered).
           */
          limitprice?: string | null;
          /**
           * Comma delimited list of miscellaneous info
           *   * `stopped` triggered by stop price
           *   * `touched` triggered by touch price
           *   * `liquidated` liquidation
           *   * `partial` partial fill
           */
          misc?: string | null;
          /**
           * Comma delimited list of order flags
           *   * `post` post-only order (available when ordertype = limit)
           *   * `fcib` prefer fee in base currency (default if selling)
           *   * `fciq` prefer fee in quote currency (default if buying, mutually exclusive with `fcib`)
           *   * `nompp` disable [market price protection](https://support.kraken.com/hc/en-us/articles/201648183-Market-Price-Protection) for market orders
           */
          oflags?: string | null;
          /**
           * List of trade IDs related to order (if trades info requested and data available).
           */
          trades?: Array<string> | null;
        } & {
          /**
           * Unix timestamp of when order was closed.
           */
          closetm?: number | null;
          /**
           * Additional info on status (if any).
           */
          reason?: string | null;
        });

    /*· }*/
  };
  export module QueryOrders {
    export type Options = Exclude<FirstParam<Kraken["queryOrders"]>, undefined>;
  }

  /**
   * @example {"trades":{"THVRQM-33VKH-UCI7BS":{"ordertxid":"OQCLML-BW3P3-BUCMWZ","postxid":"TKH2SE-M7IF5-CFI7LT","pair":"XXBTZUSD","time":1616667796.8802,"type":"buy","ordertype":"limit","price":"30010.00000","cost":"600.20000","fee":"0.00000","vol":"0.02000000","margin":"0.00000","misc":""},"TUI2JG-VOE36-SW7UJQ":{"ordertxid":"OZABVF-MIK6V-L3ZTOE","postxid":"TF5GVO-T7ZZ2-6NBKBI","pair":"XXBTZUSD","time":1616511385.1402,"type":"sell","ordertype":"limit","price":"30000.00000","cost":"60.00000","fee":"0.06000","vol":"0.00200000","margin":"12.00000","misc":"closing"}},"count":2346}
   */
  export type TradesHistory = {
    /*· {*/

    /**
     * Trade info.
     */
    trades?: {
      /**
       * Trade info.
       */
      [txid: string]: {
        /**
         * Order responsible for execution of trade.
         */
        ordertxid?: string | null;
        /**
         * Asset pair.
         */
        pair?: string | null;
        /**
         * Unix timestamp of trade.
         */
        time?: number | null;
        /**
         * Type of order (buy/sell).
         */
        type?: string | null;
        /**
         * Order type.
         */
        ordertype?: string | null;
        /**
         * Average price order was executed at (quote currency).
         */
        price?: string | null;
        /**
         * Total cost of order (quote currency).
         */
        cost?: string | null;
        /**
         * Total fee (quote currency).
         */
        fee?: string | null;
        /**
         * Volume (base currency).
         */
        vol?: string | null;
        /**
         * Initial margin (quote currency).
         */
        margin?: string | null;
        /**
         * Comma delimited list of miscellaneous info:
         * * `closing` &mdash; Trade closes all or part of a position
         */
        misc?: string | null;
        /**
         * Position status (open/closed)
         * <br><sub><sup>Only present if trade opened a position</sub></sup>
         */
        posstatus?: string | null;
        /**
         * Average price of closed portion of position (quote currency)
         * <br><sub><sup>Only present if trade opened a position</sub></sup>
         */
        cprice?: string | null;
        /**
         * Total cost of closed portion of position (quote currency)
         * <br><sub><sup>Only present if trade opened a position</sub></sup>
         */
        ccost?: string | null;
        /**
         * Total fee of closed portion of position (quote currency)
         * <br><sub><sup>Only present if trade opened a position</sub></sup>
         */
        cfee?: string | null;
        /**
         * Total fee of closed portion of position (quote currency)
         * <br><sub><sup>Only present if trade opened a position</sub></sup>
         */
        cvol?: string | null;
        /**
         * Total margin freed in closed portion of position (quote currency)
         * <br><sub><sup>Only present if trade opened a position</sub></sup>
         */
        cmargin?: string | null;
        /**
         * Net profit/loss of closed portion of position (quote currency, quote currency scale)
         * <br><sub><sup>Only present if trade opened a position</sub></sup>
         */
        net?: string | null;
        /**
         * List of closing trades for position (if available)
         * <br><sub><sup>Only present if trade opened a position</sub></sup>
         */
        trades?: Array<string> | null;
      };
    } | null;
    /**
     * Amount of available trades matching criteria.
     */
    count?: number | null;

    /*· }*/
  };
  export module TradesHistory {
    export type Options = Exclude<FirstParam<Kraken["tradesHistory"]>, undefined>;
  }

  /**
   * @example {"THVRQM-33VKH-UCI7BS":{"ordertxid":"OQCLML-BW3P3-BUCMWZ","postxid":"TKH2SE-M7IF5-CFI7LT","pair":"XXBTZUSD","time":1616667796.8802,"type":"buy","ordertype":"limit","price":"30010.00000","cost":"600.20000","fee":"0.00000","vol":"0.02000000","margin":"0.00000","misc":""},"TTEUX3-HDAAA-RC2RUO":{"ordertxid":"OH76VO-UKWAD-PSBDX6","postxid":"TKH2SE-M7IF5-CFI7LT","pair":"XXBTZEUR","time":1614082549.3138,"type":"buy","ordertype":"limit","price":"1001.00000","cost":"0.20020","fee":"0.00000","vol":"0.00020000","margin":"0.00000","misc":""}}
   */
  export type QueryTrades = {
    /*· {*/

    /**
     * Trade info.
     */
    [txid: string]: {
      /**
       * Order responsible for execution of trade.
       */
      ordertxid?: string | null;
      /**
       * Asset pair.
       */
      pair?: string | null;
      /**
       * Unix timestamp of trade.
       */
      time?: number | null;
      /**
       * Type of order (buy/sell).
       */
      type?: string | null;
      /**
       * Order type.
       */
      ordertype?: string | null;
      /**
       * Average price order was executed at (quote currency).
       */
      price?: string | null;
      /**
       * Total cost of order (quote currency).
       */
      cost?: string | null;
      /**
       * Total fee (quote currency).
       */
      fee?: string | null;
      /**
       * Volume (base currency).
       */
      vol?: string | null;
      /**
       * Initial margin (quote currency).
       */
      margin?: string | null;
      /**
       * Comma delimited list of miscellaneous info:
       * * `closing` &mdash; Trade closes all or part of a position
       */
      misc?: string | null;
      /**
       * Position status (open/closed)
       * <br><sub><sup>Only present if trade opened a position</sub></sup>
       */
      posstatus?: string | null;
      /**
       * Average price of closed portion of position (quote currency)
       * <br><sub><sup>Only present if trade opened a position</sub></sup>
       */
      cprice?: string | null;
      /**
       * Total cost of closed portion of position (quote currency)
       * <br><sub><sup>Only present if trade opened a position</sub></sup>
       */
      ccost?: string | null;
      /**
       * Total fee of closed portion of position (quote currency)
       * <br><sub><sup>Only present if trade opened a position</sub></sup>
       */
      cfee?: string | null;
      /**
       * Total fee of closed portion of position (quote currency)
       * <br><sub><sup>Only present if trade opened a position</sub></sup>
       */
      cvol?: string | null;
      /**
       * Total margin freed in closed portion of position (quote currency)
       * <br><sub><sup>Only present if trade opened a position</sub></sup>
       */
      cmargin?: string | null;
      /**
       * Net profit/loss of closed portion of position (quote currency, quote currency scale)
       * <br><sub><sup>Only present if trade opened a position</sub></sup>
       */
      net?: string | null;
      /**
       * List of closing trades for position (if available)
       * <br><sub><sup>Only present if trade opened a position</sub></sup>
       */
      trades?: Array<string> | null;
    };

    /*· }*/
  };
  export module QueryTrades {
    export type Options = Exclude<FirstParam<Kraken["queryTrades"]>, undefined>;
  }

  /**
   * @example {"TF5GVO-T7ZZ2-6NBKBI":{"ordertxid":"OLWNFG-LLH4R-D6SFFP","posstatus":"open","pair":"XXBTZUSD","time":1605280097.8294,"type":"buy","ordertype":"limit","cost":"104610.52842","fee":"289.06565","vol":"8.82412861","vol_closed":"0.20200000","margin":"20922.10568","value":"258797.5","net":"+154186.9728","terms":"0.0100% per 4 hours","rollovertm":"1616672637","misc":"","oflags":""},"T24DOR-TAFLM-ID3NYP":{"ordertxid":"OIVYGZ-M5EHU-ZRUQXX","posstatus":"open","pair":"XXBTZUSD","time":1607943827.3172,"type":"buy","ordertype":"limit","cost":"145756.76856","fee":"335.24057","vol":"8.00000000","vol_closed":"0.00000000","margin":"29151.35371","value":"240124.0","net":"+94367.2314","terms":"0.0100% per 4 hours","rollovertm":"1616672637","misc":"","oflags":""},"TYMRFG-URRG5-2ZTQSD":{"ordertxid":"OF5WFH-V57DP-QANDAC","posstatus":"open","pair":"XXBTZUSD","time":1610448039.8374,"type":"buy","ordertype":"limit","cost":"0.00240","fee":"0.00000","vol":"0.00000010","vol_closed":"0.00000000","margin":"0.00048","value":"0","net":"+0.0006","terms":"0.0100% per 4 hours","rollovertm":"1616672637","misc":"","oflags":""},"TAFGBN-TZNFC-7CCYIM":{"ordertxid":"OF5WFH-V57DP-QANDAC","posstatus":"open","pair":"XXBTZUSD","time":1610448039.8448,"type":"buy","ordertype":"limit","cost":"2.40000","fee":"0.00264","vol":"0.00010000","vol_closed":"0.00000000","margin":"0.48000","value":"3.0","net":"+0.6015","terms":"0.0100% per 4 hours","rollovertm":"1616672637","misc":"","oflags":""},"T4O5L3-4VGS4-IRU2UL":{"ordertxid":"OF5WFH-V57DP-QANDAC","posstatus":"open","pair":"XXBTZUSD","time":1610448040.7722,"type":"buy","ordertype":"limit","cost":"21.59760","fee":"0.02376","vol":"0.00089990","vol_closed":"0.00000000","margin":"4.31952","value":"27.0","net":"+5.4133","terms":"0.0100% per 4 hours","rollovertm":"1616672637","misc":"","oflags":""}}
   */
  export type OpenPositions = {
    /*· {*/

    [txid: string]: {
      /**
       * Order ID responsible for the position.
       */
      ordertxid?: string | null;
      /**
       * Position status.
       */
      posstatus?: string | null;
      /**
       * Asset pair.
       */
      pair?: string | null;
      /**
       * Unix timestamp of trade.
       */
      time?: number | null;
      /**
       * Direction (buy/sell) of position.
       */
      type?: string | null;
      /**
       * Order type used to open position.
       */
      ordertype?: string | null;
      /**
       * Opening cost of position (in quote currency).
       */
      cost?: string | null;
      /**
       * Opening fee of position (in quote currency).
       */
      fee?: string | null;
      /**
       * Position opening size (in base currency).
       */
      vol?: string | null;
      /**
       * Quantity closed (in base currency).
       */
      vol_closed?: string | null;
      /**
       * Initial margin consumed (in quote currency).
       */
      margin?: string | null;
      /**
       * Current value of remaining position (if `docalcs` requested).
       */
      value?: string | null;
      /**
       * Unrealised P&L of remaining position (if `docalcs` requested).
       */
      net?: string | null;
      /**
       * Funding cost and term of position.
       */
      terms?: string | null;
      /**
       * Timestamp of next margin rollover fee.
       */
      rollovertm?: string | null;
      /**
       * Comma delimited list of add'l info.
       */
      misc?: string | null;
      /**
       * Comma delimited list of opening order flags.
       */
      oflags?: string | null;
    };

    /*· }*/
  };
  export module OpenPositions {
    export type Options = Exclude<FirstParam<Kraken["openPositions"]>, undefined>;
  }

  /**
   * @example {"ledger":{"L4UESK-KG3EQ-UFO4T5":{"refid":"TJKLXF-PGMUI-4NTLXU","time":1610464484.1787,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"-24.5000","fee":"0.0490","balance":"459567.9171"},"LMKZCZ-Z3GVL-CXKK4H":{"refid":"TBZIP2-F6QOU-TMB6FY","time":1610444262.8888,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"0.9852","fee":"0.0010","balance":"459592.4661"},"L62PIO-H6GVL-RU7P2V":{"refid":"TJ6FXZ-NW2GP-7MUKRH","time":1610444237.1186,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"0.9852","fee":"0.0010","balance":"459591.4819"},"LYMXD5-CQXKP-YBJUC5":{"refid":"TQETZH-4IU6L-Y7A6MX","time":1610443726.5242,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"0.9852","fee":"0.0010","balance":"459590.4977"},"LTS2VY-3V54Z-UYMBJE":{"refid":"TRTH6D-XH4OI-AWHIPE","time":1610443700.5213,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"0.9852","fee":"0.0010","balance":"459589.5135"},"LBPAFZ-VIWB4-3LEIZK":{"refid":"THW22F-LGPSJ-JF75IZ","time":1610443673.6795,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"0.9852","fee":"0.0010","balance":"459588.5293"},"L6FQNL-X2KVP-EK3B6P":{"refid":"TQE4OJ-2SS75-DVZXUS","time":1610411381.7107,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"-24.7360","fee":"0.0247","balance":"459587.5451"},"LI25LJ-HGRV5-3XTQ4S":{"refid":"TYD2KL-FYR3T-TAK3GQ","time":1610411299.5976,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"-24.7370","fee":"0.0247","balance":"459612.3058"},"LOZQ2J-KQMA7-ONUKJQ":{"refid":"TNDLFB-VMRSR-VREQZH","time":1610411228.747,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"-24.7090","fee":"0.0494","balance":"459637.0675"},"L27TEO-QPDH4-O5FHKS":{"refid":"TOYTLL-3AJZI-J3SASM","time":1610411228.7432,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"-22.0000","fee":"0.0440","balance":"459661.8259"},"LIXT22-MNMIS-AILGP7":{"refid":"TSHOGM-MIWTA-WLBGWW","time":1610124514.0877,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"-1.6370","fee":"0.0016","balance":"459683.8699"},"L3DSXB-EDXWW-FWGY6E":{"refid":"TGW4MX-E624F-MG6QZA","time":1610124514.0858,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"-2.0950","fee":"0.0021","balance":"459685.5085"},"LTIAS4-WQEAS-4VEU5O":{"refid":"TBAUTS-6WHY3-YMLIDI","time":1610124514.0841,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"-2.1280","fee":"0.0021","balance":"459687.6056"},"LBXAYN-2PKLC-5HQYUP":{"refid":"T4JWBD-6JM4T-CIHS5E","time":1610124514.0821,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"-2.1280","fee":"0.0021","balance":"459689.7357"},"L77IRV-V5QGW-XFIVFT":{"refid":"TA3YRJ-H3UBH-GW5NFU","time":1610124514.08,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"-2.1620","fee":"0.0022","balance":"459691.8658"}},"count":15}
   */
  export type Ledgers = {
    /*· {*/

    ledger?: {
      /**
       * Ledger Entry.
       */
      [ledger_id: string]: {
        /**
         * Reference Id.
         */
        refid?: string | null;
        /**
         * Unix timestamp of ledger.
         */
        time?: number | null;
        /**
         * Type of ledger entry.
         */
        type?: string | null;
        /**
         * Additional info relating to the ledger entry type, where applicable.
         */
        subtype?: string | null;
        /**
         * Asset class.
         */
        aclass?: string | null;
        /**
         * Asset.
         */
        asset?: string | null;
        /**
         * Transaction amount.
         */
        amount?: string | null;
        /**
         * Transaction fee.
         */
        fee?: string | null;
        /**
         * Resulting balance.
         */
        balance?: string | null;
      };
    } | null;
    /**
     * Amount of available ledger info matching criteria.
     */
    count?: number | null;

    /*· }*/
  };
  export module Ledgers {
    export type Options = Exclude<FirstParam<Kraken["ledgers"]>, undefined>;
  }

  /**
   * @example {"L4UESK-KG3EQ-UFO4T5":{"refid":"TJKLXF-PGMUI-4NTLXU","time":1610464484.1787,"type":"trade","subtype":"","aclass":"currency","asset":"ZGBP","amount":"-24.5000","fee":"0.0490","balance":"459567.9171"}}
   */
  export type QueryLedgers = {
    /*· {*/

    /**
     * Ledger Entry.
     */
    [ledger_id: string]: {
      /**
       * Reference Id.
       */
      refid?: string | null;
      /**
       * Unix timestamp of ledger.
       */
      time?: number | null;
      /**
       * Type of ledger entry.
       */
      type?: string | null;
      /**
       * Additional info relating to the ledger entry type, where applicable.
       */
      subtype?: string | null;
      /**
       * Asset class.
       */
      aclass?: string | null;
      /**
       * Asset.
       */
      asset?: string | null;
      /**
       * Transaction amount.
       */
      amount?: string | null;
      /**
       * Transaction fee.
       */
      fee?: string | null;
      /**
       * Resulting balance.
       */
      balance?: string | null;
    };

    /*· }*/
  };
  export module QueryLedgers {
    export type Options = Exclude<FirstParam<Kraken["queryLedgers"]>, undefined>;
  }

  /**
   * @example {"currency":"ZUSD","volume":"200709587.4223","fees":{"XXBTZUSD":{"fee":"0.1000","minfee":"0.1000","maxfee":"0.2600","nextfee":null,"nextvolume":null,"tiervolume":"10000000.0000"}},"fees_maker":{"XXBTZUSD":{"fee":"0.0000","minfee":"0.0000","maxfee":"0.1600","nextfee":null,"nextvolume":null,"tiervolume":"10000000.0000"}}}
   */
  export type TradeVolume = {
    /*· {*/

    /**
     * Volume currency.
     */
    currency?: string | null;
    /**
     * Current discount volume.
     */
    volume?: string | null;
    fees?: {
      /**
       * Fee Tier Info.
       */
      [pair: string]: {
        /**
         * Current fee (in percent).
         */
        fee?: string | null;
        /**
         * minimum fee for pair (if not fixed fee).
         */
        min_fee?: string | null;
        /**
         * maximum fee for pair (if not fixed fee).
         */
        max_fee?: string | null;
        /**
         * next tier's fee for pair (if not fixed fee,  null if at lowest fee tier).
         */
        next_fee?: string | null;
        /**
         * volume level of current tier (if not fixed fee. null if at lowest fee tier).
         */
        tier_volume?: string | null;
        /**
         * volume level of next tier (if not fixed fee. null if at lowest fee tier).
         */
        next_volume?: string | null;
      };
    } | null;
    fees_maker?: {
      /**
       * Fee Tier Info.
       */
      [pair: string]: {
        /**
         * Current fee (in percent).
         */
        fee?: string | null;
        /**
         * minimum fee for pair (if not fixed fee).
         */
        min_fee?: string | null;
        /**
         * maximum fee for pair (if not fixed fee).
         */
        max_fee?: string | null;
        /**
         * next tier's fee for pair (if not fixed fee,  null if at lowest fee tier).
         */
        next_fee?: string | null;
        /**
         * volume level of current tier (if not fixed fee. null if at lowest fee tier).
         */
        tier_volume?: string | null;
        /**
         * volume level of next tier (if not fixed fee. null if at lowest fee tier).
         */
        next_volume?: string | null;
      };
    } | null;

    /*· }*/
  };
  export module TradeVolume {
    export type Options = Exclude<FirstParam<Kraken["tradeVolume"]>, undefined>;
  }

  /**
   * @example {"id":"TCJA"}
   */
  export type AddExport = {
    /*· {*/

    /**
     * Report ID.
     */
    id?: string | null;

    /*· }*/
  };
  export module AddExport {
    export type Options = Exclude<FirstParam<Kraken["addExport"]>, undefined>;
  }

  /**
   * @example [{"id":"VSKC","descr":"my_trades_1","format":"CSV","report":"trades","subtype":"all","status":"Processed","flags":"0","fields":"all","createdtm":"1616669085","expiretm":"1617878685","starttm":"1616669093","completedtm":"1616669093","datastarttm":"1614556800","dataendtm":"1616669085","aclass":"forex","asset":"all"},{"id":"TCJA","descr":"my_trades_1","format":"CSV","report":"trades","subtype":"all","status":"Processed","flags":"0","fields":"all","createdtm":"1617363637","expiretm":"1618573237","starttm":"1617363664","completedtm":"1617363664","datastarttm":"1617235200","dataendtm":"1617363637","aclass":"forex","asset":"all"}]
   */
  export type ExportStatus = Array<{
    /*· {*/

    /**
     * Report ID.
     */
    id?: string | null;
    descr?: string | null;
    format?: string | null;
    report?: string | null;
    subtype?: string | null;
    /**
     * Status of the report.
     */
    status?: string | null;
    /**
     * @deprecated.
     */
    flags?: string | null;
    fields?: string | null;
    /**
     * UNIX timestamp of report request.
     */
    createdtm?: string | null;
    /**
     * @deprecated.
     */
    expiretm?: string | null;
    /**
     * UNIX timestamp report processing began.
     */
    starttm?: string | null;
    /**
     * UNIX timestamp report processing finished.
     */
    completedtm?: string | null;
    /**
     * UNIX timestamp of the report data start time.
     */
    datastarttm?: string | null;
    /**
     * UNIX timestamp of the report data end time.
     */
    dataendtm?: string | null;
    /**
     * @deprecated.
     */
    aclass?: string | null;
    asset?: string | null;

    /*· }*/
  }>;
  export module ExportStatus {
    export type Options = Exclude<FirstParam<Kraken["exportStatus"]>, undefined>;
  }

  export type RetrieveExport = Buffer;
  export module RetrieveExport {
    export type Options = Exclude<FirstParam<Kraken["retrieveExport"]>, undefined>;
  }

  /**
   * @example {"delete":true}
   */
  export type RemoveExport = {
    /*· {*/

    /**
     * Whether deletion was successful.
     */
    delete?: boolean | null;
    /**
     * Whether cancellation was successful.
     */
    cancel?: boolean | null;

    /*· }*/
  };
  export module RemoveExport {
    export type Options = Exclude<FirstParam<Kraken["removeExport"]>, undefined>;
  }

  /**
   * @example {"cURL (Limit with conditional stop-loss)":{"value":{"error":[],"result":{"descr":{"order":"buy 2.12340000 XBTUSD @ limit 45000.1 with 2:1 leverage","close":"close position @ stop loss 38000.0 -> limit 36000.0"},"txid":["OUF4EM-FRGI2-MQMWZD"]}}},"Python (Limit)":{"value":{"error":[],"result":{"descr":{"order":"buy 1.25000000 XBTUSD @ limit 27500.0"},"txid":["OU22CG-KLAF2-FWUDD7"]}}}}
   */
  export type AddOrder = {
    /*· {*/

    /**
     * Order description info.
     */
    descr?: {
      /**
       * Order description.
       */
      order?: string | null;
      /**
       * Conditional close order description, if applicable.
       */
      close?: string | null;
    } | null;
    /**
     * Transaction IDs for order
     * <br><sup><sub>(if order was added successfully)</sup></sub>
     */
    txid?: Array<string> | null;

    /*· }*/
  };
  export module AddOrder {
    export type Options = Exclude<FirstParam<Kraken["addOrder"]>, undefined>;
  }

  /**
   * @example {"count":1}
   */
  export type CancelOrder = {
    /*· {*/

    /**
     * Number of orders cancelled.
     */
    count?: number | null;
    /**
     * if set, order(s) is/are pending cancellation.
     */
    pending?: boolean | null;

    /*· }*/
  };
  export module CancelOrder {
    export type Options = Exclude<FirstParam<Kraken["cancelOrder"]>, undefined>;
  }

  /**
   * @example {"count":4}
   */
  export type CancelAll = {
    /*· {*/

    /**
     * Number of orders that were cancelled.
     */
    count?: number | null;

    /*· }*/
  };
  export module CancelAll {
    export type Options = Exclude<FirstParam<Kraken["cancelAll"]>, undefined>;
  }

  /**
   * @example {"currentTime":"2021-03-24T17:41:56Z","triggerTime":"2021-03-24T17:42:56Z"}
   */
  export type CancelAllOrdersAfter = {
    /*· {*/

    /**
     * Timestamp (RFC3339 format) at which the request was received.
     */
    currentTime?: string | null;
    /**
     * Timestamp (RFC3339 format) after which all orders will be cancelled, unless the timer is extended or disabled.
     */
    triggerTime?: string | null;

    /*· }*/
  };
  export module CancelAllOrdersAfter {
    export type Options = Exclude<FirstParam<Kraken["cancelAllOrdersAfter"]>, undefined>;
  }

  /**
   * @example [{"method":"Bitcoin","limit":false,"fee":"0.0000000000","gen-address":true}]
   */
  export type DepositMethods = Array<{
    /*· {*/

    /**
     * Name of deposit method.
     */
    method?: string | null;
    /**
     * Net profit/loss of closed portion of position (quote currency, quote currency scale)
     * <br><sub><sup>Only present if trade opened a position</sub></sup>
     */
    limit?: (string | boolean) | null;
    /**
     * Amount of fees that will be paid.
     */
    fee?: string | null;
    /**
     * Whether or not method has an address setup fee.
     */
    "address-setup-fee"?: string | null;
    /**
     * Whether new addresses can be generated for this method.
     */
    "gen-address"?: boolean | null;

    /*· }*/
  }>;
  export module DepositMethods {
    export type Options = Exclude<FirstParam<Kraken["depositMethods"]>, undefined>;
  }

  /**
   * @example [{"address":"2N9fRkx5JTWXWHmXzZtvhQsufvoYRMq9ExV","expiretm":"0","new":true},{"address":"2NCpXUCEYr8ur9WXM1tAjZSem2w3aQeTcAo","expiretm":"0","new":true},{"address":"2Myd4eaAW96ojk38A2uDK4FbioCayvkEgVq","expiretm":"0"}]
   */
  export type DepositAddresses = Array<{
    /*· {*/

    /**
     * Deposit Address.
     */
    address?: string | null;
    /**
     * Expiration time in unix timestamp, or 0 if not expiring.
     */
    expiretm?: string | null;
    /**
     * Whether or not address has ever been used.
     */
    new?: boolean | null;

    /*· }*/
  }>;
  export module DepositAddresses {
    export type Options = Exclude<FirstParam<Kraken["depositAddresses"]>, undefined>;
  }

  /**
   * @example [{"method":"Bitcoin","aclass":"currency","asset":"XXBT","refid":"QGBCOYA-UNP53O-F2JDNS","txid":"6544b41b607d8b2512baf801755a3a87b6890eacdb451be8a94059fb11f0a8d9","info":"2Myd4eaAW96ojk38A2uDK4FbioCayvkEgVq","amount":"0.78125000","fee":"0.0000000000","time":1546992722,"status":"Success"},{"method":"Bitcoin","aclass":"currency","asset":"XXBT","refid":"QGBHU3O-73ARA5-IFCFZT","txid":"fe12122222fe7fb1bc756a10ecd25f93015e959810ff1daf56535b9b01a803af","info":"2Myd4eaAW96ojk38A2uDK4FbioCayvkEgVq","amount":"0.78125000","time":1546992722,"status":"Settled"}]
   */
  export type DepositStatus = Array<{
    /*· {*/

    /**
     * Name of deposit method.
     */
    method?: string | null;
    /**
     * Asset class.
     */
    aclass?: string | null;
    /**
     * Asset.
     */
    asset?: string | null;
    /**
     * Reference ID.
     */
    refid?: string | null;
    /**
     * Method transaction ID.
     */
    txid?: string | null;
    /**
     * Method transaction information.
     */
    info?: string | null;
    /**
     * Amount deposited.
     */
    amount?: string | null;
    /**
     * Fees paid.
     */
    fee?: string | null;
    /**
     * Unix timestamp when request was made.
     */
    time?: number | null;
    /**
     * Status of deposit<br>
     * <sup><sub>For information about the status, please refer to the [IFEX financial transaction states](https://github.com/globalcitizen/ifex-protocol/blob/master/draft-ifex-00.txt#L837).</sup></sub>
     */
    status?: string | null;
    /**
     * Addition status properties <sup><sub>(if available)</sup></sub><br>
     *   * `return` A return transaction initiated by Kraken
     *   * `onhold` Deposit is on hold pending review
     */
    "status-prop"?: string | null;

    /*· }*/
  }>;
  export module DepositStatus {
    export type Options = Exclude<FirstParam<Kraken["depositStatus"]>, undefined>;
  }

  /**
   * @example {"method":"Bitcoin","limit":"332.00956139","amount":"0.72485000","fee":"0.00015000"}
   */
  export type WithdrawInfo = {
    /*· {*/

    /**
     * Name of the withdrawal method that will be used.
     */
    method?: string | null;
    /**
     * Maximum net amount that can be withdrawn right now.
     */
    limit?: string | null;
    /**
     * Net amount that will be sent, after fees.
     */
    amount?: string | null;
    /**
     * Amount of fees that will be paid.
     */
    fee?: string | null;

    /*· }*/
  };
  export module WithdrawInfo {
    export type Options = Exclude<FirstParam<Kraken["withdrawInfo"]>, undefined>;
  }

  /**
   * @example {"refid":"AGBSO6T-UFMTTQ-I7KGS6"}
   */
  export type Withdraw = {
    /*· {*/

    /**
     * Reference ID.
     */
    refid?: string | null;

    /*· }*/
  };
  export module Withdraw {
    export type Options = Exclude<FirstParam<Kraken["withdraw"]>, undefined>;
  }

  /**
   * @example [{"method":"Bitcoin","aclass":"currency","asset":"XXBT","refid":"AGBZNBO-5P2XSB-RFVF6J","txid":null,"info":"mzp6yUVMRxfasyfwzTZjjy38dHqMX7Z3GR","amount":"0.72485000","fee":"0.00015000","time":1617014586,"status":"Pending"},{"method":"Bitcoin","aclass":"currency","asset":"XXBT","refid":"AGBSO6T-UFMTTQ-I7KGS6","txid":null,"info":"mzp6yUVMRxfasyfwzTZjjy38dHqMX7Z3GR","amount":"0.72485000","fee":"0.00015000","time":1617015423,"status":"Failure","status-prop":"canceled"}]
   */
  export type WithdrawStatus = Array<{
    /*· {*/

    /**
     * Name of withdrawal method.
     */
    method?: string | null;
    /**
     * Asset class.
     */
    aclass?: string | null;
    /**
     * Asset.
     */
    asset?: string | null;
    /**
     * Reference ID.
     */
    refid?: string | null;
    /**
     * Method transaction ID.
     */
    txid?: string | null;
    /**
     * Method transaction information.
     */
    info?: string | null;
    /**
     * Amount withdrawn.
     */
    amount?: string | null;
    /**
     * Fees paid.
     */
    fee?: string | null;
    /**
     * Unix timestamp when request was made.
     */
    time?: number | null;
    /**
     * Status of withdraw<br>
     * <sup><sub>For information about the status, please refer to the [IFEX financial transaction states](https://github.com/globalcitizen/ifex-protocol/blob/master/draft-ifex-00.txt#L837).</sup></sub>
     */
    status?: string | null;
    /**
     * Addition status properties <sup><sub>(if available)</sup></sub><br>
     *   * `cancel-pending` cancelation requested
     *   * `canceled` canceled
     *   * `cancel-denied` cancelation requested but was denied
     *   * `return` a return transaction initiated by Kraken; it cannot be canceled
     *   * `onhold` withdrawal is on hold pending review
     */
    "status-prop"?: string | null;

    /*· }*/
  }>;
  export module WithdrawStatus {
    export type Options = Exclude<FirstParam<Kraken["withdrawStatus"]>, undefined>;
  }

  /**
   * @example true
   */
  export type WithdrawCancel = boolean;
  export module WithdrawCancel {
    export type Options = Exclude<FirstParam<Kraken["withdrawCancel"]>, undefined>;
  }

  /**
   * @example {"refid":"BOG5AE5-KSCNR4-VPNPEV"}
   */
  export type WalletTransfer = {
    /*· {*/

    /**
     * Reference ID.
     * @example "BOG5AE5-KSCNR4-VPNPEV".
     */
    refid?: string | null;

    /*· }*/
  };
  export module WalletTransfer {
    export type Options = Exclude<FirstParam<Kraken["walletTransfer"]>, undefined>;
  }

  /**
   * @example {"refid":"BOG5AE5-KSCNR4-VPNPEV"}
   */
  export type Stake = {
    /*· {*/

    /**
     * Reference ID.
     * @example "BOG5AE5-KSCNR4-VPNPEV".
     */
    refid?: string | null;

    /*· }*/
  };
  export module Stake {
    export type Options = Exclude<FirstParam<Kraken["stake"]>, undefined>;
  }

  /**
   * @example {"refid":"BOG5AE5-KSCNR4-VPNPEV"}
   */
  export type Unstake = {
    /*· {*/

    /**
     * Reference ID.
     * @example "BOG5AE5-KSCNR4-VPNPEV".
     */
    refid?: string | null;

    /*· }*/
  };
  export module Unstake {
    export type Options = Exclude<FirstParam<Kraken["unstake"]>, undefined>;
  }

  /**
   * @example [{"method":"polkadot-staked","asset":"DOT","staking_asset":"DOT.S","rewards":{"reward":"12.00","type":"percentage"},"on_chain":true,"can_stake":true,"can_unstake":true,"minimum_amount":{"staking":"0.0000000000","unstaking":"0.0000000000"}},{"method":"kusama-staked","asset":"KSM","staking_asset":"KSM.S","rewards":{"reward":"12.00","type":"percentage"},"on_chain":true,"can_stake":true,"can_unstake":true,"minimum_amount":{"staking":"0.0000000000","unstaking":"0.0000000000"}}]
   */
  export type StakingAssets = Array<{
    /*· {*/

    /**
     * Asset code/name.
     */
    asset: string;
    /**
     * Staking asset code/name.
     */
    staking_asset: string;
    /**
     * Unique ID of the staking option (used in Stake/Unstake operations).
     */
    method?: string | null;
    /**
     * Whether the staking operation is on-chain or not.
     * @default true.
     */
    on_chain?: boolean | null;
    /**
     * Whether the user will be able to stake this asset.
     * @default true.
     */
    can_stake?: boolean | null;
    /**
     * Whether the user will be able to unstake this asset.
     * @default true.
     */
    can_unstake?: boolean | null;
    /**
     * Minimium amounts for staking/unstaking.
     */
    minimum_amount?: {
      /**
       * @default "0".
       */
      unstaking: string;
      /**
       * @default "0".
       */
      staking: string;
    } | null;
    /**
     * Describes the locking periods and percentages for staking/unstaking operations.
     */
    lock?: {
      unstaking?: Array<{
        /**
         * Days the funds are locked.
         */
        days: number;
        /**
         * Percentage of the funds that are locked (0 - 100).
         */
        percentage: number;
      }> | null;
      staking?: Array<{
        /**
         * Days the funds are locked.
         */
        days: number;
        /**
         * Percentage of the funds that are locked (0 - 100).
         */
        percentage: number;
      }> | null;
      lockup?: Array<{
        /**
         * Days the funds are locked.
         */
        days: number;
        /**
         * Percentage of the funds that are locked (0 - 100).
         */
        percentage: number;
      }> | null;
    } | null;
    /**
     * @default true.
     */
    enabled_for_user?: boolean | null;
    disabled?: boolean | null;
    /**
     * Describes the rewards earned while staking.
     */
    rewards: {
      /**
       * Reward earned while staking.
       */
      reward?: string | null;
      /**
       * Reward type.
       */
      type?: string | null;
    };

    /*· }*/
  }>;
  export module StakingAssets {
    export type Options = Exclude<FirstParam<Kraken["stakingAssets"]>, undefined>;
  }

  /**
   * @example [{"method":"ada-staked","aclass":"currency","asset":"ADA.S","refid":"RUSB7W6-ESIXUX-K6PVTM","amount":"0.34844300","fee":"0.00000000","time":1622967367,"status":"Initial","type":"bonding"},{"method":"xtz-staked","aclass":"currency","asset":"XTZ.S","refid":"RUCXX7O-6MWQBO-CQPGAX","amount":"0.00746900","fee":"0.00000000","time":1623074402,"status":"Initial","type":"bonding"}]
   */
  export type StakingPending = Array<{
    /*· {*/

    /**
     * The reference ID of the transaction.
     */
    refid?: string | null;
    /**
     * The type of transaction.
     */
    type?: string | null;
    /**
     * Asset code/name.
     */
    asset?: string | null;
    /**
     * The transaction amount.
     */
    amount?: string | null;
    /**
     * Unix timestamp when the transaction was initiated.
     */
    time?: string | null;
    /**
     * Unix timestamp from the start of bond period (applicable only to `bonding` transactions).
     */
    bond_start?: number | null;
    /**
     * Unix timestamp of the end of bond period (applicable only to `bonding` transactions).
     */
    bond_end?: number | null;
    /**
     * Transaction status.
     */
    status?: string | null;

    /*· }*/
  }>;
  export module StakingPending {
    export type Options = Exclude<FirstParam<Kraken["stakingPending"]>, undefined>;
  }

  /**
   * @example [{"method":"xbt-staked","aclass":"currency","asset":"XBT.M","refid":"RWBL2YD-SJYHBZ-VBB3RD","amount":"0.0038634900","fee":"0.0000000000","time":1622971496,"status":"Success","type":"bonding","bond_start":1622971496,"bond_end":1622971496},{"method":"ada-staked","aclass":"currency","asset":"ADA.S","refid":"RUSB7W6-ESIXUX-K6PVTM","amount":"0.34844300","fee":"0.00000000","time":1622967367,"status":"Success","type":"bonding","bond_start":1622967367,"bond_end":1622967367},{"method":"eth2-staked","aclass":"currency","asset":"ETH2","refid":"RUOCJP3-TWUJOE-L4EEG3","amount":"0.0001943480","fee":"0.0000000000","time":1622943004,"status":"Success","type":"bonding","bond_start":1622943004,"bond_end":1622943004}]
   */
  export type StakingTransactions = Array<{
    /*· {*/

    /**
     * The reference ID of the transaction.
     */
    refid?: string | null;
    /**
     * The type of transaction.
     */
    type?: string | null;
    /**
     * Asset code/name.
     */
    asset?: string | null;
    /**
     * The transaction amount.
     */
    amount?: string | null;
    /**
     * Unix timestamp when the transaction was initiated.
     */
    time?: string | null;
    /**
     * Unix timestamp from the start of bond period (applicable only to `bonding` transactions).
     */
    bond_start?: number | null;
    /**
     * Unix timestamp of the end of bond period (applicable only to `bonding` transactions).
     */
    bond_end?: number | null;
    /**
     * Transaction status.
     */
    status?: string | null;

    /*· }*/
  }>;
  export module StakingTransactions {
    export type Options = Exclude<FirstParam<Kraken["stakingTransactions"]>, undefined>;
  }

  /*                                                              REST Types }*/

  export module WS {
    /*                                                       WebSocket Types {*/

    /**
     * @example {"a":["5525.40000",1,"1.000"],"b":["5525.10000",1,"1.000"],"c":["5525.10000","0.00398963"],"h":["5783.00000","5783.00000"],"l":["5505.00000","5505.00000"],"o":["5760.70000","5763.40000"],"p":["5631.44067","5653.78939"],"t":[11493,16267],"v":["2634.11501494","3591.17907851"]}
     */
    export type Ticker = {
      /*· {*/

      /** Ask */
      a?:
        | [
            /** Best ask price */
            string,
            /** Whole lot volume */
            number,
            /** Lot volume */
            string
          ]
        | null;
      /** Bid */
      b?:
        | [
            /** Best bid price */
            string,
            /** Whole lot volume */
            number,
            /** Lot volume */
            string
          ]
        | null;
      /** Close */
      c?:
        | [
            /** Price */
            string,
            /** Lot volume */
            string
          ]
        | null;
      /** Volume */
      v?:
        | [
            /** Value today */
            string,
            /** Value over the last 24 hours */
            string
          ]
        | null;
      /** Volume weighted average price */
      p?:
        | [
            /** Value today */
            string,
            /** Value over the last 24 hours */
            string
          ]
        | null;
      /** Number of trades */
      t?:
        | [
            /** Value today */
            number,
            /** Value over the last 24 hours */
            number
          ]
        | null;
      /** Low price */
      l?:
        | [
            /** Value today */
            string,
            /** Value over the last 24 hours */
            string
          ]
        | null;
      /** High price */
      h?:
        | [
            /** Value today */
            string,
            /** Value over the last 24 hours */
            string
          ]
        | null;
      /** Open Price */
      o?:
        | [
            /** Value today */
            string,
            /** Value over the last 24 hours */
            string
          ]
        | null;

      /*· }*/
    };
    export module Ticker {
      export type Options = Exclude<FirstParam<Kraken["ws"]["ticker"]>, undefined>;
      export type Subscriber = ReturnType<Kraken["ws"]["ticker"]>;
    }

    /**
     * @example ["1542057314.748456","1542057360.435743","3586.70000","3586.70000","3586.60000","3586.60000","3586.68894","0.03373000",2]
     */
    export type OHLC = Array<
      | [
          /*· {*/

          /** Begin time of interval, in seconds since epoch */
          string,
          /** End time of interval, in seconds since epoch */
          string,
          /** Open price of interval */
          string,
          /** High price within interval */
          string,
          /** Low price within interval */
          string,
          /** Close price of interval */
          string,
          /** Volume weighted average price within interval */
          string,
          /** Accumulated volume within interval */
          string,
          /** Number of trades within interval */
          number

          /*· }*/
        ]
    >;
    export module OHLC {
      export type Options = Exclude<FirstParam<Kraken["ws"]["ohlc"]>, undefined>;
      export type Subscriber = ReturnType<Kraken["ws"]["ohlc"]>;
    }

    /**
     * @example [["5541.20000","0.15850568","1534614057.321597","s","l",""],["6060.00000","0.02455000","1534614057.324998","b","l",""]]
     */
    export type Trade = Array<
      [
        /*· {*/

        /** Price */
        string,
        /** Volume */
        string,
        /** Time, seconds since epoch */
        string,
        /** Triggering order side, buy/sell */
        string,
        /** Triggering order type market/limit */
        string,
        /** Miscellaneous */
        string

        /*· }*/
      ]
    >;
    export module Trade {
      export type Options = Exclude<FirstParam<Kraken["ws"]["trade"]>, undefined>;
      export type Subscriber = ReturnType<Kraken["ws"]["trade"]>;
    }

    /**
     * @example ["5698.40000","5700.00000","1542057299.545897","1.01234567","0.98765432"]
     */
    export type Spread = Array<
      | [
          /*· {*/

          /** Bid price */
          string,
          /** Ask price */
          string,
          /** Time, seconds since epoch */
          string,
          /** Bid Volume */
          string,
          /** Ask Volume */
          string

          /*· }*/
        ]
    >;
    export module Spread {
      export type Options = Exclude<FirstParam<Kraken["ws"]["spread"]>, undefined>;
      export type Subscriber = ReturnType<Kraken["ws"]["spread"]>;
    }

    export type Book = Book.Snapshot | Book.Ask | Book.Bid | Book.Mirror;
    export module Book {
      export type Level = [
        /*· {*/

        /** Price level */
        string,
        /** Price level volume, for updates volume = 0 for level removal/deletion */
        string,
        /** Price level last updated, seconds since epoch */
        string

        /*· }*/
      ];
      export type LevelUpdate = [
        /*· {*/

        /** Price level */
        string,
        /** Price level volume, for updates volume = 0 for level removal/deletion */
        string,
        /** Price level last updated, seconds since epoch */
        string,
        /** Optional - "r" in case update is a republished update */
        "r"?

        /*· }*/
      ];
      /**
       * @example {"as":[["5541.30000","2.50700000","1534614248.123678"],["5541.80000","0.33000000","1534614098.345543"],["5542.70000","0.64700000","1534614244.654432"]],"bs":[["5541.20000","1.52900000","1534614248.765567"],["5539.90000","0.30000000","1534614241.769870"],["5539.50000","5.00000000","1534613831.243486"]]}
       */
      export type Snapshot = {
        /*· {*/

        /** Array of price levels, ascending from best ask */
        as: Array<Level>;
        /** Array of price levels, descending from best bid */
        bs: Array<Level>;

        /*· }*/
      };
      /**
       * @example {"a":[["5541.30000","2.50700000","1534614248.456738"],["5542.50000","0.40100000","1534614248.456738"]],"c":"974942666"}
       * @example {"a":[["5541.30000","2.50700000","1534614248.456738","r"],["5542.50000","0.40100000","1534614248.456738","r"]],"c":"974942666"}
       */
      export type Ask = {
        /*· {*/

        /** Ask array of level updates */
        a: Array<LevelUpdate>;
        /** Optional - Book checksum as a quoted unsigned 32-bit integer, present only within the last update container in the message. See calculation details. */
        c?: string | null;

        /*· }*/
      };
      /**
       * @example {"b":[["5541.30000","0.00000000","1534614335.345903"]],"c":"974942666"}
       */
      export type Bid = {
        /*· {*/

        /** Bid array of level updates */
        b: Array<LevelUpdate>;
        /** Optional - Book checksum as a quoted unsigned 32-bit integer, present only within the last update container in the message. See calculation details. */
        c?: string | null;

        /*· }*/
      };

      export type Mirror = Snapshot;

      export type Options = Exclude<FirstParam<Kraken["ws"]["book"]>, undefined>;
      export type Subscriber = ReturnType<Kraken["ws"]["book"]>;

      export function applyUpdate(
        snapshot: Snapshot,
        update: Ask | Bid
      ): { modified: boolean; verified: boolean } {
        const [snaphsotLevels, updateLevels, ascending] = ((): [
          Level[],
          LevelUpdate[],
          boolean
        ] => {
          if ((<Ask>update).a) {
            return [snapshot.as, (<Ask>update).a, true];
          } else {
            return [snapshot.bs, (<Bid>update).b, false];
          }
        })();

        let modified = false;

        const depth = snaphsotLevels.length;
        for (const u of updateLevels) {
          const uPrice = +u[0];
          const uTime = +u[2];
          let matched = false;
          for (let i = 0; i < snaphsotLevels.length; ++i) {
            const lPrice = +snaphsotLevels[i][0];
            // iterate until correct price level is found
            if (ascending && uPrice > lPrice) continue;
            if (!ascending && uPrice < lPrice) continue;

            // if price matches level, apply if it is more recent
            if (uPrice === lPrice) {
              // only apply the update if more recent (is considered applied)
              if (uTime > +snaphsotLevels[i][2]) {
                // update level if update vol is not zero, else delete
                if (+u[1] !== 0) {
                  snaphsotLevels[i][1] = u[1];
                  snaphsotLevels[i][2] = u[2];
                } else {
                  snaphsotLevels.splice(i, 1);
                }
                modified = true;
              }
              matched = true;
              break;
            }
            // else price is after sort position; insert before
            else {
              snaphsotLevels.splice(i, 0, [u[0], u[1], u[2]]);
              matched = true;
              modified = true;
              break;
            }
          }
          // must be an end-of-book update
          if (!matched) {
            snaphsotLevels.push([u[0], u[1], u[2]]);
            modified = true;
          }
        }

        // after all updates, pop if length > depth
        for (let i = 0; i < snaphsotLevels.length - depth; ++i) snaphsotLevels.pop();

        // verify that the checksum is correct

        let verifystr = "";
        {
          let i = 0;
          for (const a of snapshot.as) {
            verifystr += a[0].replace(".", "").replace(/^0*(.*)/m, "$1");
            verifystr += a[1].replace(".", "").replace(/^0*(.*)/m, "$1");
            if (++i >= 10) break;
          }
        }
        {
          let i = 0;
          for (const b of snapshot.bs) {
            verifystr += b[0].replace(".", "").replace(/^0*(.*)/m, "$1");
            verifystr += b[1].replace(".", "").replace(/^0*(.*)/m, "$1");
            if (++i >= 10) break;
          }
        }
        return { modified, verified: update.c === "" + crc32(verifystr) };
      }
    }

    /**
     * @example [{"TDLH43-DVQXD-2KHVYY":{"cost":"1000000.00000","fee":"1600.00000","margin":"0.00000","ordertxid":"TDLH43-DVQXD-2KHVYY","ordertype":"limit","pair":"XBT/EUR","postxid":"OGTT3Y-C6I3P-XRI6HX","price":"100000.00000","time":"1560516023.070651","type":"sell","vol":"1000000000.00000000"}},{"TDLH43-DVQXD-2KHVYY":{"cost":"1000000.00000","fee":"600.00000","margin":"0.00000","ordertxid":"TDLH43-DVQXD-2KHVYY","ordertype":"limit","pair":"XBT/EUR","postxid":"OGTT3Y-C6I3P-XRI6HX","price":"100000.00000","time":"1560516023.070658","type":"buy","vol":"1000000000.00000000"}},{"TDLH43-DVQXD-2KHVYY":{"cost":"1000000.00000","fee":"1600.00000","margin":"0.00000","ordertxid":"TDLH43-DVQXD-2KHVYY","ordertype":"limit","pair":"XBT/EUR","postxid":"OGTT3Y-C6I3P-XRI6HX","price":"100000.00000","time":"1560520332.914657","type":"sell","vol":"1000000000.00000000"}},{"TDLH43-DVQXD-2KHVYY":{"cost":"1000000.00000","fee":"600.00000","margin":"0.00000","ordertxid":"TDLH43-DVQXD-2KHVYY","ordertype":"limit","pair":"XBT/EUR","postxid":"OGTT3Y-C6I3P-XRI6HX","price":"100000.00000","time":"1560520332.914664","type":"buy","vol":"1000000000.00000000"}}]
     */
    export type OwnTrades = Array<{
      /*· {*/

      [tradeid: string]: {
        /** order responsible for execution of trade */
        ordertxid?: string | null;
        /** Position trade id */
        postxid?: string | null;
        /** Asset pair */
        pair?: string | null;
        /** unix timestamp of trade */
        time?: string | null;
        /** type of order (buy/sell) */
        type?: string | null;
        /** order type */
        ordertype?: string | null;
        /** average price order was executed at (quote currency) */
        price?: string | null;
        /** total cost of order (quote currency) */
        cost?: string | null;
        /** total fee (quote currency) */
        fee?: string | null;
        /** volume (base currency) */
        vol?: string | null;
        /** initial margin (quote currency) */
        margin?: string | null;
        /** user reference ID */
        userref?: number | null;
      };

      /*· }*/
    }>;
    export module OwnTrades {
      export type Options = Exclude<FirstParam<Kraken["ws"]["ownTrades"]>, undefined>;
      export type Subscriber = ReturnType<Kraken["ws"]["ownTrades"]>;
    }

    /**
     * @example [{"OGTT3Y-C6I3P-XRI6HX":{"cost":"0.00000","descr":{"close":"","leverage":"0:1","order":"sell 10.00345345 XBT/EUR @ limit 34.50000 with 0:1 leverage","ordertype":"limit","pair":"XBT/EUR","price":"34.50000","price2":"0.00000","type":"sell"},"expiretm":"0.000000","fee":"0.00000","limitprice":"34.50000","misc":"","oflags":"fcib","opentm":"0.000000","price":"34.50000","refid":"OKIVMP-5GVZN-Z2D2UA","starttm":"0.000000","status":"open","stopprice":"0.000000","userref":0,"vol":"10.00345345","vol_exec":"0.00000000"}},{"OGTT3Y-C6I3P-XRI6HX":{"cost":"0.00000","descr":{"close":"","leverage":"0:1","order":"sell 0.00001000 XBT/EUR @ limit 9.00000 with 0:1 leverage","ordertype":"limit","pair":"XBT/EUR","price":"9.00000","price2":"0.00000","type":"sell"},"expiretm":"0.000000","fee":"0.00000","limitprice":"9.00000","misc":"","oflags":"fcib","opentm":"0.000000","price":"9.00000","refid":"OKIVMP-5GVZN-Z2D2UA","starttm":"0.000000","status":"open","stopprice":"0.000000","userref":0,"vol":"0.00001000","vol_exec":"0.00000000"}}]
     * @example [{"OGTT3Y-C6I3P-XRI6HX":{"status":"closed"}},{"OGTT3Y-C6I3P-XRI6HX":{"status":"closed"}}]
     */
    export type OpenOrders = Array<{
      /*· {*/

      [orderid: string]: {
        /** Referral order transaction id that created this order */
        refid?: string | null;
        /** user reference ID */
        userref?: number | null;
        /** status of order */
        status?: string | null;
        /** unix timestamp of when order was placed */
        opentm?: string | null;
        /** unix timestamp of order start time (if set) */
        starttm?: string | null;
        /** unix timestamp of order end time (if set) */
        expiretm?: string | null;
        /** order description info */
        descr?: {
          /** asset pair */
          pair?: string | null;
          /** Optional - position ID (if applicable) */
          position?: string | null;
          /** type of order (buy/sell) */
          type?: string | null;
          /** order type */
          ordertype?: string | null;
          /** primary price */
          price?: string | null;
          /** secondary price */
          price2?: string | null;
          /** amount of leverage */
          leverage?: string | null;
          /** order description */
          order?: string | null;
          /** conditional close order description (if conditional close set) */
          close?: string | null;
        } | null;
        /** volume of order (base currency unless viqc set in oflags) */
        vol?: string | null;
        /** total volume executed so far (base currency unless viqc set in oflags) */
        vol_exec?: string | null;
        /** total cost (quote currency unless unless viqc set in oflags) */
        cost?: string | null;
        /** total fee (quote currency) */
        fee?: string | null;
        /** average price (cumulative; quote currency unless viqc set in oflags) */
        avg_price?: string | null;
        /** stop price (quote currency, for trailing stops) */
        stopprice?: string | null;
        /** triggered limit price (quote currency, when limit based order type triggered) */
        limitprice?: string | null;
        /** comma delimited list of miscellaneous info: stopped=triggered by stop price, touched=triggered by touch price, liquidation=liquidation, partial=partial fill */
        misc?: string | null;
        /** Optional - comma delimited list of order flags. viqc = volume in quote currency (not currently available), fcib = prefer fee in base currency, fciq = prefer fee in quote currency, nompp = no market price protection, post = post only order (available when ordertype = limit) */
        oflags?: string | null;
        /** Optional - time in force. */
        timeinforce: string | null;
        /** Optional - cancel reason, present for all cancellation updates (status="canceled") and for some close updates (status="closed") */
        cancel_reason?: string | null;
        /** Optional - rate-limit counter, present if requested in subscription request. See Trading Rate Limits. */
        ratecount?: number | null;
      };

      /*· }*/
    }>;
    export module OpenOrders {
      export type Options = Exclude<FirstParam<Kraken["ws"]["openOrders"]>, undefined>;
      export type Subscriber = ReturnType<Kraken["ws"]["openOrders"]>;
    }

    /**
     * @example {"descr":"buy 0.01770000 XBTUSD @ limit 4000","event":"addOrderStatus","status":"ok","txid":"ONPNXH-KMKMU-F4MR5V"}
     * @example {"errorMessage":"EOrder:Order minimum not met","event":"addOrderStatus","status":"error"}
     */
    export type AddOrder = {
      /*· {*/

      event?: "addOrderStatus";
      /** Optional - client originated requestID sent as acknowledgment in the message response */
      reqid?: number | null;
      /** Status. "ok" or "error" */
      status?: string | null;
      /** order ID (if successful) */
      txid?: string | null;
      /** order description info (if successful) */
      descr?: string | null;
      /** error message (if unsuccessful) */
      errorMessage?: string | null;

      /*· }*/
    };
    export module AddOrder {
      export type Options = Exclude<FirstParam<Kraken["ws"]["addOrder"]>, undefined>;
    }

    /**
     * @example [{"event":"cancelOrderStatus","status":"ok"}]
     * @example [{"errorMessage":"EOrder:Unknown order","event":"cancelOrderStatus","status":"error"}]
     */
    export type CancelOrder = Array<{
      /*· {*/

      event?: "cancelOrderStatus";
      /** Optional - client originated requestID sent as acknowledgment in the message response */
      reqid?: number | null;
      /** Status. "ok" or "error" */
      status?: string | null;
      /** error message (if unsuccessful) */
      errorMessage?: string | null;

      /*· }*/
    }>;
    export module CancelOrder {
      export type Options = Exclude<FirstParam<Kraken["ws"]["cancelOrder"]>, undefined>;
    }

    /**
     * @example {"count":2,"event":"cancelAllStatus","status":"ok"}
     */
    export type CancelAll = {
      /*· {*/

      event?: "cancelAllStatus";
      /** Optional - client originated requestID sent as acknowledgment in the message response */
      reqid?: number | null;
      /** Number of orders cancelled. */
      count?: number | null;
      /** Status. "ok" or "error" */
      status?: string | null;
      /** error message (if unsuccessful) */
      errorMessage?: string | null;

      /*· }*/
    };
    export module CancelAll {
      export type Options = Exclude<FirstParam<Kraken["ws"]["cancelAll"]>, undefined>;
    }

    /**
     * @example {"currentTime":"2020-12-21T09:37:09Z","event":"cancelAllOrdersAfterStatus","reqid":1608543428050,"status":"ok","triggerTime":"2020-12-21T09:38:09Z"}
     * @example {"currentTime":"2020-12-21T09:37:09Z","event":"cancelAllOrdersAfterStatus","reqid":1608543428051,"status":"ok","triggerTime":"0"}
     */
    export type CancelAllOrdersAfter = {
      /*· {*/

      event?: "cancelAllOrdersAfterStatus";
      /** Optional - client originated requestID sent as acknowledgment in the message response */
      reqid?: number | null;
      /** Status. "ok" or "error" */
      status?: string | null;
      /** Timestamp (RFC3339) reflecting when the request has been handled (second precision, rounded up) */
      currentTime?: string | null;
      /** Timestamp (RFC3339) reflecting the time at which all open orders will be cancelled, unless the timer is extended or disabled (second precision, rounded up) */
      triggerTime?: string | null;
      /** error message (if unsuccessful) */
      errorMessage?: string | null;

      /*· }*/
    };
    export module CancelAllOrdersAfter {
      export type Options = Exclude<FirstParam<Kraken["ws"]["cancelAllOrdersAfter"]>, undefined>;
    }

    /*                                                       WebSocket Types }*/

    /*                                                  WebSocket Management {*/

    /**
     * Publication: Status sent on connection or system status changes.
     *
     * @example {"connectionID":8628615390848610000,"event":"systemStatus","status":"online","version":"1.0.0"}
     */
    export type SystemStatus = {
      event: "systemStatus";
      /** Optional - Connection ID (will appear only in initial connection status message) */
      connectionID?: number | null;
      /** online|maintenance|cancel_only|limit_only|post_only */
      status?: string | null;
      version?: string | null;
    };

    /**
     * Request. Subscribe to a topic on a single or multiple currency pairs
     * Request. Unsubscribe, can specify a channelID or multiple currency pairs.
     *
     * @example {"event":"subscribe","pair":["XBT/USD","XBT/EUR"],"subscription":{"name":"ticker"}}
     * @example {"event":"subscribe","pair":["XBT/EUR"],"subscription":{"interval":5,"name":"ohlc"}}
     * @example {"event":"subscribe","subscription":{"name":"ownTrades","token":"WW91ciBhdXRoZW50aWNhdGlvbiB0b2tlbiBnb2VzIGhlcmUu"}}
     * @example {"event":"unsubscribe","pair":["XBT/EUR","XBT/USD"],"subscription":{"name":"ticker"}}
     * @example {"channelID":10001,"event":"unsubscribe"}
     * @example {"event":"unsubscribe","subscription":{"name":"ownTrades","token":"WW91ciBhdXRoZW50aWNhdGlvbiB0b2tlbiBnb2VzIGhlcmUu"}}
     */
    export type SubscriptionRequest = {
      event: "subscribe" | "unsubscribe";
      /** Optional - client originated ID reflected in response message */
      reqid?: number;
      /** Optional - Array of currency pairs. Format of each pair is "A/B", where A and B are ISO 4217-A3 for standardized assets and popular unique symbol if not standardized.  */
      pair?: string[];
      subscription?: {
        /** Optional - depth associated with book subscription in number of levels each side, default 10. Valid Options are: 10, 25, 100, 500, 1000 */
        depth?: number;
        /** Optional - Time interval associated with ohlc subscription in minutes. Default 1. Valid Interval values: 1|5|15|30|60|240|1440|10080|21600 */
        interval?: number;
        /** book|ohlc|openOrders|ownTrades|spread|ticker|trade|*, * for all available channels depending on the connected environment */
        name: string;
        /** Optional - whether to send rate-limit counter in updates (supported only for openOrders subscriptions; default = false) */
        ratecounter?: boolean;
        /** Optional - whether to send historical feed data snapshot upon subscription (supported only for ownTrades subscriptions; default = true) */
        snapshot?: boolean;
        /** Optional - base64-encoded authentication token for private-data endpoints */
        token?: string;
      };
    };

    /**
     * Response. Subscription status response to subscribe, unsubscribe or exchange initiated unsubscribe.
     *
     * @example {"channelID":10001,"channelName":"ticker","event":"subscriptionStatus","pair":"XBT/EUR","status":"subscribed","subscription":{"name":"ticker"}}
     * @example {"channelID":10001,"channelName":"ohlc-5","event":"subscriptionStatus","pair":"XBT/EUR","reqid":42,"status":"unsubscribed","subscription":{"interval":5,"name":"ohlc"}}
     * @example {"channelName":"ownTrades","event":"subscriptionStatus","status":"subscribed","subscription":{"name":"ownTrades"}}
     * @example {"errorMessage":"Subscription depth not supported","event":"subscriptionStatus","pair":"XBT/USD","status":"error","subscription":{"depth":42,"name":"book"}}
     */
    export type SubscriptionStatus = {
      event: "subscriptionStatus";
      /** Optional - matching client originated request ID */
      reqid: number | null;
      /** Channel Name on successful subscription. For payloads 'ohlc' and 'book', respective interval or depth will be added as suffix.  */
      channelName?: string | null;
      /** Channel ID on successful subscription, applicable to public messages only - @deprecated, use channelName and pair */
      channelID?: number | null;
      /** Optional - Currency pair, applicable to public messages only */
      pair?: string | null;
      /** Status of subscription */
      status: string;
      subscription?:
        | (SubscriptionRequest["subscription"] & {
            /** Optional - max rate-limit budget. Compare to the ratecounter field in the openOrders updates to check whether you are approaching the rate limit. */
            maxratecount?: number | null;
          })
        | null;
      /** Error message */
      errorMessage?: string | null;
    };

    /** Connection management object for WebSockets. */
    export class Connection extends Emitter<{
      /** Publication: Server heartbeat sent if no subscription traffic within 1 second (approximately) */
      heartbeat: () => any;
      /** Publication: Status sent on connection or system status changes.  */
      systemStatus: (status: SystemStatus) => any;
      state: (state: Connection["state"]) => any;
      json: (json: any) => any;
      dict: (dict: NodeJS.Dict<any>) => any;
      array: (array: any[]) => any;
      error: (error: Error) => any;
      open: () => any;
      close: (code: number, reason?: string) => any;
      read: (data: WebSocket.Data) => any;
      write: (data: WebSocket.Data) => any;
    }> {
      /* private data {*/

      private readonly _gettimeout: () => number;
      private _state: Kraken.WS.Connection["state"] = "closed";
      private _socket: WebSocket | null = null;
      private _sendQueue: WebSocket.Data[] = [];

      /* private data }*/

      public get state(): "closed" | "opening" | "open" | "closing" {
        return this._state;
      }
      public readonly hostname: string;
      public get socket(): WebSocket | null {
        return this._socket;
      }

      constructor(hostname: string, gettimeout: () => number) {
        /*· {*/

        super();
        this.hostname = hostname;
        this._gettimeout = gettimeout;
        this._setState("closed");

        _hidePrivates(this);

        /*· }*/
      }

      /**
       * Request. Client can ping server to determine whether connection is alive, server responds with pong. This is an application level ping as opposed to default ping in websockets standard which is server initiated
       */
      public async ping(): Promise<void> {
        await this.request({ event: "ping" });
      }

      /**
       * Perform a manual server request.
       * Rejects on responses with `.errorMessage`.
       * Note:
       *   uses an internal reqid for a uniqueness guarantee; if a reqid
       *     is provided here then the internal one will be replaced by
       *     the provided one in the promised response.
       */
      public async request(request: { event: string; reqid?: number }): Promise<any> {
        /*· {*/

        return new Promise((resolve, reject) => {
          const reqid = _GENNONCE();
          let prevreqid = request.reqid;

          this.once(
            "dict",
            (o: { reqid: number; errorMessage?: string }) => {
              if (!o.errorMessage) {
                if (prevreqid) o.reqid = prevreqid;
                resolve(o);
              } else {
                reject(new WSAPIError(o as { errorMessage: string }));
              }
            },
            {
              protect: true,
              filter: (
                args: [NodeJS.Dict<any>]
              ): args is [{ reqid: number; errorMessage?: string }] => args[0].reqid === reqid,
            }
          );
          this.write(
            JSON.stringify({
              ...request,
              reqid,
            })
          );
        });

        /*· }*/
      }

      /**
       * Perform a manual server request that expects several responses.
       * Does NOT reject on responses with `.errorMessage`.
       * Note:
       *   uses an internal reqid for a uniqueness guarantee; if a reqid
       *     is provided here then the internal one will be replaced by
       *     the provided one in the promised response.
       */
      public async requestMulti(
        request: { event: string; reqid?: number },
        nResponses: number
      ): Promise<any[]> {
        /*· {*/

        return new Promise((resolve) => {
          const reqid = _GENNONCE();
          let prevreqid = request.reqid;

          const responses: any[] = [];

          const resolver = new _CountTrigger(nResponses, () => {
            this.off("dict", l);
            resolve(responses);
          });

          const l = (o: { reqid: number }) => {
            if (prevreqid) o.reqid = prevreqid;
            responses.push(o);
            resolver.fireWhenReady();
          };
          this.on("dict", l, {
            protect: true,
            filter: (args: [NodeJS.Dict<any>]): args is [{ reqid: number }] =>
              args[0].reqid === reqid,
          });
          this.write(
            JSON.stringify({
              ...request,
              reqid,
            })
          );
        });

        /*· }*/
      }

      /**
       * Open the WebSocket connection (usually not necessary).
       * The connection is automatically opened by .ping(), .request(), and .write()
       *
       * If a close event is triggered (either remotely or locally),
       *   .open() must be called manually to reopen the socket.
       *
       * Rejects if already open or opening.
       */
      public open(): Promise<void> {
        /*· {*/

        return new Promise((resolve, reject) => {
          if (this._state === "open" || this._state === "opening") {
            reject();
          } else {
            this._setState("opening");
            this._socket = new WebSocket("wss://" + this.hostname + ":443", {
              timeout: this._gettimeout(),
            });
            this._socket.addListener("message", this._onread.bind(this));
            this._socket.addListener("error", this._onerror.bind(this));
            this._socket.addListener("close", this._onclose.bind(this));
            this._socket.addListener("open", this._onopen.bind(this));
            const onceOpen = () => {
              if (!this._socket) reject(new InternalError("Socket should have been available"));
              else {
                this._socket.removeListener("open", onceOpen);
                resolve();
              }
            };
            this._socket.addListener("open", onceOpen);
          }
        });

        /*· }*/
      }

      /**
       * Close the WebSocket connection, or force it to close if it has not yet opened or closed.
       * Does not remove listeners on the Connection object.
       *
       * Rejects if already closed or closing.
       */
      public close(code?: number, reason?: string): Promise<void> {
        /*· {*/

        return new Promise((resolve, reject) => {
          if (this._state === "closed" || this._state === "closing") reject();
          else {
            this._setState("closing");
            if (this._socket) {
              const onceClosed = () => {
                if (!this._socket) {
                  resolve();
                } else {
                  reject(new InternalError("Socket should not have been available"));
                }
              };
              this._socket.addListener("close", onceClosed);
              this._socket.close(code, reason);
            } else {
              reject(new InternalError("Socket should have been available"));
            }
          }
        });

        /*· }*/
      }

      /**
       * force closes the socket:
       *   removes all internal socket listeners.
       *   sets the socket to null.
       *   sets state to 'closed'
       */
      public terminate(): void {
        if (this._socket) {
          this._socket.removeAllListeners();
          this._socket.terminate();
          this._socket = null;
        }
        this._setState("closed");
      }

      /** Write data to the WebSocket (send data to the server). */
      public write(data: WebSocket.Data): this {
        /*· {*/

        if (this._socket && this._state === "open") {
          this._socket.send(data);
          this.emit("write", data);
        } else {
          this.open();
          this._sendQueue.push(data);
        }
        return this;

        /*· }*/
      }

      /* private methods {*/

      private _setState(state: Connection["state"]) {
        if (this._state !== state) {
          this._state = state;
          this.emit("state", state);
        }
      }
      private _parseRead(data: string) {
        try {
          const parsed = JSON.parse(data);
          this.emit("json", parsed);
          if (parsed instanceof Array) {
            this.emit("array", parsed);
          } else if (parsed instanceof Object) {
            this.emit("dict", parsed);
            if (parsed.event === "heartbeat") {
              this.emit("heartbeat");
            } else if (parsed.event === "systemStatus") {
              this.emit("systemStatus", parsed as SystemStatus);
            }
          }
        } catch (_) {}
      }
      private _onread(data: WebSocket.Data) {
        this.emit("read", data);
        if (typeof data === "string") {
          this._parseRead(data);
        } else if (data instanceof Buffer) {
          this._parseRead(data.toString("utf8"));
        } else {
          this.emit("error", new InternalError("Expected either a string or buffer WS response."));
        }
      }
      private _onerror(err: Error) {
        this.emit("error", err);
      }
      private _onclose(code: number, message: string) {
        this.emit("close", code, message);
        this.terminate();
      }
      private _onopen() {
        this.emit("open");
        if (this._state !== "open") {
          this._setState("open");
          if (this._socket) {
            for (const data of this._sendQueue) {
              this._socket.send(data);
              this.emit("write", data);
            }
          } else {
            this.terminate();
          }
        }
      }

      /* private methods }*/
    }

    export class Subscriber<
      PayloadEvents extends {
        payload?: never;
        status?: never;
        error?: never;
      } & {
        [event: string]: (...args: any[]) => any;
      } = {},
      Options extends Omit<SubscriptionRequest["subscription"], "name"> = {}
    > extends Emitter<
      {
        payload: (payload: any[], status: SubscriptionStatus) => any;
        status: (status: SubscriptionStatus) => any;
        error: (error: Error, status?: SubscriptionStatus) => any;
      },
      PayloadEvents
    > {
      private _con: Connection;
      private _reqid: number = _GENNONCE();

      public readonly name: string;
      public readonly options: Options;
      public readonly subscriptions: Set<Subscription> = new Set();

      constructor(
        con: Connection,
        name: string,
        payloadDistributor: (
          self: Subscriber<PayloadEvents, Options>,
          payload: any[],
          status: SubscriptionStatus
        ) => void,
        options: Options
      ) {
        /*· {*/

        super();

        this._con = con;
        this.name = name;
        this.options = options;

        this.on("payload", (payload, status) => payloadDistributor(this, payload, status), {
          protect: true,
        });

        _hidePrivates(this);

        /*· }*/
      }

      /**
       * Subscribe to some pairs (if applicable).
       * Requires at least one pair if public (i.e. token not in options).
       *
       * DOES NOT REJECT.
       * If there is an issue with the subscription an error event will be emitted.
       */
      public async subscribe(
        pair: Options extends { token: string } ? void : string,
        ...pairs: Options extends { token: string } ? void[] : string[]
      ): Promise<this> {
        /*· {*/

        return new Promise((resolve) => {
          const request: SubscriptionRequest = {
            event: "subscribe",
            reqid: this._reqid,
            subscription: { ...this.options, name: this.name },
          };

          if (pair) {
            request.pair = [pair, ...pairs];
            const resolver = new _CountTrigger(request.pair.length, () => resolve(this));
            request.pair.forEach((p) => this._mksub(p).then(() => resolver.fireWhenReady()));
          } else {
            this._mksub().then(() => resolve(this));
          }

          this._con.write(JSON.stringify(request));
        });

        /*· }*/
      }

      /**
       * Unsubscribe from some pairs (if applicable).
       * Requires at least one pair if public (i.e. token not in options).
       *
       * DOES NOT REJECT.
       * If there is an issue with the subscription an error event will be emitted.
       */
      public async unsubscribe(
        pair: Options extends { token: string } ? void : string,
        ...pairs: Options extends { token: string } ? void[] : string[]
      ): Promise<this> {
        /*· {*/

        return new Promise((resolve) => {
          const request: SubscriptionRequest = {
            event: "unsubscribe",
            reqid: this._reqid,
            subscription: { ...this.options, name: this.name },
          };

          if (pair) {
            request.pair = [pair, ...pairs];
            const resolver = new _CountTrigger(request.pair.length, () => resolve(this));
            request.pair.forEach((p) => this._rmsub(p).then(() => resolver.fireWhenReady()));
          } else {
            this._rmsub().then(() => resolve(this));
          }

          this._con.write(JSON.stringify(request));
        });

        /*· }*/
      }

      /* Private Methods {*/

      private _mksub(pair?: string): Promise<void> {
        return new Promise((resolve) => {
          const protect = { protect: true };
          const sub = new Subscription(this._con, this._reqid, pair);
          const onstatus = (status: SubscriptionStatus) => this.emit("status", status);
          const onerror = (error: Error) => this.emit("error", error, sub.status);
          const onpayload = (payload: any[]) => this.emit("payload", payload, sub.status);
          sub
            .once(
              "created",
              () => {
                this.subscriptions.add(sub);
                resolve();
              },
              protect
            )
            .once(
              "destroyed",
              () => {
                this.subscriptions.delete(sub);
                sub.off("status", onstatus).off("error", onerror).off("payload", onpayload);
              },
              protect
            )
            .on("status", onstatus, protect)
            .on("error", onerror, protect)
            .on("payload", onpayload, protect);
        });
      }

      private _rmsub(pair?: string): Promise<void> {
        return new Promise((resolve) => {
          for (const sub of this.subscriptions)
            if (sub.status.pair === pair) sub.once("destroyed", () => resolve(), { protect: true });
        });
      }

      /* Private Methods }*/
    }

    /** Manages connection listeners for a given subscription. */
    export class Subscription extends Emitter<{
      created: () => any;
      destroyed: () => any;
      status: (status: SubscriptionStatus) => any;
      error: (error: Error) => any;
      payload: (payload: any[]) => any;
    }> {
      private _con: Connection;

      public status: SubscriptionStatus;

      constructor(con: Connection, reqid: number, pair?: string) {
        super();

        this._con = con;

        this.status = {
          event: "subscriptionStatus",
          reqid,
          pair: pair,
          status: "init",
        };

        this._con.once("dict", this._init, {
          protect: true,
          filter: this._isstatus,
        });

        _hidePrivates(this);
      }

      private _isstatus = (args: [NodeJS.Dict<any>]): args is [SubscriptionStatus] => {
        return (
          args[0].event === "subscriptionStatus" &&
          args[0].reqid === this.status.reqid &&
          args[0].pair === this.status.pair
        );
      };

      private _onstatus = (status: SubscriptionStatus) => {
        this.status = status;
        this.emit("status", this.status);

        if (this.status.errorMessage)
          this.emit("error", new WSAPIError(this.status as { errorMessage: string }));

        if (this.status.status === "unsubscribed") this._destroy();
      };

      private _onpayload = (payload: any[]) => {
        this.emit("payload", payload);
      };

      private _init = (status: SubscriptionStatus) => {
        this.status = status;
        this.emit("status", status);

        if (this.status.errorMessage) {
          this.emit("error", new WSAPIError(this.status as { errorMessage: string }));
        } else if (this.status.status === "subscribed") {
          this.emit("created");

          this._con.on("dict", this._onstatus, {
            protect: true,
            filter: this._isstatus,
          });

          this._con.on("array", this._onpayload, {
            protect: true,
            filter: (args: [any[]]): args is [any[]] =>
              args[0][args[0].length - 2] === this.status.channelName &&
              (this.status.pair ? args[0][args[0].length - 1] === this.status.pair : true),
          });
        } else {
          this.emit(
            "error",
            new UnknownError('Expected either a "subscribed" status or an errorMessage')
          );
        }
      };

      private _destroy() {
        this._con.off("dict", this._onstatus as (dict: NodeJS.Dict<any>) => void);
        this._con.off("array", this._onpayload as (arr: any[]) => any);
        this.emit("destroyed");
      }
    }

    /*                                                  WebSocket Management }*/
  }
}

//                                                                    detail {*/

/*                                                               REST Detail {*/

/** Stores key, secret, and otp generator. Creates necessary data for private calls. */
export class _Authenticator {
  public signedHeaders: (
    path: string,
    postdata: string,
    nonce: number
  ) => {
    "User-Agent": typeof _USER_AGENT;
    "API-Key": string;
    "API-Sign": string;
  };

  public signedQuery: (input: Readonly<NodeJS.Dict<any>>) => NodeJS.Dict<any> & { otp?: string };

  constructor(key: string, secret: string, genotp?: () => string) {
    this.signedHeaders = (path, postdata, nonce) => {
      return {
        "User-Agent": _USER_AGENT,
        "API-Key": key,
        "API-Sign": crypto
          .createHmac("sha512", Buffer.from(secret, "base64"))
          .update(path)
          .update(
            crypto
              .createHash("sha256")
              .update(nonce + postdata)
              .digest()
          )
          .digest("base64"),
      };
    };
    if (genotp) {
      this.signedQuery = (input) => {
        const otp = genotp();
        return {
          ...input,
          otp,
        };
      };
    } else {
      this.signedQuery = (input) => {
        return input;
      };
    }
  }
}

export class _UTF8Receiver {
  private _finalized = false;
  private _chunked = "";
  private _onjson: (json: any) => any;
  private _onerror: (error: Error) => any;

  constructor(onjson: (json: any) => any, onerror: (error: Error) => any) {
    this._onjson = (json: any) => {
      try {
        onjson(json);
      } catch (_) {}
      this._finalized = true;
    };
    this._onerror = (error: Error) => {
      try {
        onerror(error);
      } catch (_) {}
      this._finalized = true;
    };

    _hidePrivates(this);
  }

  // collect a chunk and check for invalid status code
  public nextChunk(
    chunk: any,
    statusCode: number | undefined,
    statusMessage: string | undefined
  ): void {
    if (this._finalized) return;
    if (!this._verifyStatus(statusCode, statusMessage)) return;
    this._chunked += chunk;
  }

  public finalize(statusCode: number | undefined, statusMessage: string | undefined): void {
    if (this._finalized) return;
    if (!this._verifyStatus(statusCode, statusMessage)) return;
    this._finalized = true;
    // status is OK, try parsing
    try {
      const body = JSON.parse(this._chunked);
      if (body.error && body.error.length > 0) {
        this._onerror(new Kraken.RESTAPIError(body));
      } else {
        this._onjson(body);
      }
    } catch (err) {
      if (err instanceof Error) this._onerror(new Kraken.JSONParseError(this._chunked, err));
      else
        this._onerror(
          new Kraken.JSONParseError(
            this._chunked,
            new Kraken.UnknownError("received an unknown error", err)
          )
        );
    }
  }

  private _verifyStatus(
    statusCode: number | undefined,
    statusMessage: string | undefined
  ): boolean {
    if (statusCode === undefined || statusCode < 200 || statusCode >= 300) {
      this._finalized = true;
      this._onerror(new Kraken.HTTPRequestError(statusCode, statusMessage));
      return false;
    }
    return true;
  }
}

export class _BinaryReceiver {
  private _finalized = false;
  private _chunks: Buffer[] = [];
  private _onbuffer: (buffer: Buffer) => any;
  private _onerror: (error: Error) => any;

  constructor(onbuffer: (buffer: Buffer) => any, onerror: (error: Error) => any) {
    this._onbuffer = (buffer: Buffer) => {
      try {
        onbuffer(buffer);
      } catch (_) {}
      this._finalized = true;
    };
    this._onerror = (error: Error) => {
      try {
        onerror(error);
      } catch (_) {}
      this._finalized = true;
    };

    _hidePrivates(this);
  }

  public nextChunk(
    chunk: any,
    statusCode?: number | undefined,
    statusMessage?: string | undefined
  ): void {
    if (this._finalized) return;
    if (!this._verifyStatus(statusCode, statusMessage)) return;
    try {
      this._chunks.push(Buffer.from(chunk, "binary"));
    } catch (e) {
      if (e instanceof Error) this._onerror(new Kraken.BufferParseError(chunk, e));
      else
        this._onerror(
          new Kraken.BufferParseError(
            chunk,
            new Kraken.UnknownError("received an unknown error", e)
          )
        );
    }
  }

  public finalize(statusCode: number | undefined, statusMessage: string | undefined): void {
    if (this._finalized) return;
    if (!this._verifyStatus(statusCode, statusMessage)) return;
    this._finalized = true;
    if (this._chunks.length <= 0) {
      this._onerror(new Kraken.InternalError("Connection closed before chunks were received"));
      return;
    }
    try {
      this._onbuffer(Buffer.concat(this._chunks));
    } catch (e) {
      if (e instanceof Error) this._onerror(new Kraken.UnknownError(e.message));
      else this._onerror(new Kraken.UnknownError("received an unknown error", e));
    }
  }

  private _verifyStatus(statusCode?: number, statusMessage?: string): boolean {
    if (statusCode === undefined || statusCode < 200 || statusCode >= 300) {
      this._finalized = true;
      this._onerror(new Kraken.HTTPRequestError(statusCode, statusMessage));
      return false;
    }
    return true;
  }
}

/**
 * Prepare a REST request. Generates http request options and postdata.
 *
 * @param   endpoint: Kraken REST endpoint.
 * @param   options:  Options to be stringified for query.
 * @param   gennonce: Generate a nonce for POST requests.
 * @param   auth:     Authenticator; required for private calls.
 * @throws  if a private call is requested without an authenticator.
 * @returns dict with request options and postdata.
 */
export function _prepareRequest(
  endpoint: string,
  options: NodeJS.Dict<any> | null,
  type: "public" | "private",
  gennonce: () => number,
  auth: _Authenticator | null
): { requestOptions: http.RequestOptions; postdata: string | null } {
  const hostname = _REST_HOSTNAME;
  const nonce = gennonce();
  if (type === "private") {
    if (auth === null) {
      throw new Kraken.SettingsError("Cannot make a private request without key and secret.");
    }
    const method = "POST";
    const path = `/${_REST_VERSION}/private/${endpoint}`;
    const postdata = options
      ? new URLSearchParams(auth.signedQuery({ ...options, nonce })).toString()
      : new URLSearchParams(auth.signedQuery({ nonce })).toString();
    const headers = auth.signedHeaders(path, postdata, nonce);
    return {
      requestOptions: {
        hostname,
        path,
        method,
        headers,
      },
      postdata,
    };
  } else {
    const path = `/${_REST_VERSION}/public/${endpoint}`;
    const headers = {
      "User-Agent": _USER_AGENT,
    };
    if (options) {
      const method = "POST";
      const postdata = new URLSearchParams({ ...options, nonce } as NodeJS.Dict<any>).toString();
      return {
        requestOptions: {
          hostname,
          path,
          method,
          headers,
        },
        postdata,
      };
    } else {
      const method = "GET";
      const postdata = null;
      return {
        requestOptions: {
          hostname,
          path,
          method,
          headers,
        },
        postdata,
      };
    }
  }
}

/**
 * Send a raw request using prepared, authenticated data, if applicable.
 * @param   requestOptions - prepared request options with signed headers, if applicable.
 * @param   postdata       - postdata, if a POST request.
 * @param   encoding       - type of response encoding.
 * @param   timeout        - timeout in ms.
 * @returns a promise that resolves to the raw, JSON-parsed response or rejects with a request error.
 */
export function _sendRequest(
  requestOptions: http.RequestOptions,
  postdata: string | null,
  encoding: "utf8" | "binary",
  timeout: number
) {
  return new Promise((resolve, reject) => {
    let didRespond = false;
    const r = https
      .request(requestOptions, (res) => {
        didRespond = true;
        try {
          const handler = (() => {
            if (encoding === "utf8") {
              return new _UTF8Receiver(resolve, reject);
            } else if (encoding === "binary") {
              return new _BinaryReceiver(resolve, reject);
            } else {
              throw new Kraken.ArgumentError("Invalid Encoding: " + encoding);
            }
          })();
          res.setEncoding(encoding);
          res.on("data", (chunk) => handler.nextChunk(chunk, res.statusCode, res.statusMessage));
          res.on("end", () => {
            handler.finalize(res.statusCode, res.statusMessage);
            res.removeAllListeners();
          });
        } catch (e) {
          reject(e);
        }
      })
      .on("error", (e) => {
        r.destroy();
        reject(e);
      })
      .setTimeout(timeout, () => {
        if (!didRespond) {
          r.destroy();
          reject(new Kraken.TimeoutError("REST request timed out."));
        }
      });
    if (postdata) r.write(postdata);
    r.end();
  });
}

export async function _request(
  endpoint: string,
  options: NodeJS.Dict<any> | null,
  type: "public" | "private",
  encoding: "utf8" | "binary",
  timeout: number,
  gennonce: () => number,
  auth: _Authenticator | null
): Promise<any> {
  // prepare the request. if private, ensure that the key/secret were provided
  const { requestOptions, postdata } = _prepareRequest(endpoint, options, type, gennonce, auth);

  if (encoding === "utf8") {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const data = await _sendRequest(requestOptions, postdata, encoding, timeout);
        type T = { error: string[]; result: any };
        if ((<T>data).error.length) reject(new Kraken.RESTAPIError(<T>data));
        resolve((<T>data).result as any);
      } catch (e) {
        reject(e);
      }
    });
  } else if (encoding === "binary") {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await _sendRequest(requestOptions, postdata, encoding, timeout);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  } else {
    throw new Kraken.ArgumentError('encoding must be "utf8" or "binary"');
  }
}

/*                                                               REST Detail }*/

//                                                            General Detail {*/

/*                                                                    Legacy {*/

/** @deprecated */
export module _Legacy {
  /** @deprecated */
  export interface Settings {
    /** @deprecated */
    pubMethods?: any;
    /** @deprecated */
    privMethods?: any;
    /** @deprecated */
    parse?: any;
    /** @deprecated */
    dataFormatter?: any;
  }
  /** @deprecated */
  export module Settings {
    /** @deprecated */
    export function defaults(): Required<Settings> {
      return {
        /** @deprecated */
        pubMethods: [
          "Time",
          "SystemStatus",
          "Assets",
          "AssetPairs",
          "Ticker",
          "OHLC",
          "Depth",
          "Trades",
          "Spread",
        ],
        /** @deprecated */
        privMethods: [
          "GetWebSocketsToken",
          "Balance",
          "TradeBalance",
          "OpenOrders",
          "ClosedOrders",
          "QueryOrders",
          "TradesHistory",
          "QueryTrades",
          "OpenPositions",
          "Ledgers",
          "QueryLedgers",
          "TradeVolume",
          "AddExport",
          "ExportStatus",
          "RetrieveExport",
          "RemoveExport",
          "AddOrder",
          "CancelOrder",
          "CancelAll",
          "CancelAllOrdersAfter",
          "DepositMethods",
          "DepositAddresses",
          "DepositStatus",
          "WithdrawInfo",
          "Withdraw",
          "WithdrawStatus",
          "WithdrawCancel",
          "WalletTransfer",
          "Stake",
          "Unstake",
          "Staking/Assets",
          "Staking/Pending",
          "Staking/Transactions",
        ],
        /** @deprecated */
        parse: {
          /** @deprecated */
          numbers: true,
          /** @deprecated */
          dates: true,
        },
        /** @deprecated */
        dataFormatter: null,
      };
    }
  }
  /** @deprecated */
  export function parseNested(o: any, parse: any) {
    function rangedDate(data: any, back: any = 0.5, fwd: any = 0.5, exclude: any = {}) {
      const inRange = (t: any, l: any, u: any) => t > l && t < u;
      const yrDist = (target: any) => (target - Date.now()) / +"31536e6";
      const bound = (target: any, back: any, fwd: any) =>
        inRange(yrDist(target), -back, fwd) && target;
      const check = (target: any, back: any, fwd: any, exclude: any) =>
        isFinite(target) &&
        ((!(exclude.ms === true) && bound(target, back, fwd)) ||
          (!(exclude.s === true) && bound(target * 1000, back, fwd)) ||
          (!(exclude.us === true) && bound(target / 1000, back, fwd)));
      if (data instanceof Date) return data.valueOf();
      if (typeof data === "number") return check(data, back, fwd, exclude);
      return check(Date.parse(data), back, fwd, exclude) || check(+data, back, fwd, exclude);
    }

    const parseValue = (() => {
      if (parse.numbers && parse.dates) {
        return function parseValue(parent: any, key: any) {
          const testNum = +parent[key];
          if (!isNaN(testNum)) {
            parent[key] = testNum;
          }
          const testDate = rangedDate(parent[key]);
          if (testDate !== false) {
            parent[key] = testDate;
          }
        };
      } else if (parse.numbers && !parse.dates) {
        return function parseValue(parent: any, key: any) {
          const testNum = +parent[key];
          if (!isNaN(testNum)) {
            parent[key] = testNum;
          }
        };
      } else if (!parse.numbers && parse.dates) {
        return function parseValue(parent: any, key: any) {
          const testDate = rangedDate(parent[key]);
          if (testDate !== false) {
            parent[key] = testDate;
          }
        };
      } else {
        return function parse(_: any, __: any) {};
      }
    })();

    function recurse(parent: any, key: any) {
      if (parent[key] instanceof Object) {
        for (const k of Object.keys(parent[key])) recurse(parent[key], k);
      } else {
        parseValue(parent, key);
      }
    }

    if (o instanceof Object) {
      for (const k of Object.keys(o)) recurse(o, k);
    }

    return o;
  }
}

/*                                                                    Legacy }*/

/** Performs an action after `count` calls of this.fireWhenReady() */
export class _CountTrigger {
  private _count: number;
  private _action: () => void;

  constructor(count: number, action: () => void) {
    if (count <= 0) throw new Kraken.ArgumentError("Invalid count, must be > 0");
    this._count = count;
    this._action = action;

    _hidePrivates(this);
  }

  public fireWhenReady() {
    if (--this._count === 0) this._action();
    if (this._count < 0) throw new Kraken.ArgumentError("Too many calls to fireWhenReady");
  }
}

/** Makes all underscore-prefixed properties non-enumerable. */
export function _hidePrivates(o: object): void {
  for (const [prop, descr] of Object.entries(Object.getOwnPropertyDescriptors(o))) {
    if (prop[0] === "_") Object.defineProperty(o, prop, { ...descr, enumerable: false });
  }
}

/*                                                            General Detail }*/

// vim: fdm=marker:fmr=\ {*/,\ }*/

//                                                                    detail }*/
