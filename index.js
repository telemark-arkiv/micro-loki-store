'use strict'

const readFileSync = require('fs').readFileSync
const Loki = require('lokijs')
const marked = require('marked')
const { parse } = require('url')
const { json, send } = require('micro')

const db = new Loki('db/loki.json')
const store = db.addCollection('store')

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
  const data = method === 'POST' ? await json(request) : query

  if (pathname === '/store') {
    send(response, 200, method === 'POST' ? updateStore(data) : readFromStore(data))
  } else {
    const readme = readFileSync('./README.md', 'utf-8')
    const html = marked(readme)
    send(response, 200, html)
  }
}
