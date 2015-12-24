/*!
 * index.js
 * Created by Kilian Ciuffolo on Dec 23, 2015
 * (c) 2015 Kilian Ciuffolo
 */

import co from 'co'

export default function coMiddleware ({ dispatch, getState }) {
  return next => action => {
    return typeof action === 'function'
      ? co(action, dispatch, getState)
      : next(action)
  }
}
