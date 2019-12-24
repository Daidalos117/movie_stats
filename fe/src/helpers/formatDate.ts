import { DateTime } from 'luxon';

const fromISO = (dateTime: string): DateTime =>
  DateTime.fromISO(dateTime, {
    zone: 'UTC'
  });

export  {
  fromISO
}
