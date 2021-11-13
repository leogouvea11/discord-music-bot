import ytdl from 'ytdl-core'
import yts from 'yt-search'
import { Message, Permissions } from 'discord.js'
import { play } from './play'
import { HandlerQueue } from '../handleQueue'
import { IQueue, ISong } from '../types/interface'
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

  const song = await getSongToPlay(message)

  if (!song) {
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

    queue.set(message.guild.id, queueContruct)

    queueContruct.songs.push(song)

    try {
      queueContruct.connection = await voiceChannel.join()
      play({
        queue,
        guild: message.guild,
        song: queueContruct.songs[0]
      })
    } catch (err) {
      console.log(err)
      queue.delete(message.guild.id)
      return message.channel.send(String(err))
    }
  } else {
    serverQueue.songs.push(song)
    return message.channel.send(`**${song.title}** has been added to the queue!`)
  }
}

const haveAllPermissions = (permissions: Readonly<Permissions> | null) =>
  !permissions
  || !permissions.has(PermissionsTypes.CONNECT)
  || !permissions.has(PermissionsTypes.SPEAK)

const getSongToPlay = async (message: Message): Promise<ISong | undefined> => {
  const args = message.content.split(' ')

  let song;
  if (ytdl.validateURL(args[1])) {
    const songInfo = await ytdl.getInfo(args[1]);
    song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url
    };
  } else {
    const {videos} = await yts(args.slice(1).join(" "));
    if (!videos.length) return
    song = {
      title: videos[0].title,
      url: videos[0].url
    }
  }

  return song
}
