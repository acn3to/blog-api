const { InvalidArgumentError } = require("./errors");

module.exports = {
  stringFieldNotNull(value, name) {
    if (typeof value !== "string" || value === 0)
      throw new InvalidArgumentError(`Field ${name} should be filled!`);
  },

  minFieldSize(value, name, minimum) {
    if (value.length < minimum)
      throw new InvalidArgumentError(
        `The ${name} field should have more than ${minimum} characters!`
      );
  },

  maxFieldSize(value, name, maximum) {
    if (value.length > maximum)
      throw new InvalidArgumentError(
        `The ${name} field should have less than ${maximum} characters!`
      );
  },
};
