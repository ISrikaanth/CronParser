const { range, forEach, flattenDeep, uniq, sortBy, isNaN, isInteger } = require('lodash');

const validateHours = hour => {
  if (isNaN(hour) || !isInteger(hour) || hour < 0 || hour >= 24) {
    return false;
  }
  return true;
};

const validateIncrementHours = hour => {
  if (isNaN(hour) || !isInteger(hour) || hour <= 0 || hour >= 24) {
    return false;
  }
  return true;
};

const getValuesInRange = (start, end, increment) => {
  let possibleValues = [];
  let i = start;
  while(i<=end && i < 24) {
    possibleValues.push(i);
    i+=increment;
  }
  return possibleValues;
}

const evaluateHoursUtil = value => {
  let computedHours;
  if (value === '*') {
    computedHours = range(0,24);
  }
  else if (value.includes('*/')) {
    const index = value.indexOf('/');
    const subString = value.slice(index+1);
    const hourNumber = Number(subString);
    if (!validateIncrementHours(hourNumber) || index !== 1) {
      return false;
    }
    computedHours = getValuesInRange(0, 24, hourNumber);
  }
  else if (value.includes('/')) {
    const slashIndex = value.indexOf('/');
    const firstPart = value.slice(0, slashIndex);
    const secondPart = value.slice(slashIndex+1);
    const rangeIndex = firstPart.indexOf('-');
    if (rangeIndex === -1) {
      const firstPartNumber = Number(firstPart);
      const secondPartNumber = Number(secondPart);
      if (!validateHours(firstPartNumber) || !validateIncrementHours(secondPartNumber)) {
        return false;
      }
      computedHours = getValuesInRange(firstPartNumber, 24, secondPartNumber);
    } else {
      const firstRange = value.slice(0, rangeIndex);
      const secondRange = value.slice(rangeIndex+1, slashIndex);
      const firstRangeNumber = Number(firstRange);
      const secondRangeNumber = Number(secondRange);
      const incrementMinutes = Number(secondPart);
      if (!validateHours(firstRangeNumber) || !validateHours(secondRangeNumber) || !validateHours(incrementMinutes) || (firstRangeNumber > secondRangeNumber)) {
        return false;
      }
      computedHours = getValuesInRange(firstRangeNumber, secondRangeNumber, incrementMinutes);
    }
  } else if (value.includes('-')) {
    const rangeIndex = value.indexOf('-');
    const firstRange = value.slice(0, rangeIndex);
    const secondRange = value.slice(rangeIndex+1);
    const firstRangeNumber = Number(firstRange);
    const secondRangeNumber = Number(secondRange);
    if (!validateHours(firstRangeNumber) || !validateHours(secondRangeNumber) || (firstRangeNumber > secondRangeNumber)) {
      return false;
    }
    computedHours = range(firstRangeNumber, secondRangeNumber+1);
  } else {
    const hourNumber = Number(value);
    if (!validateHours(hourNumber)) {
      return false;
    }
    computedHours = [hourNumber];
  }
  return computedHours;
};

const evaluateHours = value => {
  if (value.includes(',')) {
    let valuesArray = value.split(',');
    let responses = [];
    let failed = false;
    forEach(valuesArray, values => {
      let response = evaluateHoursUtil(values);
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
    return evaluateHoursUtil(value);
  }
};

module.exports = {
  evaluateHours,
};