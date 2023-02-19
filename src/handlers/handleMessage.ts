import { Message } from 'discord.js'
import * as commands from '../commands'
import { HandlerQueue } from '../handleQueue'
import { CommandInput } from '../types/interface'
import { CommandsAvailable } from '../types/enum'
import { DEFAULT_MESSAGE_LIFESPAN } from 'src/utils/constants'

const commandHandler = {
  play: (params: CommandInput) => commands.execute(params),
  skip: (params: CommandInput) => commands.skip(params),
  stop: (params: CommandInput) => commands.stop(params),
  shuffle: (params: CommandInput) => commands.shuffle(params),
  playlist: (params: CommandInput) => commands.execute(params),
  lyrics: (params: CommandInput) => commands.lyrics(params),
}

type HandleMessageInput = {
  message: Message
  queue: HandlerQueue
}

export const handleMessage = async (
  params: HandleMessageInput,
): Promise<void> => {
  const { message, queue } = params
  if (
    !message.content.startsWith('-') ||
    message.author.bot ||
    !message.guild
  ) {
    return
  }

  const tokens = message.content.split(' ')
  const commandToken = tokens[0]

  if (commandToken.charAt(0) === '-') {
    const serverQueue = queue.get(message.guild.id)
    const command = commandToken.substring(1) as CommandsAvailable

    if (!Object.values(CommandsAvailable).includes(command)) {
      message.channel.send('You need to enter a valid command!').then(sentMessage => {
        sentMessage.delete({ timeout: DEFAULT_MESSAGE_LIFESPAN })
      })
      return
    }

    commandHandler[command]({ message, serverQueue, queue })
  }
}
