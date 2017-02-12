export default function(f) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      f(...args, (error, ...results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };
}
