import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function fDateDifference(inputDateString) {
  const inputDate = new Date(inputDateString);
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate - inputDate;
  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays === 0) {
    return 'Today';
  }
  if (differenceInDays === 1) {
    return 'Yesterday';
  }
  return `${differenceInDays} days ago`;
}
