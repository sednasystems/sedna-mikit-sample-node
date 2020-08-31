const uuid = require("uuid");

exports.buildResponse = (blocks, href) => {
  blocks = blocks || [];
  href = href || null;

  return {
    id: uuid.v4(),
    version: "2020-07-07",
    blocks: blocks,
    href: href,
    trace: uuid.v4(),
  };
};

const isFormInput = (block) => {
  return ["textInput", "textArea", "calendar"].includes(block.type);
};

exports.getFormValues = (blocks) => {
  return blocks.filter(isFormInput).reduce((acc, block) => {
    acc[block.id] = block.value;
    return acc;
  }, {});
};

exports.updateBlockById = (blocks, id, newProperties) => {
  return blocks.map((b) =>
    b.id === id
      ? {
          ...b,
          ...newProperties,
        }
      : b
  );
};
