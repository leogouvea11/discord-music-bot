import axios from 'axios'
import { GENIUS_API_KEY } from '../../config.json'

export const searchSong = async (params: {
  title: string
  artist?: string
}) => {
  const { title } = params
  const headers = {
    Authorization: `Bearer ${GENIUS_API_KEY}`,
  }
  const { data } = await axios.get(`https://api.genius.com/search?q=${title}`, {
    headers,
  })

  if (data.response.hits.length === 0) {
    return null
  }
  const results = data.response.hits.map((hit: any) => {
    // eslint-disable-next-line camelcase
    const { full_title, song_art_image_url, id, url } = hit.result
    return {
      id,
      title: full_title,
      albumArt: song_art_image_url,
      url,
    }
  })

  return results
}
