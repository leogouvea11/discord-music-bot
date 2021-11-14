import ytfps from 'ytfps'
import ytdl from 'ytdl-core'
import yts from 'yt-search'
import { Message, Permissions } from 'discord.js'
import { play } from './play'
import { HandlerQueue } from '../handleQueue'
import { IQueue, ISong, PlaylistResponse } from '../types/interface'
import { PermissionsTypes } from '../types/enum'

type ExecuteInput = {
  message: Message,
  queue: HandlerQueue,
  serverQueue: IQueue | undefined
}

export const execute = async (params: ExecuteInput) => {
  const { message, serverQueue, queue } = params

  if (!message.member || !message.guild || !message.client.user) {
    return
  }

  const voiceChannel = message.member.voice.channel
  if (!voiceChannel) {
    return message.channel.send('You need to be in a voice channel to play music!')
  }

  const permissions = voiceChannel.permissionsFor(message.client.user)
  if (haveAllPermissions(permissions)) {
    return message.channel.send('I need the permissions to join and speak in your voice channel!')
  }

  const songs = await getSongToPlay(message)

  if (!songs) {
    return message.channel.send("No songs were found!")
  }

  if (!serverQueue) {
    const queueContruct: IQueue = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    }

    queueContruct.songs = queueContruct.songs.concat(songs)
    queue.set(message.guild.id, queueContruct)

    if(queueContruct.songs.length === 1) {
      message.channel.send(`**${songs[0].title}** has been added to the queue!`)
    } else {
      message.channel.send(`**${songs.length}** songs has been added to the queue!`)
    }

    try {
      queueContruct.connection = await voiceChannel.join()
      play({
        queue,
        guild: message.guild,
        song: queueContruct.songs[0]
      })
    } catch (err) {
      queue.delete(message.guild.id)
      return message.channel.send(String(err))
    }
  } else {
    serverQueue.songs = serverQueue.songs.concat(songs)
  }
}

const haveAllPermissions = (permissions: Readonly<Permissions> | null) =>
  !permissions
  || !permissions.has(PermissionsTypes.CONNECT)
  || !permissions.has(PermissionsTypes.SPEAK)

const getSongToPlay = async (message: Message): Promise<ISong[] | undefined> => {
  const args = message.content.split(' ')
  const url = args[1]
  const songs: ISong[] = []

  if (url.includes('playlist')){
    const playlistInfo = await ytfps(url)
    playlistInfo.videos.forEach(video => {
      songs.push({
        title: video.title,
        url: video.url
      })
    })
  }
  else if (ytdl.validateURL(url)) {
    const songInfo = await ytdl.getInfo(url);
    songs.push({
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url
    })
  }
  else {
    const {videos} = await yts(args.slice(1).join(" "));
    if (!videos.length) return
    songs.push({
      title: videos[0].title,
      url: videos[0].url
    })
  }

  return songs
}
