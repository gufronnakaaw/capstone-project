export const siteAddress = 'Pusakanagara, Baregbeg, Ciamis';

export const openingHoursLabel = 'Senin–Sabtu · 08.00–15.00';

const OPEN_HOUR = 8;
const CLOSE_HOUR = 15;
const TIME_ZONE = 'Asia/Jakarta';

const weekdays: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function getOpenStatus(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const day = weekdays[parts.find((part) => part.type === 'weekday')?.value ?? 'Sun'];
  const hour = Number(parts.find((part) => part.type === 'hour')?.value);
  const isOpenDay = day !== 0;

  if (isOpenDay && hour >= OPEN_HOUR && hour < CLOSE_HOUR) {
    return { open: true, label: 'Buka sekarang' };
  }
  if (isOpenDay && hour < OPEN_HOUR) {
    return { open: false, label: 'Tutup · buka hari ini pukul 08.00' };
  }
  if (day >= 1 && day <= 5) {
    return { open: false, label: 'Tutup · buka besok pukul 08.00' };
  }
  return { open: false, label: 'Tutup · buka lagi Senin, 08.00' };
}
