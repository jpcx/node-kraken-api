/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import * as http from "http";
import { Emitter } from "ts-ev";
import WebSocket from "ws";
export declare const _USER_AGENT = "node-kraken-api/2.2.2";
export declare const _REST_HOSTNAME = "api.kraken.com";
export declare const _WS_PUB_HOSTNAME = "ws.kraken.com";
export declare const _WS_PRIV_HOSTNAME = "ws-auth.kraken.com";
export declare const _REST_VERSION = "0";
export declare const _GENNONCE: () => number;
export declare class Kraken {
    private _gennonce;
    private _auth;
    private _legacy;
    timeout: number;
    constructor({ key, secret, genotp, gennonce, timeout, pubMethods, privMethods, parse, dataFormatter, }?: Readonly<{
        key?: string;
        secret?: string;
        genotp?: () => string;
        gennonce?: () => number;
        timeout?: number;
    } & _Legacy.Settings>);
    request(endpoint: string, options?: NodeJS.Dict<any> | null, type?: "public" | "private", encoding?: "utf8" | "binary"): Promise<any>;
    call(method: any, options?: any, cb?: (err: any, data: any) => any): any;
    time(): Promise<Kraken.Time>;
    systemStatus(): Promise<Kraken.SystemStatus>;
    assets(options?: {
        asset?: string;
        aclass?: string;
    }): Promise<Kraken.Assets>;
    assetPairs(options?: {
        pair?: string;
        info?: string;
    }): Promise<Kraken.AssetPairs>;
    ticker(options: {
        pair: string;
    }): Promise<Kraken.Ticker>;
    ohlc(options: {
        pair: string;
        interval?: number;
        since?: number;
    }): Promise<Kraken.OHLC>;
    depth(options: {
        pair: string;
        count?: number;
    }): Promise<Kraken.Depth>;
    trades(options: {
        pair: string;
        since?: string;
    }): Promise<Kraken.Trades>;
    spread(options: {
        pair: string;
        since?: number;
    }): Promise<Kraken.Spread>;
    getWebSocketsToken(): Promise<Kraken.GetWebSocketsToken>;
    balance(): Promise<Kraken.Balance>;
    tradeBalance(options?: {
        asset?: string;
    }): Promise<Kraken.TradeBalance>;
    openOrders(options?: {
        trades?: boolean;
        userref?: number;
    }): Promise<Kraken.OpenOrders>;
    closedOrders(options?: {
        trades?: boolean;
        userref?: number;
        start?: number;
        end?: number;
        ofs?: number;
        closetime?: string;
    }): Promise<Kraken.ClosedOrders>;
    queryOrders(options: {
        trades?: boolean;
        userref?: number;
        txid: string;
    }): Promise<Kraken.QueryOrders>;
    tradesHistory(options?: {
        type?: string;
        trades?: boolean;
        start?: number;
        end?: number;
        ofs?: number;
    }): Promise<Kraken.TradesHistory>;
    queryTrades(options?: {
        txid?: string;
        trades?: boolean;
    }): Promise<Kraken.QueryTrades>;
    openPositions(options?: {
        txid?: string;
        docalcs?: boolean;
        consolidation?: string;
    }): Promise<Kraken.OpenPositions>;
    ledgers(options?: {
        asset?: string;
        aclass?: string;
        type?: string;
        start?: number;
        end?: number;
        ofs?: number;
    }): Promise<Kraken.Ledgers>;
    queryLedgers(options?: {
        id?: string;
        trades?: boolean;
    }): Promise<Kraken.QueryLedgers>;
    tradeVolume(options: {
        pair: string;
        "fee-info"?: boolean;
    }): Promise<Kraken.TradeVolume>;
    addExport(options: {
        report: string;
        format?: string;
        description: string;
        fields?: string;
        starttm?: number;
        endtm?: number;
    }): Promise<Kraken.AddExport>;
    exportStatus(options: {
        report: string;
    }): Promise<Kraken.ExportStatus>;
    retrieveExport(options: {
        id: string;
    }): Promise<Kraken.RetrieveExport>;
    removeExport(options: {
        id: string;
        type: string;
    }): Promise<Kraken.RemoveExport>;
    addOrder(options: {
        userref?: number;
        ordertype: string;
        type: string;
        volume?: string;
        pair: string;
        price?: string;
        price2?: string;
        leverage?: string;
        oflags?: string;
        timeinforce?: string;
        starttm?: string;
        expiretm?: string;
        "close[ordertype]"?: string;
        "close[price]"?: string;
        "close[price2]"?: string;
        validate?: boolean;
    }): Promise<Kraken.AddOrder>;
    cancelOrder(options: {
        txid: string | number;
    }): Promise<Kraken.CancelOrder>;
    cancelAll(): Promise<Kraken.CancelAll>;
    cancelAllOrdersAfter(options: {
        timeout: number;
    }): Promise<Kraken.CancelAllOrdersAfter>;
    depositMethods(options: {
        asset: string;
    }): Promise<Kraken.DepositMethods>;
    depositAddresses(options: {
        asset: string;
        method: string;
        new?: boolean;
    }): Promise<Kraken.DepositAddresses>;
    depositStatus(options: {
        asset: string;
        method?: string;
    }): Promise<Kraken.DepositStatus>;
    withdrawInfo(options: {
        asset: string;
        key: string;
        amount: string;
    }): Promise<Kraken.WithdrawInfo>;
    withdraw(options: {
        asset: string;
        key: string;
        amount: string;
    }): Promise<Kraken.Withdraw>;
    withdrawStatus(options: {
        asset: string;
        method?: string;
    }): Promise<Kraken.WithdrawStatus>;
    withdrawCancel(options: {
        asset: string;
        refid: string;
    }): Promise<Kraken.WithdrawCancel>;
    walletTransfer(options: {
        asset: string;
        from: string;
        to: string;
        amount: string;
    }): Promise<Kraken.WalletTransfer>;
    stake(options: {
        asset: string;
        amount: string;
        method: string;
    }): Promise<Kraken.Stake>;
    unstake(options: {
        asset: string;
        amount: string;
    }): Promise<Kraken.Unstake>;
    stakingAssets(): Promise<Kraken.StakingAssets>;
    stakingPending(): Promise<Kraken.StakingPending>;
    stakingTransactions(): Promise<Kraken.StakingTransactions>;
    readonly ws: {
        readonly pub: Kraken.WS.Connection;
        readonly priv: Kraken.WS.Connection;
        ticker(): Kraken.WS.Subscriber<{
            update: (ticker: Kraken.WS.Ticker, pair: string) => any;
        }, {}>;
        ohlc(options?: {
            interval?: number;
        }): Kraken.WS.Subscriber<{
            update: (ohlc: Kraken.WS.OHLC, pair: string) => any;
        }, {
            interval?: number | undefined;
        }>;
        trade(): Kraken.WS.Subscriber<{
            update: (trade: Kraken.WS.Trade, pair: string) => any;
        }, {}>;
        spread(): Kraken.WS.Subscriber<{
            update: (spread: Kraken.WS.Spread, pair: string) => any;
        }, {}>;
        book(options?: {
            depth?: number;
        }): Kraken.WS.Subscriber<{
            snapshot: (snapshot: Kraken.WS.Book.Snapshot, pair: string) => any;
            ask: (ask: Kraken.WS.Book.Ask, pair: string) => any;
            bid: (bid: Kraken.WS.Book.Bid, pair: string) => any;
            mirror: (mirror: Kraken.WS.Book.Snapshot, pair: string) => any;
        }, {
            depth?: number | undefined;
        }>;
        ownTrades(options: {
            token: string;
            snapshot?: boolean;
        }): Kraken.WS.Subscriber<{
            update: (ownTrades: Kraken.WS.OwnTrades, sequence?: number) => any;
        }, {
            token: string;
            snapshot?: boolean | undefined;
        }>;
        openOrders(options: {
            token: string;
            ratecounter?: boolean;
        }): Kraken.WS.Subscriber<{
            update: (openOrders: Kraken.WS.OpenOrders, sequence?: number) => any;
        }, {
            token: string;
            ratecounter?: boolean | undefined;
        }>;
        addOrder(options: {
            token: string;
            reqid?: number;
            ordertype: string;
            type: string;
            pair: string;
            price?: string;
            price2?: string;
            volume: string;
            leverage?: string;
            oflags?: string;
            starttm?: string;
            expiretm?: string;
            deadline?: string;
            userref?: string;
            validate?: string;
            "close[ordertype]"?: string;
            "close[price]"?: string;
            "close[price2]"?: string;
            trading_agreement?: string;
        }): Promise<Kraken.WS.AddOrder>;
        cancelOrder(options: {
            token: string;
            reqid?: number;
            txid: string[];
        }): Promise<Kraken.WS.CancelOrder>;
        cancelAll(options: {
            token: string;
            reqid?: number;
        }): Promise<Kraken.WS.CancelAll>;
        cancelAllOrdersAfter(options: {
            token: string;
            reqid?: number;
            timeout: number;
        }): Promise<Kraken.WS.CancelAllOrdersAfter>;
    };
}
export declare module Kraken {
    class InternalError extends Error {
        info?: unknown;
        constructor(message: string, info?: unknown);
    }
    class UnknownError extends Error {
        info?: unknown;
        constructor(message: string, info?: unknown);
    }
    class ArgumentError extends Error {
        constructor(message: string);
    }
    class UsageError extends Error {
        constructor(message: string);
    }
    class SettingsError extends ArgumentError {
        constructor(description: string);
    }
    class JSONParseError extends Error {
        source: string;
        constructor(source: string, parseError: Error);
    }
    class BufferParseError extends Error {
        source: any;
        constructor(source: any, parseError: Error);
    }
    class HTTPRequestError extends Error {
        statusCode: number | undefined;
        statusMessage: string | undefined;
        constructor(statusCode: number | undefined, statusMessage: string | undefined);
    }
    class RESTAPIError extends Error {
        body: {
            result?: any;
            error: string[];
        };
        constructor(body: RESTAPIError["body"]);
    }
    class TimeoutError extends Error {
        constructor(message: string);
    }
    class WSAPIError extends Error {
        eventMessage: NodeJS.Dict<any> & {
            errorMessage: string;
        };
        constructor(eventMessage: NodeJS.Dict<any> & {
            errorMessage: string;
        });
    }
    type FirstParam<T extends (...args: any[]) => any> = Parameters<T> extends [] ? void : Parameters<T>[0];
    type Time = {
        unixtime?: number | null;
        rfc1123?: string | null;
    };
    module Time {
        type Options = Exclude<FirstParam<Kraken["time"]>, undefined>;
    }
    type SystemStatus = {
        status?: string | null;
        timestamp?: string | null;
    };
    module SystemStatus {
        type Options = Exclude<FirstParam<Kraken["systemStatus"]>, undefined>;
    }
    type Assets = {
        [asset: string]: {
            aclass?: string | null;
            altname?: string | null;
            decimals?: number | null;
            display_decimals?: number | null;
        };
    };
    module Assets {
        type Options = Exclude<FirstParam<Kraken["assets"]>, undefined>;
    }
    type AssetPairs = {
        [pair: string]: {
            altname?: string | null;
            wsname?: string | null;
            aclass_base?: string | null;
            base?: string | null;
            aclass_quote?: string | null;
            quote?: string | null;
            lot?: string | null;
            pair_decimals?: number | null;
            lot_decimals?: number | null;
            lot_multiplier?: number | null;
            leverage_buy?: Array<number> | null;
            leverage_sell?: Array<number> | null;
            fees?: Array<Array<number>> | null;
            fees_maker?: Array<Array<number>> | null;
            fee_volume_currency?: string | null;
            margin_call?: number | null;
            margin_stop?: number | null;
            ordermin?: string | null;
        };
    };
    module AssetPairs {
        type Options = Exclude<FirstParam<Kraken["assetPairs"]>, undefined>;
    }
    type Ticker = {
        [pair: string]: {
            a?: Array<string> | null;
            b?: Array<string> | null;
            c?: Array<string> | null;
            v?: Array<string> | null;
            p?: Array<string> | null;
            t?: Array<number> | null;
            l?: Array<string> | null;
            h?: Array<string> | null;
            o?: string | null;
        };
    };
    module Ticker {
        type Options = Exclude<FirstParam<Kraken["ticker"]>, undefined>;
    }
    type OHLC = {
        [pair: string]: Array<Array<string | number>>;
    } & {
        last?: number | null;
    };
    module OHLC {
        type Options = Exclude<FirstParam<Kraken["ohlc"]>, undefined>;
    }
    type Depth = {
        [pair: string]: {
            asks?: Array<Array<string | number>> | null;
            bids?: Array<Array<string | number>> | null;
        };
    };
    module Depth {
        type Options = Exclude<FirstParam<Kraken["depth"]>, undefined>;
    }
    type Trades = {
        [pair: string]: Array<Array<string | number>>;
    } & {
        last?: string | null;
    };
    module Trades {
        type Options = Exclude<FirstParam<Kraken["trades"]>, undefined>;
    }
    type Spread = {
        [pair: string]: Array<Array<string | number>>;
    } & {
        last?: number | null;
    };
    module Spread {
        type Options = Exclude<FirstParam<Kraken["spread"]>, undefined>;
    }
    type GetWebSocketsToken = {
        token?: string | null;
        expires?: number | null;
    };
    module GetWebSocketsToken {
        type Options = Exclude<FirstParam<Kraken["getWebSocketsToken"]>, undefined>;
    }
    type Balance = {
        [asset: string]: string;
    };
    module Balance {
        type Options = Exclude<FirstParam<Kraken["balance"]>, undefined>;
    }
    type TradeBalance = {
        eb?: string | null;
        tb?: string | null;
        m?: string | null;
        n?: string | null;
        c?: string | null;
        v?: string | null;
        e?: string | null;
        mf?: string | null;
        ml?: string | null;
    };
    module TradeBalance {
        type Options = Exclude<FirstParam<Kraken["tradeBalance"]>, undefined>;
    }
    type OpenOrders = {
        open?: {
            [key: string]: {
                refid?: string | null;
                userref?: number | null;
                status?: string | null;
                opentm?: number | null;
                starttm?: number | null;
                expiretm?: number | null;
                descr?: {
                    pair?: string | null;
                    type?: string | null;
                    ordertype?: string | null;
                    price?: string | null;
                    price2?: string | null;
                    leverage?: string | null;
                    order?: string | null;
                    close?: string | null;
                } | null;
                vol?: string | null;
                vol_exec?: string | null;
                cost?: string | null;
                fee?: string | null;
                price?: string | null;
                stopprice?: string | null;
                limitprice?: string | null;
                misc?: string | null;
                oflags?: string | null;
                trades?: Array<string> | null;
            };
        } | null;
    };
    module OpenOrders {
        type Options = Exclude<FirstParam<Kraken["openOrders"]>, undefined>;
    }
    type ClosedOrders = {
        closed?: {
            [key: string]: {
                refid?: string | null;
                userref?: number | null;
                status?: string | null;
                opentm?: number | null;
                starttm?: number | null;
                expiretm?: number | null;
                descr?: {
                    pair?: string | null;
                    type?: string | null;
                    ordertype?: string | null;
                    price?: string | null;
                    price2?: string | null;
                    leverage?: string | null;
                    order?: string | null;
                    close?: string | null;
                } | null;
                vol?: string | null;
                vol_exec?: string | null;
                cost?: string | null;
                fee?: string | null;
                price?: string | null;
                stopprice?: string | null;
                limitprice?: string | null;
                misc?: string | null;
                oflags?: string | null;
                trades?: Array<string> | null;
            } & {
                closetm?: number | null;
                reason?: string | null;
            };
        } | null;
        count?: number | null;
    };
    module ClosedOrders {
        type Options = Exclude<FirstParam<Kraken["closedOrders"]>, undefined>;
    }
    type QueryOrders = {
        [txid: string]: {
            refid?: string | null;
            userref?: number | null;
            status?: string | null;
            opentm?: number | null;
            starttm?: number | null;
            expiretm?: number | null;
            descr?: {
                pair?: string | null;
                type?: string | null;
                ordertype?: string | null;
                price?: string | null;
                price2?: string | null;
                leverage?: string | null;
                order?: string | null;
                close?: string | null;
            } | null;
            vol?: string | null;
            vol_exec?: string | null;
            cost?: string | null;
            fee?: string | null;
            price?: string | null;
            stopprice?: string | null;
            limitprice?: string | null;
            misc?: string | null;
            oflags?: string | null;
            trades?: Array<string> | null;
        } | ({
            refid?: string | null;
            userref?: number | null;
            status?: string | null;
            opentm?: number | null;
            starttm?: number | null;
            expiretm?: number | null;
            descr?: {
                pair?: string | null;
                type?: string | null;
                ordertype?: string | null;
                price?: string | null;
                price2?: string | null;
                leverage?: string | null;
                order?: string | null;
                close?: string | null;
            } | null;
            vol?: string | null;
            vol_exec?: string | null;
            cost?: string | null;
            fee?: string | null;
            price?: string | null;
            stopprice?: string | null;
            limitprice?: string | null;
            misc?: string | null;
            oflags?: string | null;
            trades?: Array<string> | null;
        } & {
            closetm?: number | null;
            reason?: string | null;
        });
    };
    module QueryOrders {
        type Options = Exclude<FirstParam<Kraken["queryOrders"]>, undefined>;
    }
    type TradesHistory = {
        trades?: {
            [txid: string]: {
                ordertxid?: string | null;
                pair?: string | null;
                time?: number | null;
                type?: string | null;
                ordertype?: string | null;
                price?: string | null;
                cost?: string | null;
                fee?: string | null;
                vol?: string | null;
                margin?: string | null;
                misc?: string | null;
                posstatus?: string | null;
                cprice?: string | null;
                ccost?: string | null;
                cfee?: string | null;
                cvol?: string | null;
                cmargin?: string | null;
                net?: string | null;
                trades?: Array<string> | null;
            };
        } | null;
        count?: number | null;
    };
    module TradesHistory {
        type Options = Exclude<FirstParam<Kraken["tradesHistory"]>, undefined>;
    }
    type QueryTrades = {
        [txid: string]: {
            ordertxid?: string | null;
            pair?: string | null;
            time?: number | null;
            type?: string | null;
            ordertype?: string | null;
            price?: string | null;
            cost?: string | null;
            fee?: string | null;
            vol?: string | null;
            margin?: string | null;
            misc?: string | null;
            posstatus?: string | null;
            cprice?: string | null;
            ccost?: string | null;
            cfee?: string | null;
            cvol?: string | null;
            cmargin?: string | null;
            net?: string | null;
            trades?: Array<string> | null;
        };
    };
    module QueryTrades {
        type Options = Exclude<FirstParam<Kraken["queryTrades"]>, undefined>;
    }
    type OpenPositions = {
        [txid: string]: {
            ordertxid?: string | null;
            posstatus?: string | null;
            pair?: string | null;
            time?: number | null;
            type?: string | null;
            ordertype?: string | null;
            cost?: string | null;
            fee?: string | null;
            vol?: string | null;
            vol_closed?: string | null;
            margin?: string | null;
            value?: string | null;
            net?: string | null;
            terms?: string | null;
            rollovertm?: string | null;
            misc?: string | null;
            oflags?: string | null;
        };
    };
    module OpenPositions {
        type Options = Exclude<FirstParam<Kraken["openPositions"]>, undefined>;
    }
    type Ledgers = {
        ledger?: {
            [ledger_id: string]: {
                refid?: string | null;
                time?: number | null;
                type?: string | null;
                subtype?: string | null;
                aclass?: string | null;
                asset?: string | null;
                amount?: string | null;
                fee?: string | null;
                balance?: string | null;
            };
        } | null;
        count?: number | null;
    };
    module Ledgers {
        type Options = Exclude<FirstParam<Kraken["ledgers"]>, undefined>;
    }
    type QueryLedgers = {
        [ledger_id: string]: {
            refid?: string | null;
            time?: number | null;
            type?: string | null;
            subtype?: string | null;
            aclass?: string | null;
            asset?: string | null;
            amount?: string | null;
            fee?: string | null;
            balance?: string | null;
        };
    };
    module QueryLedgers {
        type Options = Exclude<FirstParam<Kraken["queryLedgers"]>, undefined>;
    }
    type TradeVolume = {
        currency?: string | null;
        volume?: string | null;
        fees?: {
            [pair: string]: {
                fee?: string | null;
                min_fee?: string | null;
                max_fee?: string | null;
                next_fee?: string | null;
                tier_volume?: string | null;
                next_volume?: string | null;
            };
        } | null;
        fees_maker?: {
            [pair: string]: {
                fee?: string | null;
                min_fee?: string | null;
                max_fee?: string | null;
                next_fee?: string | null;
                tier_volume?: string | null;
                next_volume?: string | null;
            };
        } | null;
    };
    module TradeVolume {
        type Options = Exclude<FirstParam<Kraken["tradeVolume"]>, undefined>;
    }
    type AddExport = {
        id?: string | null;
    };
    module AddExport {
        type Options = Exclude<FirstParam<Kraken["addExport"]>, undefined>;
    }
    type ExportStatus = Array<{
        id?: string | null;
        descr?: string | null;
        format?: string | null;
        report?: string | null;
        subtype?: string | null;
        status?: string | null;
        flags?: string | null;
        fields?: string | null;
        createdtm?: string | null;
        expiretm?: string | null;
        starttm?: string | null;
        completedtm?: string | null;
        datastarttm?: string | null;
        dataendtm?: string | null;
        aclass?: string | null;
        asset?: string | null;
    }>;
    module ExportStatus {
        type Options = Exclude<FirstParam<Kraken["exportStatus"]>, undefined>;
    }
    type RetrieveExport = Buffer;
    module RetrieveExport {
        type Options = Exclude<FirstParam<Kraken["retrieveExport"]>, undefined>;
    }
    type RemoveExport = {
        delete?: boolean | null;
        cancel?: boolean | null;
    };
    module RemoveExport {
        type Options = Exclude<FirstParam<Kraken["removeExport"]>, undefined>;
    }
    type AddOrder = {
        descr?: {
            order?: string | null;
            close?: string | null;
        } | null;
        txid?: Array<string> | null;
    };
    module AddOrder {
        type Options = Exclude<FirstParam<Kraken["addOrder"]>, undefined>;
    }
    type CancelOrder = {
        count?: number | null;
        pending?: boolean | null;
    };
    module CancelOrder {
        type Options = Exclude<FirstParam<Kraken["cancelOrder"]>, undefined>;
    }
    type CancelAll = {
        count?: number | null;
    };
    module CancelAll {
        type Options = Exclude<FirstParam<Kraken["cancelAll"]>, undefined>;
    }
    type CancelAllOrdersAfter = {
        currentTime?: string | null;
        triggerTime?: string | null;
    };
    module CancelAllOrdersAfter {
        type Options = Exclude<FirstParam<Kraken["cancelAllOrdersAfter"]>, undefined>;
    }
    type DepositMethods = Array<{
        method?: string | null;
        limit?: (string | boolean) | null;
        fee?: string | null;
        "address-setup-fee"?: string | null;
        "gen-address"?: boolean | null;
    }>;
    module DepositMethods {
        type Options = Exclude<FirstParam<Kraken["depositMethods"]>, undefined>;
    }
    type DepositAddresses = Array<{
        address?: string | null;
        expiretm?: string | null;
        new?: boolean | null;
    }>;
    module DepositAddresses {
        type Options = Exclude<FirstParam<Kraken["depositAddresses"]>, undefined>;
    }
    type DepositStatus = Array<{
        method?: string | null;
        aclass?: string | null;
        asset?: string | null;
        refid?: string | null;
        txid?: string | null;
        info?: string | null;
        amount?: string | null;
        fee?: string | null;
        time?: number | null;
        status?: string | null;
        "status-prop"?: string | null;
    }>;
    module DepositStatus {
        type Options = Exclude<FirstParam<Kraken["depositStatus"]>, undefined>;
    }
    type WithdrawInfo = {
        method?: string | null;
        limit?: string | null;
        amount?: string | null;
        fee?: string | null;
    };
    module WithdrawInfo {
        type Options = Exclude<FirstParam<Kraken["withdrawInfo"]>, undefined>;
    }
    type Withdraw = {
        refid?: string | null;
    };
    module Withdraw {
        type Options = Exclude<FirstParam<Kraken["withdraw"]>, undefined>;
    }
    type WithdrawStatus = Array<{
        method?: string | null;
        aclass?: string | null;
        asset?: string | null;
        refid?: string | null;
        txid?: string | null;
        info?: string | null;
        amount?: string | null;
        fee?: string | null;
        time?: number | null;
        status?: string | null;
        "status-prop"?: string | null;
    }>;
    module WithdrawStatus {
        type Options = Exclude<FirstParam<Kraken["withdrawStatus"]>, undefined>;
    }
    type WithdrawCancel = boolean;
    module WithdrawCancel {
        type Options = Exclude<FirstParam<Kraken["withdrawCancel"]>, undefined>;
    }
    type WalletTransfer = {
        refid?: string | null;
    };
    module WalletTransfer {
        type Options = Exclude<FirstParam<Kraken["walletTransfer"]>, undefined>;
    }
    type Stake = {
        refid?: string | null;
    };
    module Stake {
        type Options = Exclude<FirstParam<Kraken["stake"]>, undefined>;
    }
    type Unstake = {
        refid?: string | null;
    };
    module Unstake {
        type Options = Exclude<FirstParam<Kraken["unstake"]>, undefined>;
    }
    type StakingAssets = Array<{
        asset: string;
        staking_asset: string;
        method?: string | null;
        on_chain?: boolean | null;
        can_stake?: boolean | null;
        can_unstake?: boolean | null;
        minimum_amount?: {
            unstaking: string;
            staking: string;
        } | null;
        lock?: {
            unstaking?: Array<{
                days: number;
                percentage: number;
            }> | null;
            staking?: Array<{
                days: number;
                percentage: number;
            }> | null;
            lockup?: Array<{
                days: number;
                percentage: number;
            }> | null;
        } | null;
        enabled_for_user?: boolean | null;
        disabled?: boolean | null;
        rewards: {
            reward?: string | null;
            type?: string | null;
        };
    }>;
    module StakingAssets {
        type Options = Exclude<FirstParam<Kraken["stakingAssets"]>, undefined>;
    }
    type StakingPending = Array<{
        refid?: string | null;
        type?: string | null;
        asset?: string | null;
        amount?: string | null;
        time?: string | null;
        bond_start?: number | null;
        bond_end?: number | null;
        status?: string | null;
    }>;
    module StakingPending {
        type Options = Exclude<FirstParam<Kraken["stakingPending"]>, undefined>;
    }
    type StakingTransactions = Array<{
        refid?: string | null;
        type?: string | null;
        asset?: string | null;
        amount?: string | null;
        time?: string | null;
        bond_start?: number | null;
        bond_end?: number | null;
        status?: string | null;
    }>;
    module StakingTransactions {
        type Options = Exclude<FirstParam<Kraken["stakingTransactions"]>, undefined>;
    }
    module WS {
        type Ticker = {
            a?: [
                string,
                number,
                string
            ] | null;
            b?: [
                string,
                number,
                string
            ] | null;
            c?: [
                string,
                string
            ] | null;
            v?: [
                string,
                string
            ] | null;
            p?: [
                string,
                string
            ] | null;
            t?: [
                number,
                number
            ] | null;
            l?: [
                string,
                string
            ] | null;
            h?: [
                string,
                string
            ] | null;
            o?: [
                string,
                string
            ] | null;
        };
        module Ticker {
            type Options = Exclude<FirstParam<Kraken["ws"]["ticker"]>, undefined>;
            type Subscriber = ReturnType<Kraken["ws"]["ticker"]>;
        }
        type OHLC = Array<[
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            number
        ]>;
        module OHLC {
            type Options = Exclude<FirstParam<Kraken["ws"]["ohlc"]>, undefined>;
            type Subscriber = ReturnType<Kraken["ws"]["ohlc"]>;
        }
        type Trade = Array<[
            string,
            string,
            string,
            string,
            string,
            string
        ]>;
        module Trade {
            type Options = Exclude<FirstParam<Kraken["ws"]["trade"]>, undefined>;
            type Subscriber = ReturnType<Kraken["ws"]["trade"]>;
        }
        type Spread = Array<[
            string,
            string,
            string,
            string,
            string
        ]>;
        module Spread {
            type Options = Exclude<FirstParam<Kraken["ws"]["spread"]>, undefined>;
            type Subscriber = ReturnType<Kraken["ws"]["spread"]>;
        }
        type Book = Book.Snapshot | Book.Ask | Book.Bid | Book.Mirror;
        module Book {
            type Level = [
                string,
                string,
                string
            ];
            type LevelUpdate = [
                string,
                string,
                string,
                "r"?
            ];
            type Snapshot = {
                as: Array<Level>;
                bs: Array<Level>;
            };
            type Ask = {
                a: Array<LevelUpdate>;
                c?: string | null;
            };
            type Bid = {
                b: Array<LevelUpdate>;
                c?: string | null;
            };
            type Mirror = Snapshot;
            type Options = Exclude<FirstParam<Kraken["ws"]["book"]>, undefined>;
            type Subscriber = ReturnType<Kraken["ws"]["book"]>;
            function applyUpdate(snapshot: Snapshot, update: Ask | Bid): {
                modified: boolean;
                verified: boolean;
            };
        }
        type OwnTrades = Array<{
            [tradeid: string]: {
                ordertxid?: string | null;
                postxid?: string | null;
                pair?: string | null;
                time?: string | null;
                type?: string | null;
                ordertype?: string | null;
                price?: string | null;
                cost?: string | null;
                fee?: string | null;
                vol?: string | null;
                margin?: string | null;
                userref?: number | null;
            };
        }>;
        module OwnTrades {
            type Options = Exclude<FirstParam<Kraken["ws"]["ownTrades"]>, undefined>;
            type Subscriber = ReturnType<Kraken["ws"]["ownTrades"]>;
        }
        type OpenOrders = Array<{
            [orderid: string]: {
                refid?: string | null;
                userref?: number | null;
                status?: string | null;
                opentm?: string | null;
                starttm?: string | null;
                expiretm?: string | null;
                descr?: {
                    pair?: string | null;
                    position?: string | null;
                    type?: string | null;
                    ordertype?: string | null;
                    price?: string | null;
                    price2?: string | null;
                    leverage?: string | null;
                    order?: string | null;
                    close?: string | null;
                } | null;
                vol?: string | null;
                vol_exec?: string | null;
                cost?: string | null;
                fee?: string | null;
                avg_price?: string | null;
                stopprice?: string | null;
                limitprice?: string | null;
                misc?: string | null;
                oflags?: string | null;
                timeinforce: string | null;
                cancel_reason?: string | null;
                ratecount?: number | null;
            };
        }>;
        module OpenOrders {
            type Options = Exclude<FirstParam<Kraken["ws"]["openOrders"]>, undefined>;
            type Subscriber = ReturnType<Kraken["ws"]["openOrders"]>;
        }
        type AddOrder = {
            event?: "addOrderStatus";
            reqid?: number | null;
            status?: string | null;
            txid?: string | null;
            descr?: string | null;
            errorMessage?: string | null;
        };
        module AddOrder {
            type Options = Exclude<FirstParam<Kraken["ws"]["addOrder"]>, undefined>;
        }
        type CancelOrder = Array<{
            event?: "cancelOrderStatus";
            reqid?: number | null;
            status?: string | null;
            errorMessage?: string | null;
        }>;
        module CancelOrder {
            type Options = Exclude<FirstParam<Kraken["ws"]["cancelOrder"]>, undefined>;
        }
        type CancelAll = {
            event?: "cancelAllStatus";
            reqid?: number | null;
            count?: number | null;
            status?: string | null;
            errorMessage?: string | null;
        };
        module CancelAll {
            type Options = Exclude<FirstParam<Kraken["ws"]["cancelAll"]>, undefined>;
        }
        type CancelAllOrdersAfter = {
            event?: "cancelAllOrdersAfterStatus";
            reqid?: number | null;
            status?: string | null;
            currentTime?: string | null;
            triggerTime?: string | null;
            errorMessage?: string | null;
        };
        module CancelAllOrdersAfter {
            type Options = Exclude<FirstParam<Kraken["ws"]["cancelAllOrdersAfter"]>, undefined>;
        }
        type SystemStatus = {
            event: "systemStatus";
            connectionID?: number | null;
            status?: string | null;
            version?: string | null;
        };
        type SubscriptionRequest = {
            event: "subscribe" | "unsubscribe";
            reqid?: number;
            pair?: string[];
            subscription?: {
                depth?: number;
                interval?: number;
                name: string;
                ratecounter?: boolean;
                snapshot?: boolean;
                token?: string;
            };
        };
        type SubscriptionStatus = {
            event: "subscriptionStatus";
            reqid: number | null;
            channelName?: string | null;
            channelID?: number | null;
            pair?: string | null;
            status: string;
            subscription?: (SubscriptionRequest["subscription"] & {
                maxratecount?: number | null;
            }) | null;
            errorMessage?: string | null;
        };
        class Connection extends Emitter<{
            heartbeat: () => any;
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
            private readonly _gettimeout;
            private _state;
            private _socket;
            private _sendQueue;
            get state(): "closed" | "opening" | "open" | "closing";
            readonly hostname: string;
            get socket(): WebSocket | null;
            constructor(hostname: string, gettimeout: () => number);
            ping(): Promise<void>;
            request(request: {
                event: string;
                reqid?: number;
            }): Promise<any>;
            requestMulti(request: {
                event: string;
                reqid?: number;
            }, nResponses: number): Promise<any[]>;
            open(): Promise<void>;
            close(code?: number, reason?: string): Promise<void>;
            terminate(): void;
            write(data: WebSocket.Data): this;
            private _setState;
            private _parseRead;
            private _onread;
            private _onerror;
            private _onclose;
            private _onopen;
        }
        class Subscriber<PayloadEvents extends {
            payload?: never;
            status?: never;
            error?: never;
        } & {
            [event: string]: (...args: any[]) => any;
        } = {}, Options extends Omit<SubscriptionRequest["subscription"], "name"> = {}> extends Emitter<{
            payload: (payload: any[], status: SubscriptionStatus) => any;
            status: (status: SubscriptionStatus) => any;
            error: (error: Error, status?: SubscriptionStatus) => any;
        }, PayloadEvents> {
            private _con;
            private _reqid;
            readonly name: string;
            readonly options: Options;
            readonly subscriptions: Set<Subscription>;
            constructor(con: Connection, name: string, payloadDistributor: (self: Subscriber<PayloadEvents, Options>, payload: any[], status: SubscriptionStatus) => void, options: Options);
            subscribe(...pairs: Options extends {
                token: string;
            } ? void[] : string[]): Promise<this>;
            unsubscribe(...pairs: Options extends {
                token: string;
            } ? void[] : string[]): Promise<this>;
            private _mksub;
            private _rmsub;
        }
        class Subscription extends Emitter<{
            created: () => any;
            destroyed: () => any;
            status: (status: SubscriptionStatus) => any;
            error: (error: Error) => any;
            payload: (payload: any[]) => any;
        }> {
            private _con;
            status: SubscriptionStatus;
            constructor(con: Connection, reqid: number, pair?: string);
            private _isstatus;
            private _onstatus;
            private _onpayload;
            private _init;
            private _destroy;
        }
    }
}
export declare class _Authenticator {
    signedHeaders: (path: string, postdata: string, nonce: number) => {
        "User-Agent": typeof _USER_AGENT;
        "API-Key": string;
        "API-Sign": string;
        "Content-Type": "application/x-www-form-urlencoded";
    };
    signedQuery: (input: Readonly<NodeJS.Dict<any>>) => NodeJS.Dict<any> & {
        otp?: string;
    };
    constructor(key: string, secret: string, genotp?: () => string);
}
export declare class _UTF8Receiver {
    private _finalized;
    private _chunked;
    private _onjson;
    private _onerror;
    constructor(onjson: (json: any) => any, onerror: (error: Error) => any);
    nextChunk(chunk: any, statusCode: number | undefined, statusMessage: string | undefined): void;
    finalize(statusCode: number | undefined, statusMessage: string | undefined): void;
    private _verifyStatus;
}
export declare class _BinaryReceiver {
    private _finalized;
    private _chunks;
    private _onbuffer;
    private _onerror;
    constructor(onbuffer: (buffer: Buffer) => any, onerror: (error: Error) => any);
    nextChunk(chunk: any, statusCode?: number | undefined, statusMessage?: string | undefined): void;
    finalize(statusCode: number | undefined, statusMessage: string | undefined): void;
    private _verifyStatus;
}
export declare function _prepareRequest(endpoint: string, options: NodeJS.Dict<any> | null, type: "public" | "private", gennonce: () => number, auth: _Authenticator | null): {
    requestOptions: http.RequestOptions;
    postdata: string | null;
};
export declare function _sendRequest(requestOptions: http.RequestOptions, postdata: string | null, encoding: "utf8" | "binary", timeout: number): Promise<unknown>;
export declare function _request(endpoint: string, options: NodeJS.Dict<any> | null, type: "public" | "private", encoding: "utf8" | "binary", timeout: number, gennonce: () => number, auth: _Authenticator | null): Promise<any>;
export declare module _Legacy {
    interface Settings {
        pubMethods?: any;
        privMethods?: any;
        parse?: any;
        dataFormatter?: any;
    }
    module Settings {
        function defaults(): Required<Settings>;
    }
    function parseNested(o: any, parse: any): any;
}
export declare class _CountTrigger {
    private _count;
    private _action;
    constructor(count: number, action: () => void);
    fireWhenReady(): void;
}
export declare function _hidePrivates(o: object): void;
