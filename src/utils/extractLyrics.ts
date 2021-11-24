import * as cheerio from 'cheerio'
import axios from 'axios'

export const extractLyrics = async (url: string) => {
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)

  let lyrics = $('div[class="lyrics"]').text().trim()
  if (!lyrics) {
    lyrics = ''
    $('div[class^="Lyrics__Container"]').each((i, elem) => {
      if ($(elem).text().length !== 0) {
        const snippet = $(elem)
          .html()!
          .replace(/<br>/g, '\n')
          .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '')
        lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n'
      }
    })
  }

  if (!lyrics) {
    return null
  }

  return lyrics.trim()
}
