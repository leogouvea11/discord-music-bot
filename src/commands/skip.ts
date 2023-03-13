import { play } from './play'
import { CommandInput } from '../types/interface'
import { DEFAULT_MESSAGE_LIFESPAN } from '../utils/constants'

export const skip = async (params: CommandInput): Promise<void> => {
  const { message, serverQueue, queue } = params

  if (!message.member || !message.guild) {
    return
  }

  if (!serverQueue) {
    message.channel
      .send('Does not have musics in queue to skip.')
      .then((sentMessage) => {
        sentMessage.delete({ timeout: DEFAULT_MESSAGE_LIFESPAN })
      })
    return
  }

  if (!message.member.voice.channel) {
    message.channel
      .send('You have to be in a voice channel to stop the music!')
      .then((sentMessage) => {
        sentMessage.delete({ timeout: DEFAULT_MESSAGE_LIFESPAN })
      })
    return
  }

  serverQueue.songs.shift()
  play({
    queue,
    guild: message.guild,
    song: serverQueue.songs[0],
  })
}
