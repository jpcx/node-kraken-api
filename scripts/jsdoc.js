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
  /\* +\*/g,
  '* \\*'
)

/**
 * Adds an escaped asterix '*' return types.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const fixAsterixTypes = string => string.replace(
  /^Type\n\n\*\n\n/gm,
  'Type\n\n* \\*\n\n'
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
 * Formats header with # style.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const formatTopModuleHeader = string => string.replace(
  /^(Module:[\S\s]*?)\n=*\n/gm,
  '# $1\n'
)

/**
 * Formats low-level headers to bold text.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const formatLowLevelHeaders = string => string.replace(
  /^##### (.*:?)\n/gm,
  '__$1__\n'
)

/**
 * Converts bullets behind 3 spaces to bullets behind one space.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const decreaseBulletSpaces = string => string.replace(
  /\* {3}/gm,
  '* '
)

/**
 * Converts double linefeeds to single linefeeds.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const reduceDoubleLineFeed = string => string.replace(
  /\n\n\n/g,
  '\n\n'
)

/**
 * Formats 'throws' and 'returns' type headings. Fixes double asterisks.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const formatThrowsAndReturnsTypes = string => string.replace(
  /^(__Throws:__\n\n[\S\s]*?)(Type)(\n\n)([\S\s]*?)$(\n\n)/gm,
  '$1___$2:___$3* $4$5'
).replace(
  /^(__Returns:__\n\n[\S\s]*?)(Type)(\n\n)([\S\s]*?)$(\n\n)/gm,
  '$1___$2:___$3* $4$5'
).replace(
  /^\* \* \\\*$/gm,
  '* \\*'
)

/**
 * Escapes sub-namespace strikethrough indicators.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const escapeSubNamespaceStrikethrough = string => string.replace(
  /~(\w+?~)/gm,
  '\\~$1'
)

/**
 * Escapes 'or' code bars.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const escapeOrCodeBars = string => string.replace(
  /\|\|/gm,
  '\\|\\|'
)

/**
 * Fixes the missing table end after escapeBarsWithinTables preprocessing.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const escapeBarsWithinTablesFix = string => string.split(
  /(^\| --- \|(?: --- \|)*?$\n[\s\S]+?\n\n)/gm
).reduce(
  (formatted, block, i) => {
    if (i === 0) {
      return block
    } else if ((i + 1) % 2 === 0) {
      return formatted + block.split(
        /\n/gm
      ).reduce(
        (newBlock, line) => {
          if (line.length > 1 && !line.match(/^\| --- \|(?: --- \|)*?$/gm)) {
            return newBlock + line + '|\n'
          } else {
            return newBlock + line + '\n'
          }
        }, ''
      )
    } else {
      return formatted + block
    }
  }, ''
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
 * Adds horizontal line before Home link footer, creates table of contents.
 *
 * @private
 * @param   {string} string   - Search string.
 * @param   {Object} path     - Local path of string destination.
 * @param   {Object} mappings - Map of local HTML locations to desired MD file names, locations, remote URLs, and version numbers.
 * @returns {string} Formatted string.
 */
