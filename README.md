# `redux-co`

[![js-standard-style](https://img.shields.io/badge/code%20style-Standard-green.svg?style=flat-square)](https://github.com/feross/standard)
[![build status](https://img.shields.io/wercker/ci/567b8fc61e29124443086121.svg?style=flat-square)](https://app.wercker.com/#applications/567b8fc61e29124443086121)
[![coverage](https://img.shields.io/codeclimate/coverage/github/kilianc/redux-co.svg?style=flat-square)](https://codeclimate.com/github/kilianc/redux-co/coverage)
![dependencies](https://img.shields.io/david/kilianc/redux-co.svg?style=flat-square)
[![npm version](https://img.shields.io/npm/v/redux-co.svg?style=flat-square)](https://www.npmjs.com/package/redux-co)
[![npm downloads](https://img.shields.io/npm/dm/redux-co.svg?style=flat-square)](https://www.npmjs.com/package/redux-co)
[![License](https://img.shields.io/npm/l/redux-co.svg?style=flat-square)](https://www.npmjs.com/package/redux-co)

## [cojs](https://github.com/tj/co) [middleware](http://rackt.github.io/redux/docs/advanced/Middleware.html) for Redux.

`redux-co` is a drop-in replacement for [redux-thunk](https://github.com/gaearon/redux-thunk) *(and indeed passes its [test suite](kilianc/redux-co/blob/master/test/index.js))*. It's meant to support async actions through *yieldables* as well as plain [thunk](https://en.wikipedia.org/wiki/Thunk) functions.

    $ npm i --save-dev redux-co

## Motivation

> Redux Thunk [middleware](https://github.com/rackt/redux/blob/master/docs/advanced/Middleware.md) allows you to write action creators that return a function instead of an action. The thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met. The inner function receives the store methods `dispatch` and `getState()` as parameters.

> *[... read more at redux-thunk](https://github.com/gaearon/redux-thunk#motivation)*

## Usage

Then, to enable `redux-co`, use [`applyMiddleware()`](http://rackt.github.io/redux/docs/api/applyMiddleware.html):

```js
// store.js

import { createStore, applyMiddleware } from 'redux'
import coMiddleware from 'redux-co'
import rootReducer from './reducers/index'

// create a store that has redux-co middleware enabled
const createStoreWithMiddleware = applyMiddleware(
  coMiddleware
)(createStore)

export default createStoreWithMiddleware(rootReducer)

```

```js
// actions.js

import { createAction } from 'redux-actions'
import github from './lib/github'

export const types = {
  USER_PROFILE_REQUEST: 'USER_PROFILE_REQUEST',
  USER_PROFILE_RECEIVE: 'USER_PROFILE_RECEIVE',
  SOMETHING_ELSE: 'SOMETHING_ELSE'
}

export const actions = {
  fetchUserProfile: createFetchUserProfileAction,
  requestUserProfile: createAction(types.USER_PROFILE_REQUEST),
  receiveUserProfile: createAction(types.USER_PROFILE_RECEIVE),
  somethingElse: createAction(types.SOMETHING_ELSE)
}

// we can dispatch multiple actions in the right order with
// sublime flow control. We are yielding a promise returned
// by our github api wrapper.
function createFetchUserProfileAction (username) {
  return function * (dispatch) {
    dispatch(actions.requestUserProfile(username))

    try {
      let data = yield github.getUserProfile(username)
      dispatch(actions.receiveUserProfile(data))
    } catch (err) {
      dispatch(actions.receiveUserProfile(err))
    }

    dispatch(actions.somethingElse())
  }
}

// we still support thunks!
function createFetchUserProfileAction (username) {
  return function (dispatch) {
    dispatch(actions.requestUserProfile(username))

    return github.getUserProfile(username)
      .then((data) => dispatch(actions.receiveUserProfile(data)))
      .catch((err) => dispatch(actions.receiveUserProfile(err)))
      .then(() => dispatch(actions.somethingElse()))
  }
}

```

The above examples achieve the same result using both thunks and generators, but being generators backed up by [cojs](https://github.com/tj/co) allows us to yield [*all the things!*](https://github.com/tj/co#yieldables)

## Composition

> Any return value from the inner function will be available as the return value of `dispatch` itself. This is convenient for orchestrating an asynchronous control flow with thunk action creators dispatching each other and returning Promises to wait for each other’s completion.

> *[... read more at redux-thunk](https://github.com/gaearon/redux-thunk#composition)*

# How to contribute

This project follows the awesome [Vincent Driessen](http://nvie.com/about/) [branching model](http://nvie.com/posts/a-successful-git-branching-model/).

* You must add a new feature on its own branch
* You must contribute to hot-fixing, directly into the master branch (and pull-request to it)

This project uses [standardjs](https://github.com/feross/standard) to enforce a consistent code style. Your contribution must be pass standard validation.

The test suite is written on top of [mochajs/mocha](http://mochajs.org/). Use the tests to check if your contribution breaks some part of the library and be sure to add new tests for each new feature.

    $ npm test

## License

_This software is released under the MIT license cited below_.

    Copyright (c) 2015 Kilian Ciuffolo, me@nailik.org. All Rights Reserved.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the 'Software'), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
