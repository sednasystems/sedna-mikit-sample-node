const _ = require('lodash')
const uuid = require('uuid')

exports.buildResponse = (blocks, href) => {
  blocks = blocks || []
  href = href || null
  return {
    version: '2020-07-07',
    blocks: blocks,
    href: href,
    trace: uuid.v4()
  }
}

const isFormInput = (block) => {
  return _.includes(['textInput', 'textArea', 'calendar'], block.type)
}

exports.getFormValues = (blocks) => {
  return _(blocks)
    .filter(isFormInput)
    .reduce((obj, block) => {
      obj[block.id] = block.value;
      return obj
    }, {})
}

exports.updateBlockById = (blocks, id, newProperties) => {
  var index = _.findIndex(blocks, {id: id})
  if (0 > index) return blocks;
  const obj = _.merge({}, blocks[index], newProperties)
  blocks[index] = obj
  return blocks
}