const formatHomeFooter = (string, path, mappings) => {
  const contents = Object.values(mappings).reduce((obj, v) => {
    let name
    let parents
    if (v.path.match(/modules/g) !== null) {
      name = v.file.replace(/^(.+?)\.md$/gm, '$1')
      parents = v.path.split(/\//g).reduce((data, v) => {
        if (!data.start && v === 'modules') data.start = true
        else if (data.start) data.parents.push(v)
        return data
      }, { start: false, parents: [] }).parents
    } else if (v.path.match(/namespaces/g) !== null) {
      name = v.file.replace(/^(.+?)\.md$/gm, '$1')
      parents = v.path.split(/\//g).reduce((data, v) => {
        if (!data.start && v === 'namespaces') data.start = true
        else if (data.start) data.parents.push(v)
        return data
      }, { start: false, parents: [] }).parents
    }
    const placement = parents.reduce((ref, v) => {
      if (!ref.hasOwnProperty(v)) {
        ref[v] = {}
        return ref[v]
      } else {
        return ref[v].children
      }
    }, obj)
    placement[name] = {
      url: v.repo + '/blob/' + v.tag + '/' + v.path + '/' + v.file,
      children: {}
    }
    return obj
  }, {})
  let md = '\n'
  /**
   * Recursively generates markdown table of contents from contents object.
   *
   * @private
   * @param {Object} ref   - Object to analyze.
   * @param {number} depth - Current depth.
   */
  const recurse = (ref, depth) => {
    Object.entries(ref).forEach(entry => {
      md += Array(depth + 1).join('  ')
      md += '* ' + '[' + entry[0] + '](' + entry[1].url + ')\n'
      if (depth === 0) depth++
      if (Object.keys(entry[1].children).length > 0) {
        recurse(entry[1].children, depth + 1)
      }
    })
  }
  recurse(contents, 0)
  return string.replace(
    /^\[Home\]\(index\.html\)\n-*\n[\s\S]*/gm,
    `___\n\n## [Home](${localPathToURL(path, mappings)}/README.md)\n${md}`
  )
}

/**
 * Replaces source code urls with links to GitHub code locations and replaces #line links to GitHub-flavored #L links. Works with .js and .jsdoc extensions.
 *
 * @private
 * @param   {string} string - Search string.
 * @returns {string} Formatted string.
 */
const formatSourceCodeURLs = string => string.split(
  /([\w\d]*\.js(?:doc)?\.html#line)/g
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
          /\.js(doc)?\.html/g,
          '.js$1'
        )
      )
    } else {
      return formatted + block
    }
  },
  ''
).split(
  /([\w\d]*\.js(?:doc)?\.html)/g
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
          /\.js(doc)?\.html/g,
          '.js$1'
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
 * Replaces relative source code links with remote links. Works with .js and .jsdoc extensions.
 *
 * @private
 * @param {string} string   - Search string.
 * @param {Object} mappings - Map of local HTML locations to desired MD file names, locations, remote URLs, and version numbers.
 * @returns {string} Formatted string.
 */
const replaceSourceCodeLinks = (string, mappings) => string.split(
  /(\]\([/\w\d\-._~:?#[\]@!$&'()*\\+,;=`]*.js(?:doc)?[#L\d]*\))/g
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
  /(\[[/\w\d\-._~:?#[\]@!$&'()*\\+,;=`]*.js(?:doc)?[#L\d]*\]\()/g
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
    proc[key] = fixAsterixTypes(proc[key])
    proc[key] = removeTopNamespace(proc[key])
    proc[key] = formatTopModuleHeader(proc[key])
    proc[key] = formatLowLevelHeaders(proc[key])
    proc[key] = formatThrowsAndReturnsTypes(proc[key])
    proc[key] = formatHomeFooter(proc[key], key, mappings)
    proc[key] = formatSourceCodeURLs(proc[key])
    proc[key] = replaceModuleLinks(proc[key], mappings)
    proc[key] = replaceSourceCodeLinks(proc[key], mappings)
    proc[key] = escapeSubNamespaceStrikethrough(proc[key])
    proc[key] = escapeOrCodeBars(proc[key])
    proc[key] = escapeBarsWithinTablesFix(proc[key])
    proc[key] = decreaseBulletSpaces(proc[key])
    proc[key] = reduceDoubleLineFeed(proc[key])
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
        return `<a name="${ID}"></a>\n\n### ${content}`
      } else {
        return `### ${content}`
      }
    }
  })
  turndown.addRule('increaseH3', {
    filter: 'h3',
    replacement: (content, node) => {
      return `## ${content}\n\n`
    }
  })
  turndown.addRule('escapeBarsWithinTables', {
    filter: 'td',
    replacement: (content, node) => {
      return '| ' + content.replace(/\|/g, '\\|') + ' '
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
