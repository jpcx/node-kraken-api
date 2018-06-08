/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/deep-props|GitHub}
 */

'use strict'

/**
 * Searches file structure of build/templates folder and returns paths and template strings.
 *
 * @private
 * @param   {Object} fs           - I/O module.
 * @param   {string} templatesLoc - Local folder location of templates.
 * @returns {Object} Mapping of paths and template strings.
 */
const loadTemplates = (fs, templatesLoc) => {
  const mappings = {}
  /**
   * Recursively searches directories and populates mappings object.
   *
   * @private
   * @param {string} path - Current path.
   */
  const recurse = path => {
    fs.readdirSync(
      path
    ).forEach(child => {
      const childPath = path + '/' + child
      if (fs.statSync(process.cwd() + '/' + childPath).isDirectory()) {
        recurse(childPath)
      } else {
        const parsedPath = childPath.slice(templatesLoc.length + 1, -1)
        mappings[parsedPath] = fs.readFileSync(
          process.cwd() + '/' + childPath, 'utf8'
        )
      }
    })
  }
  recurse(templatesLoc)
  return mappings
}

/**
 * Replaces alias markers with alias values.
 *
 * @private
 * @param   {string} string  - Search string.
 * @param   {Object} aliases - Mappings of alias names and values.
 * @returns {Object} Formatted string.
 */
const replaceAliases = (string, aliases) => string.split(
  /___{alias:([\s\S]*?)}___/g
).reduce(
  (newString, chunk, i) => {
    if (i % 2 === 0) {
      return newString + chunk
    } else {
      let data = aliases[chunk.split('___')[0]]
      const flags = chunk.split('___').filter((x, i) => i !== 0)
      for (let f of flags) {
        if (f === 'JSON') {
          data = JSON.stringify(data, null, 2)
        }
      }
      return newString + data
    }
  },
  ''
)

/**
 * Replaces match markers with retrieved content.
 *
 * @private
 * @param   {string} string - Search string.
 * @param   {Object} fs     - I/O module.
 * @returns {string} Formatted string.
 */
const replaceMatches = (string, fs) => string.split(
  /___{file:([\s\S]*?)___split-?([gimuy]*?):([\s\S]*?)}___/g
).reduce(
  (opData, chunk, i) => {
    if (i % 4 === 0) {
      opData.newString += chunk
      return opData
    } else if ((i - 1) % 4 === 0) {
      opData.path = chunk
      return opData
    } else if ((i - 2) % 4 === 0) {
      opData.flags = chunk
      return opData
    } else if ((i - 3) % 4 === 0) {
      opData.newString += fs.readFileSync(
        process.cwd() + '/' + opData.path,
        'utf8'
      ).split(
        RegExp(chunk, opData.flags)
      )[1]
      return { ...{ newString: opData.newString } }
    }
  },
  { newString: '' }
).newString

/**
 * Replaces marked sections within strings based on the type of marker.
 *
 * @private
 * @param   {Object} fs       - I/O module.
 * @param   {Object} mappings - Mappings of file locations and template strings.
 * @param   {Object} aliases  - Mappings of alias names and values.
 * @returns {Object} Formatted templates.
 */
const replaceMarkers = (fs, mappings, aliases) => Object.entries(
  mappings
).reduce(
  (newMaps, entry) => {
    let formatted = entry[1]
    formatted = replaceAliases(formatted, aliases)
    formatted = replaceMatches(formatted, fs)
    if (entry[0].match(/.json$/gm) !== null) {
      formatted = JSON.stringify(
        JSON.parse(formatted),
        null,
        2
      ) + '\n'
    }
    newMaps[entry[0]] = formatted
    return newMaps
  },
  {}
)

/**
 * Writes template files based on templates locations and aliases.
 *
 * @private
 * @param {Object} info - Local folder location of templates and mappings of alias names and values.
 */
const buildFromTemplates = info => {
  const fs = require('fs')
  Object.entries(
    replaceMarkers(
      fs,
      loadTemplates(fs, info.templatesLoc),
      info.aliases
    )
  ).forEach(
    entry => {
      fs.writeFileSync(process.cwd() + '/' + entry[0], entry[1])
    }
  )
}

/**
 * Converts config.json to relevant mappings.
 *
 * @private
 * @param   {string} config - Config.json for repository information.
 * @retruns {Object} Local folder location of templates and mappings of alias names and values.
 */
const parseConfig = config => {
  const info = {}
  info.templatesLoc = config.templatesLoc
  info.aliases = {}
  Object.entries(
    config.packages
  ).forEach(
    packEntry => {
      Object.entries(
        packEntry[1]
      ).forEach(
        infoEntry => {
          info.aliases[packEntry[0] + '/' + infoEntry[0]] = infoEntry[1]
        }
      )
    }
  )
  if (config.hasOwnProperty('customAliases')) {
    Object.entries(
      config.customAliases
    ).forEach(
      aliasEntry => {
        info.aliases[aliasEntry[0]] = aliasEntry[1]
      }
    )
  }
  return info
}

buildFromTemplates(
  parseConfig(
    require(process.cwd() + '/' + process.argv[2])
  )
)
