const slice = (arr, size) => {
  const result = [];
  const chunksCount = Math.ceil(arr.length / size);
  for (let i = 0; i < chunksCount; i++) {
    result[i] = arr.slice(
      i * size,
      i * size + size,
    );
  }
  return result;
}
