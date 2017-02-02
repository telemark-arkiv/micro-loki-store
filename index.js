'use strict'

const os = require('os')
const readFileSync = require('fs').readFileSync
const Loki = require('lokijs')
const marked = require('marked')
const { parse } = require('url')
const { json, send } = require('micro')

const options = {
  autoload: true,
  autosave: true,
  autosaveInterval: 10000,
  autoloadCallback: loaded
}

let store
const db = new Loki(`${os.tmpdir()}/loki.db`, options)

function loaded () {
  store = db.getCollection('store') || db.addCollection('store')
}

function updateStore (data) {
  const key = data.key
  const type = data.type
  const value = data.data
  const content = store.findOne({key: key})

  if (!content) {
    var payload = {
      key: key
    }
    payload[type] = value
    store.insert(payload)
  } else {
    content[type] = value
    store.update(content)
  }

  return payload || content
}

function readFromStore (data) {
  const key = data.key
  const content = store.findOne({key: key})

  return content || []
}

module.exports = async (request, response) => {
  const {pathname, query} = await parse(request.url, true)
  const method = request.method
  let data = method === 'POST' ? await json(request) : query

  if (method === 'POST') {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    send(response, 200, updateStore(data))
  } else if (pathname !== '/') {
    data.key = pathname.replace('/', '')
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    send(response, 200, readFromStore(data))
  } else {
    const readme = readFileSync('./README.md', 'utf-8')
    const html = marked(readme)
    send(response, 200, html)
  }
}
