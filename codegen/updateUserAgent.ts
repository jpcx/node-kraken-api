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

//----------------------------------------------------------------------------//
//        This script sets the hostname version given the current tag.        //
//----------------------------------------------------------------------------//

import * as path from "path";
import * as fs from "fs";

const apiPath = path.join(__dirname, "../../index.ts");
const backupPath = path.join(__dirname, "../~index.ts.updateUserAgent.bak");
const packageJSONPath = path.join(__dirname, "../../package.json")

const version = require(packageJSONPath).version
if (!version) throw new Error("could not find package.json version")

const apiContent = fs.readFileSync(apiPath, "utf8");

const matcher = /^(export const _USER_AGENT = "node-kraken-api\/)[a-zA-Z0-9-.]+(";)$/m;

if (!apiContent.match(matcher)) throw new Error("could not find user agent constant");

fs.writeFileSync(backupPath, apiContent, "utf8");
fs.writeFileSync(apiPath, apiContent.replace(matcher, `$1${version}$2`), "utf8");

console.log("replacement made! check the file for errors. backup located at " + backupPath);
