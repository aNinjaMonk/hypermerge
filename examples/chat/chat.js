#!/usr/bin/env node

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
if (argv.help || argv._.length > 1) {
  console.log('Usage: hm-chat [--nick=<nick>] [--port=<port>] [<channel-key>]\n')
  process.exit(0)
}

let nick = argv.nick
if (!argv.nick) {
  const prompt = require('prompt-sync')()
  nick = prompt('Enter your nickname: ')
}

const port = argv.port

const channelHex = argv._[0]

const Model = require('./model')
let model = new Model(channelHex, nick, port, onReady)

function onReady ({doc, channelHex, numConnections, addMessageToDoc}) {
  const initUI = require('./ui')
  const render = initUI({
    nick,
    channelHex,
    numConnections,
    doc,
    postMessage: (line) => model.addMessageToDoc(line)
  })
  return render
}
