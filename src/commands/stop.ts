import { Message } from 'discord.js'
import { HandlerQueue } from 'src/handleQueue'
import { IQueue } from '../types/interface'

type StopInput = {
  message: Message,
  serverQueue: IQueue | undefined,
  queue: HandlerQueue
}

export const stop = (params: StopInput) => {
  const { message, serverQueue, queue } = params

  if (!message.member || !message.guild)
    return

  if (!message.member.voice.channel)
    return message.channel.send('You have to be in a voice channel to stop the music!')

  if (!serverQueue)
    return message.channel.send('There is no song that I could stop!')

  queue.delete(message.guild.id)

  serverQueue.songs = []
  serverQueue.connection.dispatcher.end()
}
