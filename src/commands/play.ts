import fs from 'fs'
import ytdl from 'ytdl-core'
import { Guild } from 'discord.js'
import { ISong } from '../types/interface'
import { HandlerQueue } from '../handleQueue'

type PlayInput = {
  guild: Guild
  song: ISong
  queue: HandlerQueue
}

export const play = (params: PlayInput): void => {
  const { guild, queue, song } = params
  const serverQueue = queue.get(guild.id)

  if (!serverQueue) {
    return
  }

  if (!song) {
    serverQueue.voiceChannel.leave()
    queue.delete(guild.id)
    return
  }

  const dispatcher = serverQueue.connection
    .play(
      ytdl(song.url, {
        quality: 'highestaudio',
        filter: 'audioonly',
        highWaterMark: 1024 * 1024 * 10,
      }),
    )
    .on('finish', () => {
      serverQueue.songs.shift()
      play({
        guild,
        queue,
        song: serverQueue.songs[0],
      })
    })
    .on('error', (error: any) => {
      if (error.statusCode === 403) {
        setTimeout(() => {
          play(params)
        }, 1000)
      }
    })
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
  serverQueue.textChannel.send(`Start playing: **${song.title}**`)
}
