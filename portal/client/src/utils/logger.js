// logger.js

const logger = {
  log: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `%c[LOG] ${new Date().toISOString()}: ${message}`,
        'color: blue; font-weight: bold;',
      )
    }
  },

  error: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        `%c[ERROR] ${new Date().toISOString()}: ${message}`,
        'color: red; font-weight: bold; background-color: #ffe6e6; padding: 2px 4px; border-radius: 4px;',
      )
    }
  },

  warn: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `%c[WARN] ${new Date().toISOString()}: ${message}`,
        'color: orange; font-weight: bold; background-color: #fff4e0; padding: 2px 4px; border-radius: 4px;',
      )
    }
  },

  info: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(
        `%c[INFO] ${new Date().toISOString()}: ${message}`,
        'color: green; font-weight: bold;',
      )
    }
  },
}

export default logger
