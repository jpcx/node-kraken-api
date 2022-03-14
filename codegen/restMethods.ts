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
 * @copyright 2018-2022 @author Justin Collier <m@jpcx.dev>                   *
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

//----------------------------------------------------------------------------//
// This script parses the OpenAPI spec file provided by the Kraken docs.      //
// With a few exceptions (overrides listed below), all REST methods, response //
// types, and documentation comments are generated directly from this file.   //
//                                                                            //
// Note: All objects in the specifications file have been typed for the       //
//       purposes of this script. The file is recursively verified            //
//       on execution, and if there are any discrepancies the script          //
//       will display a tree of execution history that describe which         //
//       assertion failed. In this case, the assertions will need to be       //
//       manually adjusted. See the Is namespace and any .is functions.       //
//----------------------------------------------------------------------------//

import * as fs from "fs";
import * as path from "path";

const specsPath = path.join(__dirname, "../swagger.json");
const apiPath = path.join(__dirname, "../../index.ts");
const backupPath = path.join(__dirname, "../.build/~index.ts.restMethods.bak");

const ANSI_GRAY_FG = "\x1b[90m";
const ANSI_GREEN_FG = "\x1b[32m";
const ANSI_RED_FG = "\x1b[31m";
const ANSI_RESET = "\x1b[0m";
const PASS = ANSI_GREEN_FG + "✓" + ANSI_RESET;
const FAIL = ANSI_RED_FG + "▷" + ANSI_RESET;

// any overrides to apply to the JSON-parsed schema object
const OVERRIDES: Array<[string[], NodeJS.Dict<any> | "$$DELETE$$"]> = [
  /* overrides {*/
  [
    // change depth asks from an array to a nested array
    [
      "paths",
      "/public/Depth",
      "get",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "properties",
      "asks",
    ],
    {
      description: "Ask side array of entries `[<price>, <volume>, <timestamp>]`",
      type: "array",
      items: {
        type: "array",
        items: {
          oneOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
          example: ["3539.90000", "0.801", 1548119951],
        },
      },
    },
  ],
  // remove "bid"; it should be "bids"
  [
    [
      "paths",
      "/public/Depth",
      "get",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "properties",
      "bid",
    ],
    "$$DELETE$$",
  ],
  // change depth bids from an array to a nested array
  [
    [
      "paths",
      "/public/Depth",
      "get",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "properties",
      "bids",
    ],
    {
      description: "Bid side array of entries `[<price>, <volume>, <timestamp>]`",
      type: "array",
      items: {
        // server specifications don't have this as a nested array; they should
        type: "array",
        items: {
          oneOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
          example: ["3538.70000", "0.798", 1548119924],
        },
      },
    },
  ],
  [
    // change trades from an array to a nested array
    [
      "paths",
      "/public/Trades",
      "get",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "items",
    ],
    {
      type: "array",
      items: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "number",
          },
        ],
        example: ["3535.40000", "0.09670735", 1548111757.2558, "b", "m", ""],
      },
    },
  ],
  [
    // change spread from an array to a nested array
    [
      "paths",
      "/public/Spread",
      "get",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "items",
    ],
    {
      type: "array",
      items: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "integer",
          },
        ],
        example: [1548120550, "3538.70000", "3541.50000"],
      },
    },
  ],
  [
    // tweak balance example for use with this script
    [
      "paths",
      "/private/Balance",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "example",
      "properties",
    ],
    "$$DELETE$$",
  ],
  [
    // Reduce trades response example
    [
      "paths",
      "/private/TradesHistory",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "example",
      "result",
      "trades",
    ],
    {
      "THVRQM-33VKH-UCI7BS": {
        ordertxid: "OQCLML-BW3P3-BUCMWZ",
        postxid: "TKH2SE-M7IF5-CFI7LT",
        pair: "XXBTZUSD",
        time: 1616667796.8802,
        type: "buy",
        ordertype: "limit",
        price: "30010.00000",
        cost: "600.20000",
        fee: "0.00000",
        vol: "0.02000000",
        margin: "0.00000",
        misc: "",
      },
      "TUI2JG-VOE36-SW7UJQ": {
        ordertxid: "OZABVF-MIK6V-L3ZTOE",
        postxid: "TF5GVO-T7ZZ2-6NBKBI",
        pair: "XXBTZUSD",
        time: 1616511385.1402,
        type: "sell",
        ordertype: "limit",
        price: "30000.00000",
        cost: "60.00000",
        fee: "0.06000",
        vol: "0.00200000",
        margin: "12.00000",
        misc: "closing",
      },
    },
  ],
  [
    // fix order userref type -> number
    [
      "paths",
      "/private/QueryOrders",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "oneOf",
      "1",
      "allOf",
      "0",
      "properties",
      "userref",
    ],
    {
      description: "User reference id",
      type: "number",
    },
  ],
  [
    // add trades cprice type
    [
      "paths",
      "/private/QueryTrades",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "properties",
      "cprice",
    ],
    {
      description:
        "Average price of closed portion of position (quote currency)\n<br><sub><sup>Only present if trade opened a position</sub></sup>\n",
      type: "string",
    },
  ],
  [
    // add trades ccost type
    [
      "paths",
      "/private/QueryTrades",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "properties",
      "ccost",
    ],
    {
      description:
        "Total cost of closed portion of position (quote currency)\n<br><sub><sup>Only present if trade opened a position</sub></sup>\n",
      type: "string",
    },
  ],
  [
    // add trades cfee type
    [
      "paths",
      "/private/QueryTrades",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "properties",
      "cfee",
    ],
    {
      description:
        "Total fee of closed portion of position (quote currency)\n<br><sub><sup>Only present if trade opened a position</sub></sup>\n",
      type: "string",
    },
  ],
  [
    // add trades cvol type
    [
      "paths",
      "/private/QueryTrades",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "properties",
      "cvol",
    ],
    {
      description:
        "Total fee of closed portion of position (quote currency)\n<br><sub><sup>Only present if trade opened a position</sub></sup>\n",
      type: "string",
    },
  ],
  [
    // add trades cmargin type
    [
      "paths",
      "/private/QueryTrades",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "properties",
      "cmargin",
    ],
    {
      description:
        "Total margin freed in closed portion of position (quote currency)\n<br><sub><sup>Only present if trade opened a position</sub></sup>\n",
      type: "string",
    },
  ],
  [
    // add trades net type
    [
      "paths",
      "/private/QueryTrades",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "additionalProperties",
      "properties",
      "net",
    ],
    {
      description:
        "Net profit/loss of closed portion of position (quote currency, quote currency scale)\n<br><sub><sup>Only present if trade opened a position</sub></sup>\n",
      type: "string",
    },
  ],
  [
    // add depositMethods limit type
    [
      "paths",
      "/private/DepositMethods",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "items",
      "properties",
      "limit",
    ],
    {
      description:
        "Net profit/loss of closed portion of position (quote currency, quote currency scale)\n<br><sub><sup>Only present if trade opened a position</sub></sup>\n",
      oneOf: [
        {
          type: "string",
        },
        {
          type: "boolean",
        },
      ],
    },
  ],
  [
    // add depositStatus fee type
    [
      "paths",
      "/private/DepositStatus",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "items",
      "properties",
      "fee",
    ],
    {
      description: "Fees paid",
      type: "string",
    },
  ],
  [
    // add depositStatus status type
    [
      "paths",
      "/private/DepositStatus",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "items",
      "properties",
      "status",
    ],
    {
      description:
        "Status of deposit<br>\n<sup><sub>For information about the status, please refer to the [IFEX financial transaction states](https://github.com/globalcitizen/ifex-protocol/blob/master/draft-ifex-00.txt#L837).</sup></sub>\n",
      type: "string",
    },
  ],
  [
    // add withdrawStatus fee type
    [
      "paths",
      "/private/WithdrawStatus",
      "post",
      "responses",
      "200",
      "content",
      "application/json",
      "schema",
      "properties",
      "result",
      "items",
      "properties",
      "fee",
    ],
    {
      description: "Fees paid",
      type: "string",
    },
  ],
  /* overrides }*/
];

