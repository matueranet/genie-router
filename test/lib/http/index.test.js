const assert = require('assert')
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const noop = require('../../../lib/utils/noop')

describe('http()', function () {
  let expressStub = null
  let bodyParserStub = null
  let http = null

  beforeEach(function () {
    expressStub = sinon.stub()
    bodyParserStub = sinon.stub()
    http = proxyquire('../../../lib/http/index.js', {express: expressStub, 'body-parser': {json: bodyParserStub}})
  })

  it('should be a function', function () {
    assert.ok(typeof http === 'function')
  })

  it('should return a promise', function () {
    //set up Express mock
    expressStub.returns({listen: noop, use: noop})

    //Run test
    let promise = http({port: 80})
    assert.ok(
      typeof promise.then === 'function' &&
      typeof promise.catch === 'function'
    )
  })

  it('should initialize express and bodyparser', function () {
    //set up Express mock
    const listenSpy = sinon.spy()
    const useSpy = sinon.spy()
    expressStub.returns({listen: listenSpy, use: useSpy})

    let promise = http({port: 80})
    return promise.then(() => {
      assert.ok(bodyParserStub.alwaysCalledWithExactly({type: 'application/json'}))
      assert.ok(listenSpy.calledOnce)
      assert.ok(listenSpy.alwaysCalledWith(80))
      assert.ok(useSpy.calledOnce)
    })
  })

  it('should immediately return app when already initialized', function () {
    //set up Express mock
    const listenSpy = sinon.spy()
    const useSpy = sinon.spy()
    expressStub.returns({listen: listenSpy, use: useSpy})

    return http({port: 80})
      .then(function (app) {
        //call http again and assert that the expressStub is only invoked once.
        http()
          .then(function (app2) {
            assert.deepEqual(app, app2)
            assert.ok(useSpy.calledOnce)
          })
      })
  })
})