module.exports = {
  hasNull: (body, attributes) => {
    for(const attribute of attributes) {
      if(!body[attribute] || body[attribute] === undefined || body[attribute] === null) {
        return true;
      }
    }
    return false;
  }
} 