import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/ru';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekday);
dayjs.locale('ru');

export default dayjs;
