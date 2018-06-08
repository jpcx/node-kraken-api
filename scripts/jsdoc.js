/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

/**
 * Gets HTML from local JSDoc files.
 *
 * @private
 * @param   {Object} fs       - I/O module.
 * @param   {string} jsdocLoc - Local folder location of JSDoc HTML.
 * @param   {Object} mappings - Map of local HTML locations to desired MD file names, locations, remote URLs, and version numbers.
 * @returns {Object} Object with destinations as keys and values as HTML.
 */
const getHTML = (fs, jsdocLoc, mappings) => Object.keys(
  mappings
).reduce(
  (HTML, key) => {
    const localPath = (
      mappings[key].local +
      (mappings[key].local !== '' ? '/' : '') +
      mappings[key].path +
      '/' +
      mappings[key].file
    )
    HTML[localPath] = fs.readFileSync(
      process.cwd() + '/' + jsdocLoc + '/' + key,
      'utf8'
    )
    return HTML
  },
  {}
)

/**
 * Iterates through array split by '```' and alternatively tags with 'js' for JavaScript flavored syntax highlighting.
 *
 * @private
 * @param {string} string - Search string.
 * @returns {string} Formatted string.
 */
const tagCodeBlocksAsJS = string => string.split(
  /(```)/g
).reduce(
  (opData, chunk) => {
    if (chunk === '```') {
      if (opData.replaceTogg) {
        chunk = '```js'
        opData.replaceTogg = false
      } else {
        opData.replaceTogg = true
      }
    }
    opData.formatted += chunk
    return opData
  },
  { formatted: '', replaceTogg: true }
).formatted

/**
 * Escapes brackets used to signify return values.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const fixReturnBrackets = string => string.replace(
  /→ {/g,
  '→ \\{'
)

/**
 * Fixes 'optional' attribute in parameter / property tables.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const fixOptionalTags = string => string.replace(
  /<optional>/g,
  '\\<optional>'
)

/**
 * Fixes incorrectly split table breaks.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const fixTableLineBreaks = string => string.replace(
  / \n^ \|/gm,
  '|'
)

/**
 * Escapes asterix bullets.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const fixAsterixBullets = string => string.replace(
  /\* {3}\*/g,
  '*   \\*'
)

/**
 * Removes unnecessary namespace title and formats next title as main title.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const removeTopNamespace = string => string.replace(
  /^Namespace: [\s\S]*?\n=*\n\n([\s\S]*?)\n-*\n$/gm,
  '# $1\n'
)

/**
 * Escapes sub-namespace strikethrough indicators.
 *
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const escapeSubNamespaceStrikethrough = string => string.replace(
  /~(\w+?~)/gm,
  '\\~$1'
)

/**
 * Converts local path to GitHub URL.
 *
 * @private
 * @param   {string} path     - Local path of string destination.
 * @param   {Object} mappings - Map of local HTML locations to desired MD file names, locations, remote URLs, and version numbers.
 * @returns {string} URL - Remote GitHub URL.
 */
const localPathToURL = (path, mappings) => Object.values(
  mappings
).reduce(
  (URL, map) => {
    if (URL === '') {
      if (
        path === (
          map.local +
          (map.local === '' ? '' : '/') +
          map.path +
          '/' +
          map.file
        )
      ) {
        URL = map.repo + '/blob/' + map.tag
      }
    }
    return URL
  },
  ''
)

/**
 * Adds horizontal line before Home link footer.
 *
 * @private
 * @param   {string} string   - Search string.
 * @param   {Object} path     - Local path of string destination.
 * @param   {Object} mappings - Map of local HTML locations to desired MD file names, locations, remote URLs, and version numbers.
 * @returns {string} Formatted string.
 */
const formatHomeFooter = (string, path, mappings) => string.replace(
  /^\[Home\]\(index\.html\)\n-*\n[\s\S]*/gm,
  `<hr>\n\n## [Home](${localPathToURL(path, mappings)}/README.md)\n`
)

