import { Client } from 'discord.js'
import { prefix, token } from '../config.json'
import { HandlerQueue } from './handleQueue'
import * as commands from './commands'

const client = new Client()

const queue = new HandlerQueue()

client.once('ready', () => {
  console.log('Ready!')
})

client.once('reconnecting', () => {
  console.log('Reconnecting!')
})

client.once('disconnect', () => {
  console.log('Disconnect!')
})

client.on('message', async message => {
  if (message.author.bot) return
  if (!message.guild) return
  if (!message.content.startsWith(prefix)) return

  const serverQueue = queue.get(message.guild.id)

  if (message.content.startsWith(`${prefix}play`)) {
    commands.execute({ message, queue, serverQueue })
  } else if (message.content.startsWith(`${prefix}skip`)) {
    commands.skip({ message, serverQueue })
  } else if (message.content.startsWith(`${prefix}stop`)) {
    commands.stop({ message, serverQueue })
  } else {
    message.channel.send('You need to enter a valid command!')
  }

  return
})

client.login(token)