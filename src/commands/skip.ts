import { Message } from 'discord.js'
import { HandlerQueue } from '../handleQueue'
import { IQueue } from '../types/interface'
import { play } from './play'

type SkipInput = {
  message: Message,
  serverQueue: IQueue | undefined,
  queue: HandlerQueue
}

export const skip = (params: SkipInput) => {
  const { message, serverQueue, queue } = params

  if (!message.member || !message.guild)
    return

  if (!serverQueue)
    return message.channel.send('Does not have musics in queue to skip.')

  if (!message.member.voice.channel)
    return message.channel.send('You have to be in a voice channel to stop the music!')

  serverQueue.songs.shift()
  play({
    queue,
    guild: message.guild,
    song: serverQueue.songs[0]
  })
}
