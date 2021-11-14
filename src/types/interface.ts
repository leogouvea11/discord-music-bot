import { DMChannel, NewsChannel, TextChannel, VoiceChannel } from 'discord.js'

export interface IQueue {
  textChannel: TextChannel | DMChannel | NewsChannel,
  voiceChannel: VoiceChannel,
  connection: any,
  songs: ISong[],
  volume: number,
  playing: boolean
}

export interface ISong {
  title: string,
  url: string
}
