import { IQueue } from './types/interface'

export class HandlerQueue {
  queue: Map<string, IQueue>

  constructor() {
    this.queue = new Map()
  }

  get(guildId: string) {
    return this.queue.get(guildId)
  }

  set(guildId: string, queueContruct: IQueue) {
    this.queue.set(guildId, queueContruct)
  }

  delete(guildId: string) {
    this.queue.delete(guildId)
  }
}
