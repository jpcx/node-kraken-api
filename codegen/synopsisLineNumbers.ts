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
//         This script attaches line numbers to the README synopsis.          //
//                                                                            //
// Note: There is very little syntax matching;                                //
//       if the project significantly changes then this may need an update.   //
//----------------------------------------------------------------------------//

import * as fs from "fs";
import * as path from "path";

const readmePath = path.join(__dirname, "../../README.md");
const apiPath = path.join(__dirname, "../../index.ts");
const backupPath = path.join(__dirname, "../.build/~README.md.synposisLineNumbers.bak");
const packageJSONPath = path.join(__dirname, "../../package.json")

const METHODS_REGEX = /^### Methods\n\n([\s\S]*?)\n\n/m;
const PROPERTIES_REGEX = /^### Properties\n\n([\s\S]*?)\n\n/m;
const CLASSES_REGEX = /^### Classes\n\n([\s\S]*?)\n\n/m;

const version = require(packageJSONPath).version
if (!version) throw new Error("could not find package.json version")

const readmeContent = fs.readFileSync(readmePath, "utf8");
const methodsContent = readmeContent.match(METHODS_REGEX)![1];
const propertiesContent = readmeContent.match(PROPERTIES_REGEX)![1];
const classesContent = readmeContent.match(CLASSES_REGEX)![1];
const apiContent = fs.readFileSync(apiPath, "utf8");

function findRESTPropertyLineNumber(propname: string): number {
  const spl = apiContent.split("\n");
  for (let i = 0; i < spl.length; ++i) {
    if (spl[i].match(new RegExp(`^  public (?:readonly )?${propname}\\b`, "m"))) return i + 1;
  }
  throw new Error("could not find line number for property " + propname);
}

function findWSPropertyLineNumber(propname: string): number {
  const name = propname.replace(/^ws\./m, "")
  const spl = apiContent.split("\n");
  for (let i = 0; i < spl.length; ++i) {
    if (spl[i].match(new RegExp(`^    public (?:readonly )?${name}\\b`, "m"))) return i + 1;
  }
  throw new Error("could not find line number for property " + propname);
}

function findExportedClassLineNumber(name: string, fullname?: string): number {
  const spl = apiContent.split("\n");
  for (let i = 0; i < spl.length; ++i) {
    if (spl[i].match(new RegExp(`^ *export class ${name}\\b`, "m"))) return i + 1;
  }
  throw new Error("could not find line number for class " + fullname);
}

let newMethodsContent = "";
let newPropertiesContent = "";
let newClassesContent = "";

for (const ln of methodsContent.split("\n")) {
  const matches = ln.match(/^- \[?`\.([a-zA-Z\.]+)(\b.*)?`/m)!;
  const propname = matches[1];
  const doctext = `.${propname}${matches[2]}`;
  const line = (() => {
    if (!propname.match(/^ws\./m)) {
      return findRESTPropertyLineNumber(propname);
    } else {
      return findWSPropertyLineNumber(propname);
    }
  })();
  newMethodsContent += `- [\`${doctext}\`](https://github.com/jpcx/node-kraken-api/blob/${version}/index.ts#L${line})\n`;
}

for (const ln of propertiesContent.split("\n")) {
  const matches = ln.match(/^- \[?`\.([a-zA-Z\.]+)(\b.*)?`/m)!;
  const propname = matches[1];
  const doctext = `.${propname}${matches[2] || ''}`;
  const line = (() => {
    if (!propname.match(/^ws\./m)) {
      return findRESTPropertyLineNumber(propname);
    } else {
      return findWSPropertyLineNumber(propname);
    }
  })();
  newPropertiesContent += `- [\`${doctext}\`](https://github.com/jpcx/node-kraken-api/blob/${version}/index.ts#L${line})\n`;
}

for (const ln of classesContent.split("\n")) {
  const matches = ln.match(/^- \[?`([a-zA-Z\.]+)(\b.*)?`/m)!;
  const propname = matches[1];
  const doctext = `${propname}${matches[2] || ''}`;
  const line = (() => {
    if (!propname.match(/^Kraken\./m)) {
      return findExportedClassLineNumber(propname);
    } else if (!propname.match(/^Kraken\.WS\./m)) {
      return findExportedClassLineNumber(propname.replace(/^Kraken\./m, ""), propname);
    } else {
      return findExportedClassLineNumber(propname.replace(/^Kraken\.WS\./m, ""), propname);
    }
  })();
  newClassesContent += `- [\`${doctext}\`](https://github.com/jpcx/node-kraken-api/blob/${version}/index.ts#L${line})\n`;
}

fs.writeFileSync(backupPath, apiContent, "utf8");
fs.writeFileSync(
  readmePath,
  readmeContent
    .replace(METHODS_REGEX, `### Methods\n\n${newMethodsContent.trim()}\n\n`)
    .replace(PROPERTIES_REGEX, `### Properties\n\n${newPropertiesContent.trim()}\n\n`)
    .replace(CLASSES_REGEX, `### Classes\n\n${newClassesContent.trim()}\n\n`)
);

console.log(
  "Changes made! Verify the readme. Backup located at /" +
    path.relative(path.join(__dirname, "../../"), backupPath)
);
