import { VoiceState } from 'discord.js'
import { HandlerQueue } from '../handleQueue'

type HandleVoiceStateUpdateInput = {
  oldState: VoiceState
  newState: VoiceState
  queue: HandlerQueue
}

export const handleVoiceStateUpdate = async (
  params: HandleVoiceStateUpdateInput,
) => {
  const { newState, oldState, queue } = params
  if (
    !oldState.channel ||
    !oldState.guild.me ||
    oldState.channelID !== oldState.guild.me.voice.channelID ||
    !newState.channel
  )
    return

  if (oldState.channel.members.size === 1) {
    setTimeout(() => {
      if (oldState.channel && oldState.channel.members.size === 1) {
        queue.delete(oldState.channel.guild.id)
        oldState.channel!.leave()
      }
    }, 5000)
  }
}
