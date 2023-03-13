import { Client, VoiceState } from 'discord.js'
import { HandlerQueue } from './handleQueue'
import { handleMessage } from './handlers/handleMessage'
import { handleVoiceStateUpdate } from './handlers/handleVoiceStateUpdate'
import { TOKEN } from '../config.json'

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

client.on(
  'voiceStateUpdate',
  async (oldState, newState: VoiceState) =>
    await handleVoiceStateUpdate({ oldState, newState, queue }),
)

client.on('message', async (message) => handleMessage({ message, queue }))

client.login(TOKEN)
