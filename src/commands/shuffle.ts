import { play } from './play'
import { CommandInput } from '../types/interface'

export const shuffle = (params: CommandInput) => {
  const { message, serverQueue, queue } = params

  if (!message.member || !message.guild) {
    return
  }

  if (!serverQueue) {
    message.channel.send('Does not have musics in queue to skip.')
    return
  }

  if (!message.member.voice.channel) {
    message.channel.send('You have to be in a voice channel to stop the music!')
    return
  }

  serverQueue.songs = shuffleArray(serverQueue.songs)
  play({
    queue,
    guild: message.guild,
    song: serverQueue.songs[0],
  })
}

const shuffleArray = (array: any[]): any[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }

  return array
}
