import { searchSong } from '../services/genius'
import { extractLyrics } from '../utils/extractLyrics'
import { CommandInput } from '../types/interface'

export const lyrics = async (params: CommandInput): Promise<void> => {
  const { message } = params

  const args = message.content.split(' ')
  const title = args[1]

  if (!message.member || !message.guild) {
    return
  }

  const results = await searchSong({ title })

  if (!results) {
    return
  }

  const lyrics = await extractLyrics(results[0].url)

  message.channel.send(`>>> ${results[0].title}\n${lyrics}`)
}
