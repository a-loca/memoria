export function getFormattedDate(date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[date.getUTCMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

export function transformRange(value, from, to) {
  const [from_min, from_max] = from;
  const [to_min, to_max] = to;
  const oldRange = from_max - from_min;
  const newRange = to_max - to_min;
  return ((value - from_min) * newRange) / oldRange + to_min;
}

export function lerp(current, target, amount) {
  // Linear interpolation: bring the current value closer
  // to the target value by a specified amount
  return current * (1 - amount) + target * amount;
}
