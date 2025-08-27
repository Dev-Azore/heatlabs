export type LogLevel = 'info' | 'warn' | 'error'

function tag(level: LogLevel) { return `[HEAT:${level.toUpperCase()}]` }

export function log(level: LogLevel, message: string, meta?: Record<string, any>) {
  try {
    const payload = { message, ...meta }
    // If you later add Sentry, do it here based on NEXT_PUBLIC_SENTRY_DSN
    if (level === 'error') console.error(tag(level), payload)
    else if (level === 'warn') console.warn(tag(level), payload)
    else console.log(tag(level), payload)
  } catch (e) {
    console.error('[HEAT:LOGGER_FAIL]', e)
  }
}

export const logInfo = (m: string, meta?: Record<string, any>) => log('info', m, meta)
export const logWarn = (m: string, meta?: Record<string, any>) => log('warn', m, meta)
export const logError = (m: string, meta?: Record<string, any>) => log('error', m, meta)
