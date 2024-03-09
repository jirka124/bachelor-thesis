import fs from "fs";

export const delay = (time = 0) => {
  return new Promise((res) => {
    setTimeout(() => res(), time || 0);
  });
};

export const fileStat = (filePath) => {
  let fileStats = null;
  try {
    fileStats = fs.statSync(filePath);
  } catch (e) {}
  return fileStats;
};

export const calcQuartiles = (data) => {
  // DATA MUST BE SORTED!
  const res = {};

  res.q1 = calcQuartile(data, 0.25);
  res.q2 = calcQuartile(data, 0.5);
  res.q3 = calcQuartile(data, 0.75);

  return res;
};

export const calcQuartile = (data, Q) => {
  // DATA MUST BE SORTED!

  if (data.length < 1) return NaN;

  // calculate index of Q
  const index = data.length * Q - 1;
  if (index < 0) console.error("NOT ENOUGH DATA for: " + Q);

  // Check if index positions are integers
  if (Number.isInteger(index)) return data[index];
  else {
    const lowerIndex = Math.floor(index);

    const gap = data[lowerIndex + 1] - data[lowerIndex];
    const gapMod = index - lowerIndex;

    return data[lowerIndex] + gapMod * gap;
  }
};

export default {
  delay,
  calcQuartiles,
  calcQuartile,
};
