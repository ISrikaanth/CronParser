const { evaluateMinutes } = require('./minutes');
const { evaluateHours } = require('./hours');
const { evaluateDays } = require('./days');
const { evaluateMonths } = require('./months');
const { evaluateDaysOfWeek } = require('./daysofweek');

const cronExpression = process.argv[2];

const evaluateCronExpression = cronExpression => {
  const values = cronExpression.split(' ');
  const computedMinutes = evaluateMinutes(values[0]);
  const computedHours = evaluateHours(values[1]);
  const computedDays = evaluateDays(values[2]);
  const computedMonths = evaluateMonths(values[3]);
  const computedDaysofWeek = evaluateDaysOfWeek(values[4]);
  const fileToRun = values[5];

  console.log('minute        ', computedMinutes ? computedMinutes.join(' ') : 'Invalid Expression For Minutes');
  console.log('hour          ', computedHours ? computedHours.join(' ') : 'Invalid Expression For Hours');
  console.log('day of month  ', computedDays ? computedDays.join(' ') : 'Invalid Expression For Days');
  console.log('month         ', computedMonths ? computedMonths.join(' ') : 'Invalid Expression For Months');
  console.log('day of week   ', computedDaysofWeek ? computedDaysofWeek.join(' ') : 'Invalid Expression For Days Of Week');
  console.log('command       ', fileToRun);
};

evaluateCronExpression(cronExpression);