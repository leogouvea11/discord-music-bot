import { Message } from 'discord.js'
import { HandlerQueue } from '../handleQueue'
import { prefix } from '../../config.json'
import * as commands from '../commands'
import { CommandInput } from '../types/interface'
import { CommandsAvailable } from '../types/enum'

const commandHandler = {
  play: (params: CommandInput) => commands.execute(params),
  skip: (params: CommandInput) => commands.skip(params),
  stop: (params: CommandInput) => commands.stop(params),
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
    !message.content.startsWith(prefix) ||
    message.author.bot ||
    !message.guild
  ) {
    return
  }

  const tokens = message.content.split(' ')
  const commandToken = tokens[0]

  if (commandToken.charAt(0) === prefix) {
    const serverQueue = queue.get(message.guild.id)
    const command = commandToken.substring(1) as CommandsAvailable

    if (!Object.values(CommandsAvailable).includes(command)) {
      message.channel.send('You need to enter a valid command!')
      return
    }

    commandHandler[command]({ message, serverQueue, queue })
  }
}
