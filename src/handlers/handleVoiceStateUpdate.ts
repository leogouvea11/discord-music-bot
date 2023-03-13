import { VoiceState } from 'discord.js'
import { HandlerQueue } from '../handleQueue'

type HandleVoiceStateUpdateInput = {
  oldState: VoiceState
  newState: any
  queue: HandlerQueue
}

export const handleVoiceStateUpdate = async (
  params: HandleVoiceStateUpdateInput,
) => {
  const { newState, oldState, queue } = params

  if (
    !oldState ||
    !oldState.guild.me ||
    oldState.channelID !== oldState.guild.me.voice.channelID ||
    !oldState.channel
  )
    return

  if (oldState.channel!.members.size === 1) {
    setTimeout(() => {
      if (oldState.channel && oldState.channel.members.size === 1) {
        queue.delete(oldState.channel.guild.id)
        oldState.channel!.leave()
      }
    }, 5000)
  }
}
