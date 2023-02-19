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
    !newState ||
    !newState.channel ||
    !newState.guild.me ||
    newState.channelID !== newState.guild.me.voice.channelID ||
    !newState.channel
  )
    return

  if (newState.channel.members.size === 1) {
    setTimeout(() => {
      if (newState.channel && newState.channel.members.size === 1) {
        queue.delete(newState.channel.guild.id)
        oldState.channel!.leave()
      }
    }, 500)
  }
}
