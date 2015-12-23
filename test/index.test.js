/*!
 * index.test.js
 * Created by Kilian Ciuffolo on Dec 23, 2015
 * (c) 2015 Kilian Ciuffolo
 */

import { assert } from 'chai'
import coMiddleware from '../src/index'

describe('thunk middleware', () => {
  const dispatch = () => {}
  const getState = () => {}

  const nextHandler = coMiddleware({ dispatch, getState })

  it('must return a function to handle next', () => {
    assert.isFunction(nextHandler)
    assert.strictEqual(nextHandler.length, 1)
  })

  describe('handle next', () => {
    it('must return a function to handle action', () => {
      const actionHandler = nextHandler()

      assert.isFunction(actionHandler)
      assert.strictEqual(actionHandler.length, 1)
    })

    describe('handle action', () => {
      it('must run the given action function with dispatch and getState', (done) => {
        const actionHandler = nextHandler()

        actionHandler(function * (_dispatch, _getState) {
          assert.strictEqual(dispatch, _dispatch)
          assert.strictEqual(getState, _getState)
          done()
        })
      })

      it('must pass action to next if not a generator', () => {
        const expected = () => null

        const actionHandler = nextHandler((action) => {
          assert.strictEqual(action, expected)
        })

        actionHandler(expected)
      })

      it('must return the return value of next if not a generator', () => {
        const expected = 'redux'
        const actionHandler = nextHandler(() => () => expected)

        let outcome = actionHandler()
        assert.strictEqual(outcome, expected)
      })

      it('must return value as expected if a generator', () => {
        const expected = 'rocks'
        const actionHandler = nextHandler()

        let outcome = actionHandler(function * () {
          yield function (done) { setTimeout(done, 100) }
          return expected
        })
        assert.strictEqual(outcome, expected)
      })

      it('must be invoked synchronously if a generator', () => {
        const actionHandler = nextHandler()
        let mutated = 0

        actionHandler(function * () {
          return mutated++
        })
        assert.strictEqual(mutated, 1)
      })
    })
  })

  describe('handle errors', () => {
    it('must throw if argument is non-object', done => {
      try {
        coMiddleware()
      } catch(err) {
        done()
      }
    })
  })
})
