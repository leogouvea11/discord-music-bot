import {
  DMChannel,
  Message,
  NewsChannel,
  TextChannel,
  VoiceChannel,
} from 'discord.js'
import { HandlerQueue } from '../handleQueue'

export interface ISong {
  title: string
  url: string
}

export interface IQueue {
  textChannel: TextChannel | DMChannel | NewsChannel
  voiceChannel: VoiceChannel
  connection: any
  songs: ISong[]
  volume: number
  playing: boolean
}

export interface CommandInput {
  message: Message
  queue: HandlerQueue
  serverQueue: IQueue | undefined
}
