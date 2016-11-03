exports.validate = data => {
  for (const key in data) {
    if (typeof data[key] !== 'string') {
      throw new Error(`${key} was required`);
    }
  }
}
