import { NextResponse } from 'next/server'
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export class RateLimit {
  tokenCache: LRUCache<string, number[]>

  constructor(options?: Options) {
    this.tokenCache = new LRUCache({
      max: options?.uniqueTokenPerInterval || 500,
      ttl: options?.interval || 60000,
    })
  }

  async check(
    res: NextResponse,
    limit: number,
    token: string
  ): Promise<NextResponse> {
    const tokenCount = this.tokenCache.get(token) || [0]
    if (tokenCount[0] === 0) {
      this.tokenCache.set(token, [1])
    } else {
      if (tokenCount[0] === limit) {
        throw new Error('Rate limit exceeded')
      }
      tokenCount[0] += 1
      this.tokenCache.set(token, tokenCount)
    }

    res.headers.set('X-RateLimit-Limit', limit.toString())
    res.headers.set(
      'X-RateLimit-Remaining',
      (limit - (tokenCount[0])).toString()
    )

    return res
  }
}

export const rateLimit = (options?: Options) => new RateLimit(options) 