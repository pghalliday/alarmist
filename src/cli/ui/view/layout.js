export function createLayout(screen) {
  const elements = [];
  return {
    append: (element) => {
      elements.push(element);
      screen.append(element);
    },
    apply: () => {
      let top = 0;
      for (let element of elements) {
        element.top = top;
        top += element.height;
      }
    },
  };
}
