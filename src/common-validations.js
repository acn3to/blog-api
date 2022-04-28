const { InvalidArgumentError } = require("./errors");

module.exports = {
  stringFieldNotNull: (value, name) => {
    if (typeof value !== "string" || value === 0)
      throw new InvalidArgumentError(`Field ${name} should be filled!`);
  },

  minFieldSize: (value, name, minimun) => {
    if (value.length < minimun)
      throw new InvalidArgumentError(
        `The field ${name} should have more than ${minimun} characters!`
      );
  },

  maxFieldSize: (value, name, maximun) => {
    if (value.length > maximun)
      throw new InvalidArgumentError(
        `The field ${name} should have less than ${maximun} characters!`
      );
  },
};
