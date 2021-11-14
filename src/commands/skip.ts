import { play } from './play'
import { CommandInput } from '../types/interface'

export const skip = async (params: CommandInput): Promise<void> => {
  const { message, serverQueue, queue } = params

  if (!message.member || !message.guild){
    return
  }

  if (!serverQueue){
    message.channel.send('Does not have musics in queue to skip.')
    return
  }

  if (!message.member.voice.channel) {
    message.channel.send('You have to be in a voice channel to stop the music!')
    return
  }

  serverQueue.songs.shift()
  play({
    queue,
    guild: message.guild,
    song: serverQueue.songs[0]
  })
}
