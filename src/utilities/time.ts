import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

export function timeToNow(date: string) {
  // seconds to milliseconds
  return distanceInWordsToNow(Number.parseInt(date) * 1000, {
    addSuffix: true
  }).replace('about ', '')
}