/*                       Specification object loading, types, and assertions {*/

// loads the schema with all of its references replaced
function loadSpecs(): any {
  const specs: any = JSON.parse(fs.readFileSync(specsPath, "utf8"));

  // Recursively replaces all references within the schema with their targets
  function replaceAllSchemaReferences(): void {
    // Pulls a referenced property from the schema
    function getReference(ref: string): any {
      const path = ref.replace(/^#\//m, "").replace(/\//g, ".").replace(/~1/g, "/").split(".");
      let cur = specs;
      while (path.length) {
        const key = path.shift()!;
        if (key && cur.hasOwnProperty(key)) {
          cur = cur[key];
        } else {
          throw new Error("cannot find reference " + ref);
        }
      }
      return cur;
    }

    function recurse(
      grandparent: any,
      parentKey: any,
      parent: any,
      childKey: any,
      child: any
    ): void {
      if (childKey === "$ref") {
        if (typeof child !== "string") throw new Error("invalid reference type");
        grandparent[parentKey] = getReference(child);
      } else if (child instanceof Array) {
        for (let nextChildKey = 0; nextChildKey < child.length; ++nextChildKey) {
          const nextChild = child[nextChildKey];
          recurse(parent, childKey, child, nextChildKey, nextChild);
        }
      } else if (child instanceof Object) {
        for (const [nextChildKey, nextChild] of Object.entries(child))
          recurse(parent, childKey, child, nextChildKey, nextChild);
      }
    }
    for (const parentKey of Object.keys(specs)) {
      if (specs[parentKey] instanceof Object) {
        const parent = specs[parentKey];
        for (const childKey of Object.keys(parent)) {
          const child = parent[childKey];
          recurse(specs, parentKey, parent, childKey, child);
        }
      }
    }
  }

  replaceAllSchemaReferences();

  // apply overrides
  for (const [path, ovr] of OVERRIDES) {
    let cur = specs;
    while (path.length > 1) {
      const nextkey = path.shift()!;
      if (!cur.hasOwnProperty(nextkey))
        throw new Error("Error in override path: " + path.join(" "));
      cur = cur[nextkey];
    }
    const nextkey = path.shift()!;
    if (ovr === "$$DELETE$$") delete cur[nextkey];
    else cur[nextkey] = ovr;
  }

  return specs;
}

class Test {
  #name: string;
  #path: string[];

  static outputStack: [string, string][] = [];
  static indentLevel = 0;

  constructor(name: string, path: string[]) {
    this.#name = name;
    this.#path = path;
    ++Test.indentLevel;
  }

  public pass(): true {
    --Test.indentLevel;
    Test.outputStack.push([
      Array(Test.indentLevel * 2)
        .fill(" ")
        .join("") +
        PASS +
        " " +
        "[" +
        this.#name +
        "] ",
      ANSI_GRAY_FG + this.#path.join(" ") + ANSI_RESET,
    ]);
    return true;
  }

  public fail(): false {
    --Test.indentLevel;
    Test.outputStack.push([
      Array(Test.indentLevel * 2)
        .fill(" ")
        .join("") +
        FAIL +
        " " +
        "[" +
        this.#name +
        "] ",
      ANSI_GRAY_FG + this.#path.join(" ") + ANSI_RESET,
    ]);
    return false;
  }

  public test<Result extends boolean>(result: Result): Result {
    if (result) return this.pass() as Result;
    else return this.fail() as Result;
  }
}

module Is {
  export function layout<T extends object>(
    o: T,
    propPreds: { [key in keyof Required<T>]: (value: T[key], path: string[]) => value is T[key] },
    path: string[]
  ): o is T {
    const t = new Test("Is.layout", path);

    if (!(o instanceof Object)) return t.fail();

    const expectedKeys = Object.keys(propPreds) as (keyof T)[];
    // verify that all keys that exist are expected
    for (const prop of Object.keys(o) as (keyof T)[])
      if (!expectedKeys.includes(prop)) return t.fail();
    // check all property predicates
    for (const prop of expectedKeys)
      if (!propPreds[prop](o[prop], [...path, prop as string])) return t.fail();
    // passed the test!
    return t.pass();
  }

  export function object(o: object, path: string[]): o is object {
    const t = new Test("Is.object", path);
    return t.test(o instanceof Object);
  }

  export function strict<T>(target: T): (o: T, path: string[]) => o is T {
    return (o, path): o is T => {
      const t = new Test("Is.strict", path);
      if (o === target) return t.pass();
      return t.fail();
    };
  }

  export function undefined(o: undefined, path: string[]): o is undefined {
    const t = new Test("Is.undefined", path);
    return t.test(o === global.undefined);
  }

  export function boolean(o: boolean, path: string[]): o is boolean {
    const t = new Test("Is.boolean", path);
    return t.test(typeof o === "boolean");
  }

  export function string(o: string, path: string[]): o is string {
    const t = new Test("Is.string", path);
    return t.test(typeof o === "string");
  }

  export function number(o: number, path: string[]): o is number {
    const t = new Test("Is.number", path);
    return t.test(typeof o === "number");
  }

  export function dict<T>(
    predicate: (v: T, path: string[]) => v is T
  ): (o: NodeJS.Dict<T>, path: string[]) => o is NodeJS.Dict<T> {
    return (o, path): o is NodeJS.Dict<T> => {
      const t = new Test("Is.dict", path);
      return (
        t.test(o instanceof Object) &&
        !Object.entries(o).some(([k, v]) => !predicate(v!, [...path, "" + k]))
      );
    };
  }

  export function array<T>(
    predicate: (v: T, path: string[]) => v is T
  ): (o: T[], path: string[]) => o is T[] {
    return (o, path): o is T[] => {
      const t = new Test("Is.array", path);
      return t.test(o instanceof Array) && !o.some((v, i) => !predicate(v, [...path, "" + i]));
    };
  }

  export function or<A, B>(
    asserterA: (o: A, path: string[]) => o is A,
    asserterB: (o: B, path: string[]) => o is B
  ): (o: A | B, path: string[]) => o is A | B {
    return (o, path): o is A | B => {
      const t = new Test("Is.or", path);
      return t.test(asserterA(o as A, path) || asserterB(o as B, path));
    };
  }

  export function any(_: any, path: string[]): _ is any {
    const t = new Test("Is.any", path);
    return t.pass();
  }
}

type Schema =
  | Schema.Obj
  | Schema.Arr
  | Schema.ArrItems
  | Schema.Bool
  | Schema.Str
  | Schema.StrEnum
  | Schema.Num
  | Schema.BoundNum
  | Schema.NumEnum
  | Schema.Null
  | Schema.Any; // Any must be last
module Schema {
  export type Base = {
    type?: string;
    title?: string;
    description?: string;
    deprecated?: boolean;
    default?: any;
    nullable?: boolean;
    example?: any;
    "x-additionalPropertiesName"?: string;
  };
  export module Base {
    export const predicates: {
      [key in keyof Required<Base>]: (o: Base[key], path: string[]) => o is Base[key];
    } = {
      type: Is.or(Is.undefined, Is.string),
      title: Is.or(Is.undefined, Is.string),
      description: Is.or(Is.undefined, Is.string),
      deprecated: Is.or(Is.undefined, Is.boolean),
      default: Is.or(Is.undefined, Is.any),
      nullable: Is.or(Is.undefined, Is.boolean),
      example: Is.or(Is.undefined, Is.any),
      "x-additionalPropertiesName": Is.or(Is.undefined, Is.string),
    };
  }

  export type Obj = Obj.Unmarked | Obj.Marked;
  export module Obj {
    // must contain properties to denote object
    export type Unmarked = Base & {
      example?: Object;
      properties: NodeJS.Dict<Schema>;
      additionalProperties?: Schema;
      required?: string[];
    };
    export module Unmarked {
      export function is(o: any, path: string[]): o is Unmarked {
        const t = new Test("Schema.Obj.Unmarked.is", path);
        return t.test(
          Is.layout(
            <Unmarked>o,
            {
              ...Base.predicates,
              example: Is.or(Is.undefined, Is.object),
              properties: Is.dict(Schema.is),
              additionalProperties: Is.or(Is.undefined, Schema.is),
              required: Is.or(Is.undefined, Is.array(Is.string)),
            },
            path
          )
        );
      }
    }
    export type Marked = Base & {
      type: "object";
      example?: Object;
      properties?: NodeJS.Dict<Schema>;
      additionalProperties?: Schema;
      required?: string[];
    };
    export module Marked {
      export function is(o: any, path: string[]): o is Marked {
        const t = new Test("Schema.Obj.Marked.is", path);
        return t.test(
          Is.layout(
            <Marked>o,
            {
              ...Base.predicates,
              type: Is.strict<"object">("object"),
              example: Is.or(Is.undefined, Is.object),
              properties: Is.or(Is.undefined, Is.dict(Schema.is)),
              additionalProperties: Is.or(Is.undefined, Schema.is),
              required: Is.or(Is.undefined, Is.array(Is.string)),
            },
            path
          )
        );
      }
    }
    export function is(o: any, path: string[]): o is Obj {
      const t = new Test("Schema.Obj.is", path);
      return t.test(Unmarked.is(o, path) || Marked.is(o, path));
    }
  }

  export type Arr = Base & {
    type: "array";
    example?: any[];
    items: Schema;
  };
  export module Arr {
    export function is(o: any, path: string[]): o is Arr {
      const t = new Test("Schema.Arr.is", path);
      return t.test(
        Is.layout(
          <Arr>o,
          {
            ...Base.predicates,
            type: Is.strict<"array">("array"),
            example: Is.or(Is.undefined, Is.array(Is.any)),
            items: Schema.is,
          },
          path
        )
      );
    }
  }

  export type ArrItems = Base & {
    minItems?: number;
    maxItems?: number;
    oneOf?: Schema[];
    allOf?: Schema[];
  };
  export module ArrItems {
    export function is(o: any, path: string[]): o is ArrItems {
      const t = new Test("Schema.ArrItems.is", path);
      return t.test(
        Is.layout(
          <ArrItems>o,
          {
            ...Base.predicates,
            type: Is.or(Is.undefined, Is.string),
            minItems: Is.or(Is.undefined, Is.number),
            maxItems: Is.or(Is.undefined, Is.number),
            oneOf: Is.or(Is.undefined, Is.array(Schema.is)),
            allOf: Is.or(Is.undefined, Is.array(Schema.is)),
          },
          path
        )
      );
    }
  }

  export type Bool = Base & {
    type: "boolean";
    default?: boolean;
  };
  export module Bool {
    export function is(o: any, path: string[]): o is Bool {
      const t = new Test("Schema.Bool.is", path);
      return t.test(
        Is.layout(
          <Bool>o,
          {
            ...Base.predicates,
            type: Is.strict<"boolean">("boolean"),
            default: Is.or(Is.undefined, Is.boolean),
          },
          path
        )
      );
    }
  }

  export type Str = Base & {
    type: "string";
    format?: "binary";
    example?: string;
    default?: string;
  };
  export module Str {
    export function is(o: any, path: string[]): o is Str {
      const t = new Test("Schema.Str.is", path);
      return t.test(
        Is.layout(
          <Str>o,
          {
            ...Base.predicates,
            type: Is.strict<"string">("string"),
            format: Is.or(Is.undefined, Is.strict<"binary">("binary")),
            example: Is.or(Is.undefined, Is.string),
            default: Is.or(Is.undefined, Is.string),
          },
          path
        )
      );
    }
  }

  export type StrEnum = Base & {
    type: "string";
    enum: string[];
    default?: string;
  };
  export module StrEnum {
    export function is(o: any, path: string[]): o is StrEnum {
      const t = new Test("Schema.StrEnum.is", path);
      return t.test(
        Is.layout(
          <StrEnum>o,
          {
            ...Base.predicates,
            type: Is.strict<"string">("string"),
            enum: Is.array(Is.any),
            default: Is.or(Is.undefined, Is.string),
          },
          path
        )
      );
    }
  }

  export type Num = Base & {
    type: "integer" | "number";
    example?: number;
    format?: "int32";
    default?: number;
  };
  export module Num {
    export function is(o: any, path: string[]): o is Num {
      const t = new Test("Schema.Int.is", path);
      return t.test(
        Is.layout(
          <Num>o,
          {
            ...Base.predicates,
            type: Is.or(Is.strict<"integer">("integer"), Is.strict<"number">("number")),
            example: Is.or(Is.undefined, Is.number),
            format: Is.or(Is.undefined, Is.strict<"int32">("int32")),
            default: Is.or(Is.undefined, Is.number),
          },
          path
        )
      );
    }
  }

  export type BoundNum = Base & {
    type: "integer" | "number";
    minimum: number;
    maximum: number;
    default?: number;
  };
  export module BoundNum {
    export function is(o: any, path: string[]): o is BoundNum {
      const t = new Test("Schema.BoundNum.is", path);
      return t.test(
        Is.layout(
          <BoundNum>o,
          {
            ...Base.predicates,
            type: Is.or(Is.strict<"integer">("integer"), Is.strict<"number">("number")),
            minimum: Is.number,
            maximum: Is.number,
            default: Is.or(Is.undefined, Is.number),
          },
          path
        )
      );
    }
  }

  export type NumEnum = Base & {
    type: "integer" | "number";
    enum: number[];
    default?: number;
  };
  export module NumEnum {
    export function is(o: any, path: string[]): o is NumEnum {
      const t = new Test("Schema.NumEnum.is", path);
      return t.test(
        Is.layout(
          <NumEnum>o,
          {
            ...Base.predicates,
            type: Is.or(Is.strict<"integer">("integer"), Is.strict<"number">("number")),
            enum: Is.array(Is.number),
            default: Is.or(Is.undefined, Is.number),
            description: Is.or(Is.undefined, Is.string),
          },
          path
        )
      );
    }
  }

  export type Null = Base & {
    type: "null";
  };
  export module Null {
    export function is(o: any, path: string[]): o is Null {
      const t = new Test("Schema.Null.is", path);
      return t.test(
        Is.layout(
          <Null>o,
          {
            ...Base.predicates,
            type: Is.strict<"null">("null"),
          },
          path
        )
      );
    }
  }

  export type Any = Base;
  export module Any {
    export function is(o: any, path: string[]): o is Any {
      const t = new Test("Schema.Any.is", path);
      return t.test(Is.layout(<Any>o, Base.predicates, path));
    }
  }

  export function is(o: Schema, path: string[]): o is Schema {
    const t = new Test("Schema.is", path);
    return t.test(
      Obj.is(o, path) ||
        Arr.is(o, path) ||
        ArrItems.is(o, path) ||
        Bool.is(o, path) ||
        Str.is(o, path) ||
        StrEnum.is(o, path) ||
        Num.is(o, path) ||
        BoundNum.is(o, path) ||
        NumEnum.is(o, path) ||
        Null.is(o, path) ||
        Any.is(o, path)
    );
  }
}

type ResponseContent = ResponseContent.JSON | ResponseContent.OctetStream;
module ResponseContent {
  export type Details = {
    schema: Schema;
    example?: any;
    examples?: any;
  };
  export module Details {
    export function is(o: any, path: string[]): o is Details {
      const t = new Test("ResponseContent.Details.is", path);
      return t.test(
        Is.layout(
          <Details>o,
          {
            schema: Schema.is,
            example: Is.or(Is.undefined, Is.any),
            examples: Is.or(Is.undefined, Is.any),
          },
          path
        )
      );
    }
  }

  export type JSON = {
    "application/json": Details;
  };
  export module JSON {
    export function is(o: any, path: string[]): o is JSON {
      const t = new Test("ResponseContent.JSON.is", path);
      return t.test(
        Is.layout(
          <JSON>o,
          {
            "application/json": Details.is,
          },
          path
        )
      );
    }
  }
  export type OctetStream = {
    "application/octet-stream": Details;
  };
  export module OctetStream {
    export function is(o: any, path: string[]): o is OctetStream {
      const t = new Test("ResponseContent.OctetStream.is", path);
      return t.test(
        Is.layout(
          (<OctetStream>o) as OctetStream,
          {
            "application/octet-stream": Details.is,
          },
          path
        )
      );
    }
  }

  export function is(o: any, path: string[]): o is ResponseContent {
    const t = new Test("ResponseContent.is", path);
    return t.test(JSON.is(o, path) || OctetStream.is(o, path));
  }
}

type Response = {
  description: string;
  content: ResponseContent;
};
module Response {
  export function is(o: any, path: string[]): o is Response {
    const t = new Test("Response.is", path);
    return t.test(
      Is.layout<Response>(
        o,
        {
          description: Is.string,
          content: ResponseContent.is,
        },
        path
      )
    );
  }
}

type Parameter = {
  in: "query";
  name: string;
  description: string;
  required?: boolean;
  schema: Schema;
  example: any;
};
module Parameter {
  export function is(o: any, path: string[]): o is Parameter {
    const t = new Test("Parameter.is", path);
    return t.test(
      Is.layout<Parameter>(
        o,
        {
          in: Is.strict<"query">("query"),
          name: Is.string,
          description: Is.string,
          required: Is.or(Is.undefined, Is.boolean),
          schema: Schema.is,
          example: Is.any,
        },
        path
      )
    );
  }
}

type RequestBody = {
  required: boolean;
  content: RequestBody.Content;
};
module RequestBody {
  export type Content = {
    "application/x-www-form-urlencoded": Content.URLEncoded;
  };
  export module Content {
    export type URLEncoded = {
      schema: Schema.Obj;
    };
    export module URLEncoded {
      export function is(o: any, path: string[]): o is URLEncoded {
        const t = new Test("RequestBody.Content.URLEncoded.is", path);
        return t.test(
          Is.layout<URLEncoded>(
            o,
            {
              schema: Schema.Obj.is,
            },
            path
          )
        );
      }
    }

    export function is(o: any, path: string[]): o is Content {
      const t = new Test("RequestBody.Content.is", path);
      return t.test(
        Is.layout<Content>(
          o,
          {
            "application/x-www-form-urlencoded": URLEncoded.is,
          },
          path
        )
      );
    }
  }
  export function is(o: any, path: string[]): o is RequestBody {
    const t = new Test("RequestBody.Content.is", path);
    return t.test(
      Is.layout<RequestBody>(
        o,
        {
          required: Is.boolean,
          content: Content.is,
        },
        path
      )
    );
  }
}

type QueryInfo = {
  summary: string;
  "x-summary"?: string;
  description?: string;
  operationId: string;
  tags: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: {
    200: Response;
  };
  security?: any[];
  "x-codeSamples": any[];
};
module QueryInfo {
  export type Responses = {
    200: Response;
  };
  export module Responses {
    export function is(o: any, path: string[]): o is Responses {
      const t = new Test("Responses.is", path);
      return t.test(
        Is.layout<Responses>(
          o,
          {
            200: Response.is,
          },
          path
        )
      );
    }
  }
  export function is(o: any, path: string[]): o is QueryInfo {
    const t = new Test("QueryInfo.is", path);
    return t.test(
      Is.layout<QueryInfo>(
        o,
        {
          summary: Is.string,
          "x-summary": Is.or(Is.undefined, Is.string),
          description: Is.or(Is.undefined, Is.string),
          tags: Is.array(Is.string),
          operationId: Is.string,
          parameters: Is.or(Is.undefined, Is.array(Parameter.is)),
          requestBody: Is.or(Is.undefined, RequestBody.is),
          responses: Responses.is,
          security: Is.or(Is.undefined, Is.array(Is.any)),
          "x-codeSamples": Is.array(Is.any),
        },
        path
      )
    );
  }
}

type RestSpecification = RestSpecification.Get | RestSpecification.Post;

module RestSpecification {
  export type Get = {
    get: QueryInfo;
  };
  export module Get {
    export function is(o: any, path: string[]): o is Get {
      const t = new Test("RestSpecification.Get.is", path);
      return t.test(
        Is.layout<Get>(
          o,
          {
            get: QueryInfo.is,
          },
          path
        )
      );
    }
  }

  export type Post = {
    post: QueryInfo;
  };
  export module Post {
    export function is(o: any, path: string[]): o is Post {
      const t = new Test("RestSpecification.Post.is", path);
      return t.test(
        Is.layout<Post>(
          o,
          {
            post: QueryInfo.is,
          },
          path
        )
      );
    }
  }

  export function is(o: any, path: string[]): o is RestSpecification {
    const t = new Test("RestSpecification.is", path);
    return t.test(Is.or(Get.is, Post.is)(o, path));
  }
}

type Paths = {
  [requestPath: string]: RestSpecification;
};
module Paths {
  export function is(o: any, path: string[]): o is Paths {
    const t = new Test("Paths.is", path);
    return t.test(Is.dict(RestSpecification.is)(o, path));
  }
}

// loosely-typed specification (from SPECS_PATH)
// (no assertions on other properties; we only care about paths)
type Specification = {
  paths: Paths;
};
module Specification {
  export function is(o: any, path: string[]): o is Specification {
    const t = new Test("Specification.is", path);
    if (!o.hasOwnProperty("paths") || !(o.paths instanceof Object)) return t.fail();
    return t.test(Paths.is(o.paths, [...path, "paths"]));
  }
}

/*                       Specification object loading, types, and assertions }*/

function toCamel(str: string): string {
  if (str.toUpperCase() === str) {
    return str.toLowerCase();
  } else {
    return str[0].toLowerCase() + str.slice(1);
  }
}

// turn a non-alpha_numeric string to a quoted string
function quoteNonAlpha(str: string): string {
  if (str.match(/^[a-zA-Z0-9_]*$/gm)) return str;
  else return `"${str}"`;
}

// adds folding markers after the first and before the last curly brace
function foldObj(str: string): string {
  if (str.includes("{") && str.includes("}")) {
    return (
      str.slice(0, str.indexOf("{")) +
      "{\n  /*· {*/\n" +
      str.slice(str.indexOf("{") + 1, str.lastIndexOf("}")) +
      "\n  /*· }*/\n}" +
      str.slice(str.lastIndexOf("}") + 1)
    );
  } else {
    return str;
  }
}

// convert a schema to a TS type string.
// for Obj schemas:
//   creates a layout with comments from description and example.
//   properties that are not explicitly required are marked as optional.
function toTSType(schema: Schema, path: string[], nullifyOptional: boolean): string {
  if (Schema.Obj.is(schema, path)) {
    function genComment(v: Schema, k?: string): string {
      const components: string[] = [];
      if (v.description) components.push(v.description);
      if (Schema.Arr.is(v, [...path, "properties"].concat(k ? [k] : [])) && v.items.description)
        components.push(v.items.description);
      if (v.deprecated) components.push("@deprecated");
      else if (Schema.Arr.is(v, [...path, "properties"].concat(k ? [k] : [])) && v.items.deprecated)
        components.push("@deprecated");
      if (v.default) components.push(`@default ${JSON.stringify(v.default)}`);
      else if (Schema.Arr.is(v, [...path, "properties"].concat(k ? [k] : [])) && v.items.default)
        components.push(`@default ${JSON.stringify(v.items.default)}`);
      if (v.example) components.push(`@example ${JSON.stringify(v.example)}`);
      else if (Schema.Arr.is(v, [...path, "properties"].concat(k ? [k] : [])) && v.items.example)
        components.push(`@example ${JSON.stringify(v.items.example)}`);
      else if (Schema.Arr.is(v, [...path, "properties"].concat(k ? [k] : [])))
        if (Schema.Arr.is(v.items, [...path, "properties"].concat(k ? [k, "items"] : ["items"])))
          components.push(`@example [${JSON.stringify(v.items.items.example)}]`);
      if (!components.map((x) => x.trim()).filter((x) => x).length) return "";
      return (
        "/**\n" +
        (
          components
            .map((x) =>
              x
                .split("\n")
                .map((y) => ` * ${y}`)
                .join("\n")
            )
            .join(".\n") + ".\n */"
        )
          .replace(/^ \* \./gm, " *")
          .replace(/([^\.])\.\.([^\.])/, "$1.$2")
          .replace(/\n\n+/g, "\n")
          .split("\n")
          .filter((x) => x.trim() !== "*")
          .join("\n")
      );
    }
    function fromProperties(
      sch: Schema.Obj,
      schprops: Exclude<Schema.Obj["properties"], undefined>
    ) {
      const props: {
        [name: string]: {
          type: string;
          comment: string;
          required: boolean;
        };
      } = {};
      for (const [k, v] of Object.entries(schprops) as [string, Schema][]) {
        props[k] = {
          type: toTSType(v, [...path, "properties", k], nullifyOptional)
            .trim()
            .split("\n")
            .map((x, i) => (i > 0 ? "  " + x : x))
            .join("\n"),
          // includes block comment chars
          comment: genComment(v, k),
          required: (() => {
            if (v.nullable) return false;
            if (sch.required && sch.required.includes(k)) return true;
            return false;
          })(),
        };
      }
      if (Object.keys(props).length === 0) return "{}";
      let strout = "{\n  ";
      for (const [k, v] of Object.entries(props)) {
        if (v.comment)
          strout += `${v.comment
            .trim()
            .split("\n")
            .map((x, i) => `${i > 0 ? "  " : ""}${x}`)
            .join("\n")}\n  `;
        if (nullifyOptional) {
          if (v.required) strout += `${quoteNonAlpha(k)}: ${v.type + ";\n  "}`;
          else strout += `${quoteNonAlpha(k)}?: ${"( " + v.type + " ) | null" + ";\n  "}`;
        } else {
          if (v.required) strout += `${quoteNonAlpha(k)}: ${v.type + ";\n  "}`;
          else strout += `${quoteNonAlpha(k)}?: ${v.type + ";\n  "}`;
        }
      }
      strout = strout.slice(0, -2) + "}";
      return strout;
    }

    if (schema.additionalProperties) {
      const dict = (() => {
        const comment = genComment(schema) || genComment(schema.additionalProperties);
        return `{\n  ${
          comment
            ? comment
                .split("\n")
                .map((x, i) => (i > 0 ? `  ${x}` : x))
                .join("\n") + "\n  "
            : ""
        }[${
          schema.additionalProperties["x-additionalPropertiesName"] || "key"
        }: string]: ${toTSType(schema.additionalProperties, path, nullifyOptional)
          .trim()
          .split("\n")
          .map((x, i) => (i > 0 ? "  " + x : x))
          .join("\n")}\n}`;
      })();
      if (schema.properties) {
        return dict + " & " + fromProperties(schema, schema.properties);
      } else {
        return dict;
      }
    } else if (schema.properties) {
      return fromProperties(schema, schema.properties);
    } else {
      throw new Error(
        "expected either additionalProperties or properties or both for an object schema. Path: " +
          path.join(" ")
      );
    }
  } else if (Schema.Arr.is(schema, path)) {
    return `Array<${toTSType(schema.items, [...path, "items"], nullifyOptional)}>`;
  } else if (Schema.ArrItems.is(schema, path)) {
    if (schema.allOf && schema.oneOf)
      throw new Error(
        "ArrItems has both allOf and oneOf specifications... this doesn't make sense. path: " +
          path.join(" ")
      );
    if (schema.oneOf) {
      return (
        "( " +
        Array.from(
          new Set(
            schema.oneOf.map((x, i) => toTSType(x, [...path, "oneOf", "" + i], nullifyOptional))
          )
        ).join(" | ") +
        " )"
      );
    } else if (schema.allOf) {
      return (
        "( " +
        Array.from(
          new Set(
            schema.allOf.map((x, i) => toTSType(x, [...path, "allOf", "" + i], nullifyOptional))
          )
        ).join(" & ") +
        " )"
      );
    } else {
      if (schema.type === "string") {
        if ((<Schema.Str>schema).format === "binary") return "Buffer";
        else return "string";
      } else if (schema.type === "number" || schema.type === "integer") {
        return "number";
      } else if (schema.type === "boolean") {
        return "boolean";
      } else if (schema.type === "null") {
        return "null";
      } else {
        return "any";
      }
    }
    // return `Array<${toTSType(schema., [...path, "items"])}>`;
  } else if (Schema.Bool.is(schema, path)) {
    return "boolean";
  } else if (Schema.Str.is(schema, path)) {
    if (schema.format === "binary") return "Buffer";
    else return "string";
  } else if (Schema.StrEnum.is(schema, path)) {
    return "string";
  } else if (Schema.Num.is(schema, path)) {
    return "number";
  } else if (Schema.BoundNum.is(schema, path)) {
    return "number";
  } else if (Schema.NumEnum.is(schema, path)) {
    return "number";
  } else if (Schema.Null.is(schema, path)) {
    return "null";
  } else if (Schema.Any.is(schema, path)) {
    return "any";
  } else {
    throw new Error(
      "Internal error; schema type. This should have been checked recursively at the beginning of main."
    );
  }
}

// Generates a method signature and response type from a given request path.
function genMethod(restPath: string, info: QueryInfo, specPath: string[]): [string, string] {
  const priv: boolean = !!restPath.match("private");
  const responseName: string = restPath.slice(priv ? 9 : 8).replace(/\//g, "");
  const name: string = toCamel(restPath.slice(priv ? 9 : 8).replace(/\//g, ""));
  // const responseName: string = restPath.slice(priv ? 9 : 8).replace(/\//g, "");
  const isUTF8 = ResponseContent.JSON.is(info.responses["200"].content, [
    ...specPath,
    "responses",
    "200",
    "content",
  ]);

  // prepare an Obj schema to stringize options using toTSType
  const schout: Required<Pick<Schema.Obj, "type" | "properties" | "required">> = {
    type: "object",
    properties: {},
    required: [],
  };

  // get the options from the parameters property, if it exists
  if (info.parameters) {
    for (let i = 0; i < info.parameters.length; ++i) {
      const param = info.parameters[i];
      // skip nonce
      if (param.name === "nonce") continue;
      const sch = { ...param.schema };
      // if the parameter has an explicit description, use it instead
      if (param.description) sch.description = param.description;
      // if the parameter has an explicit example, use it instead
      if (param.example) sch.example = param.example;
      schout.properties[param.name] = sch;
      if (param.required && param.name !== "nonce") schout.required.push(param.name);
    }
  }

  // get the options from the requestBody property, if it exists
  if (info.requestBody) {
    const schema = info.requestBody.content["application/x-www-form-urlencoded"].schema;
    if (schema.additionalProperties)
      throw new Error(
        "wasn't expecting additionalProperties here... " + [...specPath, "requestBody"].join(" ")
      );
    if (schema.required) {
      const newRequired = new Set([...schout.required, ...schema.required]);
      newRequired.delete("nonce");
      schout.required = [...newRequired];
    }
    if (schema.properties) {
      // requestBody descriptions should overwrite parameters descriptions
      for (const [prop, sch] of Object.entries(schema.properties) as [string, Schema][]) {
        // skip nonce
        if (prop === "nonce") continue;
        // store the property schema
        schout.properties[prop] = sch;
      }
    } else {
      throw new Error("expected properties here: " + [...specPath, "requestBody"].join(" "));
    }
  }

  // generate the response type
  const contentPath = [...specPath, "responses", "200", "content"];
  const responseContent = (() => {
    const content = info.responses["200"].content;
    if (ResponseContent.JSON.is(content, contentPath)) {
      return content["application/json"];
    } else if (ResponseContent.OctetStream.is(content, contentPath)) {
      return {
        schema: {
          type: "string",
          format: "binary",
        },
      } as ResponseContent.Details;
    } else {
      throw new Error(
        "Internal Error: invalid ResponseContent type. This should have been checked recursively at the beginning of main."
      );
    }
  })();

  const responseComment = (() => {
    const schema = responseContent.schema;
    const commentComponents = [];
    if (schema.title) commentComponents.push(schema.title);
    if (schema.description) commentComponents.push(schema.description);
    if (schema.deprecated) commentComponents.push("@deprecated");
    if (schema.example)
      if (schema.example.result)
        commentComponents.push(`@example ${JSON.stringify(schema.example.result)}`);
      else commentComponents.push(`@example ${JSON.stringify(schema.example)}`);
    if (responseContent.example)
      if (responseContent.example.result)
        commentComponents.push(`@example ${JSON.stringify(responseContent.example.result)}`);
      else commentComponents.push(`@example ${JSON.stringify(responseContent.example)}`);
    if (responseContent.examples)
      if (responseContent.examples.result)
        commentComponents.push(`@example ${JSON.stringify(responseContent.examples.result)}`);
      else commentComponents.push(`@example ${JSON.stringify(responseContent.examples)}`);
    return commentComponents.length
      ? "/**\n" +
          commentComponents
            .join("\n")
            .split("\n")
            .map((x) => " * " + x)
            .join("\n") +
          "\n */\n"
      : "";
  })();

  const responseType = (() => {
    const schema = responseContent.schema;
    if (Schema.Obj.is(schema, [...contentPath, "*", "schema"]) && schema.properties?.result) {
      return (
        "\n" +
        foldObj(
          toTSType(
            schema.properties.result,
            [...contentPath, "*", "schema", "properties", "result"],
            true
          )
        )
      );
    } else {
      return "\n" + foldObj(toTSType(responseContent.schema, [...contentPath, "*"], true));
    }
  })();

  // gen comment

  const comment =
    "/**\n" +
    (info.description || info.summary || info["x-summary"] || "")
      .split("\n")
      .map((x) => " * " + x)
      .filter((x) => x.trim() !== "*")
      .join("\n") +
    "\n */\n";
  const opts = toTSType(schout, [...specPath, "*"], false);
  const body = `{\n  return this.request("${restPath.slice(priv ? 9 : 8)}"${
    priv
      ? isUTF8
        ? opts === "{}"
          ? ', null, "private"'
          : ', options, "private"'
        : opts === "{}"
        ? ', null, "private", "binary"'
        : ', options, "private", "binary"'
      : isUTF8
      ? opts === "{}"
        ? ""
        : ", options"
      : opts == "{}"
      ? ', null, "public", "binary"'
      : ', options, "public", "binary"'
  });\n}`;

  const types =
    responseComment +
    `export type ${responseName} = ${responseType};` +
    "\n" +
    `export module ${responseName} {\n  export type Options = Exclude<FirstParam<Kraken["${name}"]>, undefined>;\n}`;

  if (opts == "{}")
    return [comment + `public ${name}(): Promise<Kraken.${responseName}> ${body}`, types];
  else {
    if (schout.required.length === 0) {
      return [
        comment + `public ${name}(options?: ${foldObj(opts)}): Promise<Kraken.${responseName}> ${body}`,
        types,
      ];
    } else {
      return [
        comment + `public ${name}(options: ${foldObj(opts)}): Promise<Kraken.${responseName}> ${body}`,
        types,
      ];
    }
  }
}

function main() {
  try {
    const json = loadSpecs();
    // recursively check all properties for expected types
    if (!Specification.is(json, []))
      throw new Error("Unexpected specifications type; check output for the deepest failed test");
    const methodsAndResponses: [string, string][] = [];
    for (const [restPath, restSpec] of Object.entries(json.paths)) {
      if (RestSpecification.Get.is(restSpec, ["paths", restPath])) {
        methodsAndResponses.push(genMethod(restPath, restSpec.get, ["paths", restPath, "get"]));
      } else if (RestSpecification.Post.is(restSpec, ["paths", restPath])) {
        methodsAndResponses.push(genMethod(restPath, restSpec.post, ["paths", restPath, "post"]));
      } else {
        throw new Error(
          "Internal error; unexpected rest specification type. This should have been checked recursively at the beginning of main."
        );
      }
    }

    const methodBody = methodsAndResponses.map((x) => x[0]).join("\n\n");
    const typesBody = methodsAndResponses.map((x) => x[1]).join("\n\n");

    // read the api
    const apiData = fs.readFileSync(apiPath, "utf8");

    // backup the api
    fs.writeFileSync(backupPath, apiData);

    // make modifications
    fs.writeFileSync(
      apiPath,
      apiData
        .replace(
          /(  \/\* {64}REST API \{\*\/\n\n)[\s\S]+?(\n\n  \/\* {64}REST API \}\*\/)/,
          `$1${methodBody
            .split("\n")
            .map((x) => "  " + x)
            .join("\n")}$2`
        )
        .replace(
          /(  \/\* {62}REST Types \{\*\/\n\n)[\s\S]+?(\n\n  \/\* {62}REST Types \}\*\/)/,
          `$1${typesBody
            .split("\n")
            .map((x) => "  " + x)
            .join("\n")}$2`
        )
    );

    console.log(
      "Replacements made! Check the file for syntax errors and run tests. Backup located at " +
        backupPath
    );
  } catch (e) {
    const maxlen = Test.outputStack.reduce((a, v) => (a > v[0].length ? a : v[0].length), 0);

    for (let i = 0; i < Test.outputStack.length; ++i) {
      const [descr, path] = Test.outputStack[Test.outputStack.length - 1 - i];
      // stop once a top-level descr is a pass
      if (descr.slice(0, PASS.length) === PASS) {
        console.log("...");
        break;
      }
      console.log(
        descr +
          Array(maxlen - descr.length)
            .fill(" ")
            .join("") +
          path
      );
    }
    throw e;
  }
}

main();

// vim: fdm=marker:fmr=\ {*/,\ }*/