/**
 * Replaces source code urls with links to GitHub code locations and replaces #line links to GitHub-flavored #L links.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const formatSourceCodeURLs = string => string.split(
  /([\w\d]*\.js\.html#line)/g
).reduce(
  (formatted, block, i) => {
    if (i === 0) {
      return block
    } else if ((i + 1) % 2 === 0) {
      return (
        formatted +
        '/' +
        block.replace(
          /_/g,
          '/'
        ).replace(
          /line/g,
          'L'
        ).replace(
          /\.js\.html/g,
          '.js'
        )
      )
    } else {
      return formatted + block
    }
  },
  ''
).split(
  /([\w\d]*\.js\.html)/g
).reduce(
  (formatted, block, i) => {
    if (i === 0) {
      return block
    } else if ((i + 1) % 2 === 0) {
      return (
        formatted +
        '/' +
        block.replace(
          /_/g,
          '/'
        ).replace(
          /\.js\.html/g,
          '.js'
        )
      )
    } else {
      return formatted + block
    }
  },
  ''
)

/**
 * Replaces links to module HTML pages.
 *
 * @private
 * @param   {string} string   - Search string.
 * @param   {Object} mappings - Map of local HTML locations to desired MD file names, locations, remote URLs, and version numbers.
 * @returns {string} Formatted string.
 */
const replaceModuleLinks = (string, mappings) => Object.entries(
  mappings
).reduce(
  (newString, entry) => newString.replace(
    RegExp(
      entry[0].split(
        '.'
      ).join(
        '\\.'
      ),
      'g'
    ),
    entry[1].repo +
    '/blob/' +
    entry[1].tag +
    '/' +
    entry[1].path +
    '/' +
    entry[1].file
  ),
  string
)

/**
 * Replaces relative source code links with remote links.
 *
 * @private
 * @param {string} string   - Search string.
 * @param {Object} mappings - Map of local HTML locations to desired MD file names, locations, remote URLs, and version numbers.
 * @returns {string} Formatted string.
 */
