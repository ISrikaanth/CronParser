const { range, includes, indexOf, forEach, flattenDeep, uniq, sortBy, isNaN, isInteger} = require('lodash');

const daysofweeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const validateDaysOfWeeks = (dayofweek, dayname) => {
  if (isNaN(dayofweek)) {
    if (!includes(daysofweeks, dayname)) {
      return false;
    }
  }
  else {
    if (dayofweek <= 0  || dayofweek >= 8 || !isInteger(dayofweek)) {
      return false;
    }
  }
  return true;
};

const getValuesInRange = (start, end, increment) => {
  let possibleValues = [];
  let i = start;
  while(i<=end) {
    possibleValues.push(i);
    i+=increment;
  }
  return possibleValues;
}

const evaluateDaysofWeekUtil = value => {
  let computeDaysofWeek;
  if (value === '*') {
    computeDaysofWeek = range(1,8);
  }
  else if (value.includes('*/')) {
    const index = value.indexOf('/');
    const subString = value.slice(index+1);
    const dayOfWeekNumber = Number(subString);
    if (!validateDaysOfWeeks(dayOfWeekNumber, subString) || index !== 1) {
      return false;
    }
    if (isNaN(dayOfWeekNumber)) {
      dayOfWeekNumber = indexOf(daysofweeks, subString) + 1;
    }
    computeDaysofWeek = getValuesInRange(1, 7, dayOfWeekNumber);
  }
  else if (value.includes('/')) {
    const slashIndex = value.indexOf('/');
    const firstPart = value.slice(0, slashIndex);
    const secondPart = value.slice(slashIndex+1);
    const rangeIndex = firstPart.indexOf('-');
    if (rangeIndex === -1) {
      let firstPartNumber = Number(firstPart);
      let secondPartNumber = Number(secondPart);
      if (!validateDaysOfWeeks(firstPartNumber, firstPart) || !validateDaysOfWeeks(secondPartNumber, secondPart)) {
        return false;
      }
      if (isNaN(firstPartNumber)) {
        firstPartNumber = indexOf(daysofweeks, firstPart) + 1;
      }
      if (isNaN(secondPartNumber)) {
        secondPartNumber = indexOf(daysofweeks, secondPart) + 1;
      }
      computeDaysofWeek = getValuesInRange(firstPartNumber, 7, secondPartNumber);
    } else {
      const firstRange = value.slice(0, rangeIndex);
      const secondRange = value.slice(rangeIndex+1, slashIndex);
      let firstRangeNumber = Number(firstRange);
      let secondRangeNumber = Number(secondRange);
      let incrementdaysofweeks = Number(secondPart);
      if (!validateDaysOfWeeks(firstRangeNumber, firstRange) || !validateDaysOfWeeks(secondRangeNumber, secondRange) || !validateDaysOfWeeks(incrementdaysofweeks, secondPart)) {
        return false;
      }
      if (!firstRangeNumber) {
        firstRangeNumber = indexOf(daysofweeks, firstRange) + 1;
      }
      if (!secondRangeNumber) {
        secondRangeNumber = indexOf(daysofweeks, secondRange) + 1;
      }
      if (!incrementdaysofweeks) {
        incrementdaysofweeks = indexOf(daysofweeks, secondPart) + 1;
      }
      if (firstRangeNumber > secondRangeNumber) {
        return false;
      }
      computeDaysofWeek = getValuesInRange(firstRangeNumber, secondRangeNumber, incrementdaysofweeks);
    }
  } else if (value.includes('-')) {
    const rangeIndex = value.indexOf('-');
    const firstRange = value.slice(0, rangeIndex);
    const secondRange = value.slice(rangeIndex+1);
    let firstRangeNumber = Number(firstRange);
    let secondRangeNumber = Number(secondRange);
    if (!validateDaysOfWeeks(firstRangeNumber, firstRange) || !validateDaysOfWeeks(secondRangeNumber, secondRange)) {
      return false;
    }
    if (!firstRangeNumber) {
      firstRangeNumber = indexOf(daysofweeks, firstRange) + 1;
    }
    if (!secondRangeNumber) {
      secondRangeNumber = indexOf(daysofweeks, secondRange) + 1;
    }
    if (firstRangeNumber > secondRangeNumber) {
      return false;
    }
    computeDaysofWeek = range(firstRangeNumber, secondRangeNumber+1);
  } else {
    let dayOfWeekNumber = Number(value);
    if (!validateDaysOfWeeks(dayOfWeekNumber, value)) {
      return false;
    }
    if (!dayOfWeekNumber) {
      dayOfWeekNumber = indexOf(daysofweeks, value) + 1;
    }
    computeDaysofWeek = [dayOfWeekNumber];
  }
  return computeDaysofWeek;
};

const evaluateDaysOfWeek = value => {
  if (value.includes(',')) {
    let valuesArray = value.split(',');
    let responses = [];
    let failed = false;
    forEach(valuesArray, values => {
      let response = evaluateDaysofWeekUtil(values);
      if (response) {
        responses.push(response);
      }
      else {
        failed = true;
        return false;
      }
    });
    if (failed) {
      return false;
    } else {
      let flatResponse = flattenDeep(responses);
      flatResponse = uniq(flatResponse);
      flatResponse = sortBy(flatResponse);
      return flatResponse;
    }
  } else {
    return evaluateDaysofWeekUtil(value);
  }
};

module.exports = {
  evaluateDaysOfWeek,
};