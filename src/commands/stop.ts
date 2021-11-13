import { Message } from 'discord.js'
import { IQueue } from '../types/interface'

export const stop = (params: { message: Message, serverQueue: IQueue | undefined }) => {
  const { message, serverQueue } = params

  if (!message.member)
    return

  if (!message.member.voice.channel)
    return message.channel.send('You have to be in a voice channel to stop the music!')

  if (!serverQueue)
    return message.channel.send('There is no song that I could stop!')

  serverQueue.songs = []
  serverQueue.connection.dispatcher.end()
}