const replaceSourceCodeLinks = (string, mappings) => string.split(
  /(\]\([/\w\d\-._~:?#[\]@!$&'()*\\+,;=`]*.js[#L\d]*\))/g
).reduce(
  (newString, chunk, i) => {
    if (i === 0) {
      return chunk
    } else if ((i + 1) % 2 === 0) {
      for (let val of Object.values(mappings)) {
        if (val.local !== '') {
          if (
            chunk.match('/' + val.local) !== null &&
            chunk.match('/' + val.local).index === 2
          ) {
            return (
              newString +
              '](' +
              val.repo +
              '/blob/' +
              val.tag +
              chunk.slice(val.local.length + 3)
            )
          }
        }
      }
      for (let val of Object.values(mappings)) {
        if (val.local === '') {
          return (
            newString +
            '](' +
            val.repo +
            '/blob/' +
            val.tag +
            chunk.slice(2)
          )
        }
      }
      return newString + chunk
    } else {
      return newString + chunk
    }
  },
  ''
).split(
  /(\[[/\w\d\-._~:?#[\]@!$&'()*\\+,;=`]*.js[#L\d]*\]\()/g
).reduce(
  (newString, chunk, i) => {
    if (i === 0) {
      return chunk
    } else if ((i + 1) % 2 === 0) {
      for (let val of Object.values(mappings)) {
        if (val.local !== '') {
          if (
            chunk.match(val.local) !== null &&
            chunk.match(val.local).index === 1
          ) {
            return (
              newString +
              '[' +
              val.repo.replace(
                /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w\d\-._~:?#[\]@!$&'()*\\+,;=`]*\/([\w\d\-._~:?#[\]@!$&'()*\\+,;=`]*)$/gm,
                '$1'
              ) +
              '/' +
              chunk.slice(val.local.length + 2)
            )
          }
        }
      }
      for (let val of Object.values(mappings)) {
        if (val.local === '') {
          return (
            newString +
            '[' +
            val.repo.replace(
              /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w\d\-._~:?#[\]@!$&'()*\\+,;=`]*\/([\w\d\-._~:?#[\]@!$&'()*\\+,;=`]*)$/gm,
              '$1'
            ) +
            '/' +
            chunk.slice(1)
          )
        }
      }
      return newString + chunk
    } else {
      return newString + chunk
    }
  },
  ''
)

/**
 * Applies any post-processing filters to markdown.
 *
 * @private
 * @param   {Object} markdown  - Object with paths as keys and markdown strings as values.
 * @param   {Object} mappings  - Map of local HTML locations to desired MD file names, locations, remote URLs, and version numbers.
 * @returns {Object} Processed markdown Object.
 */
const postProcess = (markdown, mappings) => Object.keys(
  markdown
).reduce(
  (proc, key) => {
    proc[key] = tagCodeBlocksAsJS(proc[key])
    proc[key] = fixReturnBrackets(proc[key])
    proc[key] = fixOptionalTags(proc[key])
    proc[key] = fixTableLineBreaks(proc[key])
    proc[key] = fixAsterixBullets(proc[key])
    proc[key] = removeTopNamespace(proc[key])
    proc[key] = formatHomeFooter(proc[key], key, mappings)
    proc[key] = formatSourceCodeURLs(proc[key])
    proc[key] = replaceModuleLinks(proc[key], mappings)
    proc[key] = replaceSourceCodeLinks(proc[key], mappings)
    proc[key] = escapeSubNamespaceStrikethrough(proc[key])
    proc[key] = proc[key].trim()
    return proc
  },
  markdown
)

/**
 * Converts HTML to markdown with turndown.
 *
 * @private
 * @param   {Object} HTML - Object with destinations as keys and values as HTML.
 * @returns {Object} Object with paths as keys and markdown strings as values.
 */
const convertHTML = HTML => {
  const Turndown = require('turndown')
  const gfm = require('turndown-plugin-gfm').gfm
  const turndown = new Turndown({
    codeBlockStyle: 'fenced'
  })
  turndown.use(gfm)
  turndown.remove('footer')
  turndown.remove('script')
  turndown.remove('title')
  turndown.addRule('preserveLinks', {
    filter: 'h4',
    replacement: (content, node) => {
      const ID = node.getAttribute('id')
      if (ID !== undefined) {
        return `<a name="${ID}"></a>\n#### ${content}`
      } else {
        return `#### ${content}`
      }
    }
  })
  const markdown = {}
  for (let key of Object.keys(HTML)) {
    markdown[key] = turndown.turndown(HTML[key])
  }
  return markdown
}

/**
 * Builds the markdown documentation from the JSDoc output using the turndown module and custom replacement functions.
 * Valid as of JSDoc v3.5.5, turndown v4.0.2, and turndown-plugin-gfm v1.0.1.
 *
 * @private
 * @param {Object} info  - Location of jsdoc output and map of local HTML locations to desired MD file names, locations, remote URLs, and version numbers.
 * @see {@link https://www.npmjs.com/package/turndown-plugin-gfm}
 */
const writeMarkdown = info => {
  const fs = require('fs')
  const HTML = getHTML(fs, info.jsdocLoc, info.mappings)
  const markdown = postProcess(convertHTML(HTML), info.mappings)
  for (let key of Object.keys(markdown)) {
    fs.writeFileSync(
      process.cwd() + '/' + key,
      markdown[key],
      'utf8'
    )
  }
}

/**
 * Converts config.json to relevant mappings.
 *
 * @private
 * @param   {string} config - Config.json for repository information.
 * @retruns {Object} Location of jsdoc output and map of local HTML locations to desired MD file names, locations, remote URLs, and version numbers.
 */
const parseConfig = config => {
  const info = {}
  info.jsdocLoc = config.jsdocLoc
  info.mappings = {}
  Object.values(config.packages).forEach(
    pack => {
      pack.jsdoc.forEach(
        doc => {
          info.mappings[doc.origin] = {
            local: doc.destination.local,
            path: doc.destination.path,
            file: doc.destination.file,
            repo: pack.repo,
            tag: pack.tag
          }
        }
      )
    }
  )
  return info
}

writeMarkdown(
  parseConfig(
    require(process.cwd() + '/' + process.argv[2])
  )
)
