const { range, forEach, flattenDeep, uniq, sortBy, isNaN, isInteger } = require('lodash');

const validateMinutes = minute => {
  if (isNaN(minute) || !isInteger(minute) || minute < 0 || minute >= 60) {
    return false;
  }
  return true;
};

const validateIncrementMinutes = minute => {
  if (isNaN(minute) || !isInteger(minute) || minute <= 0 || minute >= 60) {
    return false;
  }
  return true;
};

const getValuesInRange = (start, end, increment) => {
  let possibleValues = [];
  let i = start;
  while(i<=end && i < 60) {
    possibleValues.push(i);
    i+=increment;
  }
  return possibleValues;
}

const evaluateMinutesUtil = value => {
  let computedMinutes;
  if (value === '*') {
    computedMinutes = range(0,60);
  }
  else if (value.includes('*/')) {
    const index = value.indexOf('/');
    const subString = value.slice(index+1);
    const minuteNumber = Number(subString);
    if (!validateIncrementMinutes(minuteNumber) || index !== 1) {
      return false;
    }
    computedMinutes = getValuesInRange(0, 60, minuteNumber);
  }
  else if (value.includes('/')) {
    const slashIndex = value.indexOf('/');
    const firstPart = value.slice(0, slashIndex);
    const secondPart = value.slice(slashIndex+1);
    const rangeIndex = firstPart.indexOf('-');
    if (rangeIndex === -1) {
      const firstPartNumber = Number(firstPart);
      const secondPartNumber = Number(secondPart);
      if (!validateMinutes(firstPartNumber) || !validateIncrementMinutes(secondPartNumber)) {
        return false;
      }
      computedMinutes = getValuesInRange(firstPartNumber, 60, secondPartNumber);
    } else {
      const firstRange = value.slice(0, rangeIndex);
      const secondRange = value.slice(rangeIndex+1, slashIndex);
      const firstRangeNumber = Number(firstRange);
      const secondRangeNumber = Number(secondRange);
      const incrementMinutes = Number(secondPart);
      if (!validateMinutes(firstRangeNumber) || !validateMinutes(secondRangeNumber) || !validateMinutes(incrementMinutes) || (firstRangeNumber > secondRangeNumber)) {
        return false;
      }
      computedMinutes = getValuesInRange(firstRangeNumber, secondRangeNumber, incrementMinutes);
    }
  } else if (value.includes('-')) {
    const rangeIndex = value.indexOf('-');
    const firstRange = value.slice(0, rangeIndex);
    const secondRange = value.slice(rangeIndex+1);
    const firstRangeNumber = Number(firstRange);
    const secondRangeNumber = Number(secondRange);
    if (!validateMinutes(firstRangeNumber) || !validateMinutes(secondRangeNumber) || (firstRangeNumber > secondRangeNumber)) {
      return false;
    }
    computedMinutes = range(firstRangeNumber, secondRangeNumber+1);
  } else {
    const minuteNumber = Number(value);
    if (!validateMinutes(minuteNumber)) {
      return false;
    }
    computedMinutes = [minuteNumber];
  }
  return computedMinutes;
};

const evaluateMinutes = value => {
  if (value.includes(',')) {
    let valuesArray = value.split(',');
    let responses = [];
    let failed = false;
    forEach(valuesArray, values => {
      let response = evaluateMinutesUtil(values);
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
    return evaluateMinutesUtil(value);
  }
};

module.exports = {
  evaluateMinutes,
};