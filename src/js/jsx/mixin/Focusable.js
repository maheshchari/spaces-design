/*
 * Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

define(function (require, exports, module) {
    "use strict";

    var ReactDOM = require("react-dom"),
        React = require("react");

    var OS = require("adapter").os;

    var log = require("js/util/log");

    module.exports = {
        propTypes: {
            acquireFocusOnMouseDown: React.PropTypes.bool
        },

        getDefaultProps: function () {
            return {
                acquireFocusOnMouseDown: true // If false, will not install mousedown listeners
            };
        },
        
        /** @ignore */
        acquireFocus: function () {
            return OS.acquireKeyboardFocus()
                .catch(function (err) {
                    var message = err instanceof Error ? (err.stack || err.message) : err;

                    log.error("Failed to acquire keyboard focus:", message);
                });
        },
        /** @ignore */
        releaseFocus: function () {
            return OS.releaseKeyboardFocus()
                .bind(this)
                .catch(function (err) {
                    var message = err instanceof Error ? (err.stack || err.message) : err;

                    log.error("Failed to release keyboard focus on reset:", message);
                });
        },
        componentDidMount: function () {
            if (this.props.acquireFocusOnMouseDown) {
                ReactDOM.findDOMNode(this).addEventListener("mousedown", this.acquireFocus);
            }
        },
        componentWillUnmount: function () {
            if (this.props.acquireFocusOnMouseDown) {
                ReactDOM.findDOMNode(this).removeEventListener("mousedown", this.acquireFocus);
            }
        }
    };
});
