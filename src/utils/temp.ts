const originalTempClickArrows = {};
export const tempClickArrows = new Proxy(originalTempClickArrows, {
  get(target, prop) {
    const storedData = localStorage.getItem("tempClickArrows");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (prop in parsedData) {
        return parsedData[prop];
      }
    }

    return target[prop];
  },

  set(target, prop, value) {
    const object = {};
    object[prop] = value;
    localStorage.setItem("tempClickArrows", JSON.stringify(object));
    return true;
  }
});
