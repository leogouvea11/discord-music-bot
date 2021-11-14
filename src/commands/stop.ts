import { CommandInput } from '../types/interface'

export const stop = async(params: CommandInput): Promise<void> => {
  const { message, serverQueue, queue } = params

  if (!message.member || !message.guild) {
    return
  }

  if (!message.member.voice.channel) {
    message.channel.send('You have to be in a voice channel to stop the music!')
    return
  }

  if (!serverQueue){
    message.channel.send('There is no song that I could stop!')
    return
  }

  queue.delete(message.guild.id)

  serverQueue.songs = []
  serverQueue.connection.dispatcher.end()
}
