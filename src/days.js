const { range, forEach, flattenDeep, uniq, sortBy, isNaN, isInteger } = require('lodash');

const validateDays = day => {
  if (isNaN(day) || !isInteger(day) || day <= 0 || day >= 32) {
    return false;
  }
  return true;
};

const validateIncrementDays = day => {
  if (isNaN(day) || !isInteger(day) || day <= 0 || day >= 32) {
    return false;
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

const evaluateDaysUtil = value => {
  let computedDays;
  if (value === '*') {
    computedDays = range(1,32);
  }
  else if (value.includes('*/')) {
    const index = value.indexOf('/');
    const subString = value.slice(index+1);
    const dayNumber = Number(subString);
    if (!validateIncrementDays(dayNumber) || index !== 1) {
      return false;
    }
    computedDays = getValuesInRange(1, 31, dayNumber);
  }
  else if (value.includes('/')) {
    const slashIndex = value.indexOf('/');
    const firstPart = value.slice(0, slashIndex);
    const secondPart = value.slice(slashIndex+1);
    const rangeIndex = firstPart.indexOf('-');
    if (rangeIndex === -1) {
      const firstPartNumber = Number(firstPart);
      const secondPartNumber = Number(secondPart);
      if (!validateDays(firstPartNumber) || !validateIncrementDays(secondPartNumber)) {
        return false;
      }
      computedDays = getValuesInRange(firstPartNumber, 31, secondPartNumber);
    } else {
      const firstRange = value.slice(0, rangeIndex);
      const secondRange = value.slice(rangeIndex+1, slashIndex);
      let firstRangeNumber = Number(firstRange);
      let secondRangeNumber = Number(secondRange);
      let incrementMinutes = Number(secondPart);
      if (!validateDays(firstRangeNumber) || !validateDays(secondRangeNumber) || !validateDays(incrementMinutes) || (firstRangeNumber > secondRangeNumber)) {
        return false;
      }
      computedDays = getValuesInRange(firstRangeNumber, secondRangeNumber, incrementMinutes);
    }
  } else if (value.includes('-')) {
    const rangeIndex = value.indexOf('-');
    const firstRange = value.slice(0, rangeIndex);
    const secondRange = value.slice(rangeIndex+1);
    let firstRangeNumber = Number(firstRange);
    let secondRangeNumber = Number(secondRange);
    if (!validateDays(firstRangeNumber) || !validateDays(secondRangeNumber) || (firstRangeNumber > secondRangeNumber)) {
      return false;
    }
    computedDays = range(firstRangeNumber, secondRangeNumber+1);
  } else {
    const dayNumber = Number(value);
    if (!validateDays(dayNumber)) {
      return false;
    }
    computedDays = [dayNumber];
  }
  return computedDays;
};

const evaluateDays = value => {
  if (value.includes(',')) {
    let valuesArray = value.split(',');
    let responses = [];
    let failed = false;
    forEach(valuesArray, values => {
      let response = evaluateDaysUtil(values);
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
    return evaluateDaysUtil(value);
  }
};

module.exports = {
  evaluateDays,
};