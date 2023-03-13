import ytfps from 'ytfps'
import ytdl from 'ytdl-core'
import yts from 'yt-search'
import { Message, Permissions } from 'discord.js'
import { play } from './play'
import { CommandInput, IQueue, ISong } from '../types/interface'
import { PermissionsTypes } from '../types/enum'
import { DEFAULT_MESSAGE_LIFESPAN } from '../utils/constants'

export const execute = async (params: CommandInput): Promise<void> => {
  const { message, serverQueue, queue } = params

  if (!message.member || !message.guild || !message.client.user) {
    return
  }

  const voiceChannel = message.member.voice.channel
  if (!voiceChannel) {
    message.channel
      .send('You need to be in a voice channel to play music!')
      .then((sentMessage) => {
        sentMessage.delete({ timeout: DEFAULT_MESSAGE_LIFESPAN })
      })
    return
  }

  const permissions = voiceChannel.permissionsFor(message.client.user)
  if (haveAllPermissions(permissions)) {
    message.channel
      .send('I need the permissions to join and speak in your voice channel!')
      .then((sentMessage) => {
        sentMessage.delete({ timeout: DEFAULT_MESSAGE_LIFESPAN })
      })
    return
  }

  const songs = await getSongToPlay(message)

  if (!songs) {
    message.channel.send('No songs were found!').then((sentMessage) => {
      sentMessage.delete({ timeout: DEFAULT_MESSAGE_LIFESPAN })
    })
    return
  }

  if (serverQueue) {
    serverQueue.songs = serverQueue.songs.concat(songs)
    message.channel
      .send(`**${songs.length}** songs has been added to the queue!`)
      .then((sentMessage) => {
        sentMessage.delete({ timeout: DEFAULT_MESSAGE_LIFESPAN })
      })
    return
  }

  const queueContruct: IQueue = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
  }

  queueContruct.songs = queueContruct.songs.concat(songs)
  queue.set(message.guild.id, queueContruct)

  if (queueContruct.songs.length === 1) {
    message.channel
      .send(`**${songs[0].title}** has been added to the queue!`)
      .then((sentMessage) => {
        sentMessage.delete({ timeout: DEFAULT_MESSAGE_LIFESPAN })
      })
  } else {
    message.channel
      .send(`**${songs.length}** songs has been added to the queue!`)
      .then((sentMessage) => {
        sentMessage.delete({ timeout: DEFAULT_MESSAGE_LIFESPAN })
      })
  }

  try {
    queueContruct.connection = await voiceChannel.join()
    play({
      queue,
      guild: message.guild,
      song: queueContruct.songs[0],
    })
  } catch (err) {
    queue.delete(message.guild.id)
    message.channel.send(String(err)).then((sentMessage) => {
      sentMessage.delete({ timeout: DEFAULT_MESSAGE_LIFESPAN })
    })
  }
}

const haveAllPermissions = (permissions: Readonly<Permissions> | null) =>
  !permissions ||
  !permissions.has(PermissionsTypes.CONNECT) ||
  !permissions.has(PermissionsTypes.SPEAK)

const getSongToPlay = async (
  message: Message,
): Promise<ISong[] | undefined> => {
  const args = message.content.split(' ')
  const url = args[1]
  let songs: ISong[] = []

  if (args[0] === '-playlist') {
    const args = message.content.split(' ')
    const musics = args.splice(1, Number.MAX_VALUE).join(' ').split(',')

    const promises = musics.map(async (music) => getYtsMusic(music))
    const newSongs: ISong[] = await Promise.all(promises)

    songs = songs.concat(newSongs)
  } else if (url.includes('playlist')) {
    const playlistInfo = await ytfps(url)
    playlistInfo.videos.forEach((video: any) => {
      songs.push({
        title: video.title,
        url: video.url,
      })
    })
  } else if (ytdl.validateURL(url)) {
    const songInfo = await ytdl.getInfo(url)
    songs.push({
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    })
  } else {
    const { videos } = await yts(args.slice(1).join(' '))
    if (!videos.length) return
    songs.push({
      title: videos[0].title,
      url: videos[0].url,
    })
  }

  return songs
}

const getYtsMusic = async (music: string): Promise<ISong> => {
  const { videos } = await yts(music)
  return {
    title: videos[0].title,
    url: videos[0].url,
  }
}
