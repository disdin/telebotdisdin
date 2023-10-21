export const getFileExtension = filename => {
  const regex = /(?:\.([^.]+))?$/;
  return regex.exec(filename)[1];
};
