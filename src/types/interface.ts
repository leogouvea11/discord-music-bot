import { DMChannel, NewsChannel, TextChannel, VoiceChannel } from 'discord.js'

export type IQueue = {
  textChannel: TextChannel | DMChannel | NewsChannel,
  voiceChannel: VoiceChannel,
  connection: any,
  songs: ISong[],
  volume: number,
  playing: boolean
}

export type ISong = {
  title: string,
  url: string
}