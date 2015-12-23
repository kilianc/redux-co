/*!
 * index.js
 * Created by Kilian Ciuffolo on Dec 23, 2015
 * (c) 2015 Kilian Ciuffolo
 */

import co from 'co'
import isGeneratorFunction from 'is-generator-function'

export default function coMiddleware ({ dispatch, getState }) {
  return next => action => {
    return isGeneratorFunction(action)
      ? co(action)(dispatch, getState)
      : next(action)
  }
}
