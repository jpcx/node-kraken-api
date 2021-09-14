#!/bin/bash
# *** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  #
# **                                                                           #
# *                _          _              _                              _  #
#  _ __   ___   __| | ___    | | ___ __ __ _| | _____ _ __       __ _ _ __ (_) #
# | '_ \ / _ \ / _` |/ _ \___| |/ / '__/ _` | |/ / _ \ '_ \ ___ / _` | '_ \| | #
# | | | | (_) | (_| |  __/___|   <| | | (_| |   <  __/ | | |___| (_| | |_) | | #
# |_| |_|\___/ \__,_|\___|   |_|\_\_|  \__,_|_|\_\___|_| |_|    \__,_| .__/|_| #
#                                                                    |_|       #
#                 @link http://github.com/jpcx/node-kraken-api                 #
#                                                                              #
#  @license MIT                                                                #
#  @copyright 2018-2021 @author Justin Collier <m@jpcx.dev>                    #
#                                                                              #
#  Permission is hereby granted, free of charge, to any person obtaining a     #
#  copy of this software and associated documentation files (the "Software"),  #
#  to deal in the Software without restriction, including without limitation   #
#  the rights to use, copy, modify, merge, publish, distribute, sublicense,    #
#  and/or sell copies of the Software, and to permit persons to whom the       #
#  Software is furnished to do so, subject to the following conditions:        #
#                                                                              #
#  The above copyright notice and this permission notice shall be included     #
#  in all copies or substantial portions of the Software.                      #
#                                                                              #
#  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  #
#  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,    #
#  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL     #
#  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  #
#  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING     #
#  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER       * #
#  DEALINGS IN THE SOFTWARE.                                                ** #
#  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *** #

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

node $SCRIPT_DIR/.build/restMethods.js
node $SCRIPT_DIR/.build/updateUserAgent.js

if ! hash prettier 2>/dev/null
then
    echo "'prettier' was not found in PATH. This is okay, but ideally prettier should be run after restMethods and before synposisLineNumbers"
else
  prettier $SCRIPT_DIR/../index.ts -w
fi

node $SCRIPT_DIR/.build/synopsisLineNumbers.js
node $SCRIPT_DIR/.build/updateRemainingVersions.js
