const stringToBoolean = function (str) {
  if (typeof str === "string") {
    switch (str.toLowerCase().trim()) {
      case "true":
      case "yes":
      case "1":
        return true;

      case "false":
      case "no":
      case "0":
      case null:
        return false;
    }
  }
  else
    return Boolean(str);
}

module.exports = { stringToBoolean }
