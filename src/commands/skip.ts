import { Message } from 'discord.js'
import { IQueue } from '../types/interface'

export const skip = (params: { message: Message, serverQueue: IQueue | undefined }) => {
  const { message, serverQueue } = params

  if (!message.member)
    return

  if (!serverQueue)
    return message.channel.send('Does not have musics in queue to skip.')

  if (!message.member.voice.channel)
    return message.channel.send('You have to be in a voice channel to stop the music!')

  serverQueue.connection.dispatcher.end()
}
