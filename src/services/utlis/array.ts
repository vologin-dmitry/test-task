export const slice = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  const chunksCount = Math.ceil(arr.length / size);
  for (let i = 0; i < chunksCount; i++) {
    result[i] = arr.slice(
      i * size,
      i * size + size,
    );
  }
  return result;
};
