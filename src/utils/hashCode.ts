export default (string: string) => {
  let high = 0xdeadbee;

  for (let index = 0; index < string.length; index += 1) {
    high = Math.imul(high ^ string.charCodeAt(index), 2654435761);
  }

  const sanitized = (high ^ (high >>> 16)) >>> 0;

  return sanitized.toString();
};
