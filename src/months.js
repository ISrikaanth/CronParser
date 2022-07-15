const { range, includes, indexOf, forEach, flattenDeep, uniq, sortBy, isNaN, isInteger} = require('lodash');

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const validateMonths = (month, monthName) => {
  if (isNaN(month)) {
    if (!includes(months, monthName)) {
      return false;
    }
  }
  else {
    if (month <= 0 || month >= 13 || !isInteger(month)) {
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

const evaluateMonthsUtil = value => {
  let computedMonths;
  if (value === '*') {
    computedMonths = range(1,13);
  }
  else if (value.includes('*/')) {
    const index = value.indexOf('/');
    const subString = value.slice(index+1);
    const monthNumber = Number(subString);
    if (!validateMonths(monthNumber, subString) || index !== 1) {
      return false;
    }
    if (isNaN(monthNumber)) {
      monthNumber = indexOf(months, subString) + 1;
    }
    computedMonths = getValuesInRange(1, 12, monthNumber);
  }
  else if (value.includes('/')) {
    const slashIndex = value.indexOf('/');
    const firstPart = value.slice(0, slashIndex);
    const secondPart = value.slice(slashIndex+1);
    const rangeIndex = firstPart.indexOf('-');
    if (rangeIndex === -1) {
      let firstPartNumber = Number(firstPart);
      let secondPartNumber = Number(secondPart);
      if (!validateMonths(firstPartNumber, firstPart) || !validateMonths(secondPartNumber, secondPart)) {
        return false;
      }
      if (isNaN(firstPartNumber)) {
        firstPartNumber = indexOf(months, firstPart) + 1;
      }
      if (isNaN(secondPartNumber)) {
        secondPartNumber = indexOf(months, secondPart) + 1;
      }
      computedMonths = getValuesInRange(firstPartNumber, 12, secondPartNumber);
    } else {
      const firstRange = value.slice(0, rangeIndex);
      const secondRange = value.slice(rangeIndex+1, slashIndex);
      let firstRangeNumber = Number(firstRange);
      let secondRangeNumber = Number(secondRange);
      let incrementMonths = Number(secondPart);
      if (!validateMonths(firstRangeNumber, firstRange) || !validateMonths(secondRangeNumber, secondRange) || !validateMonths(incrementMonths, secondPart)) {
        return false;
      }
      if (!firstRangeNumber) {
        firstRangeNumber = indexOf(months, firstRange) + 1;
      }
      if (!secondRangeNumber) {
        secondRangeNumber = indexOf(months, secondRange) + 1;
      }
      if (!incrementMonths) {
        incrementMonths = indexOf(months, secondPart) + 1;
      }
      if (firstRangeNumber > secondRangeNumber) {
        return false;
      }
      computedMonths = getValuesInRange(firstRangeNumber, secondRangeNumber, incrementMonths);
    }
  } else if (value.includes('-')) {
    const rangeIndex = value.indexOf('-');
    const firstRange = value.slice(0, rangeIndex);
    const secondRange = value.slice(rangeIndex+1);
    let firstRangeNumber = Number(firstRange);
    let secondRangeNumber = Number(secondRange);
    if (!validateMonths(firstRangeNumber, firstRange) || !validateMonths(secondRangeNumber, secondRange)) {
      return false;
    }
    if (!firstRangeNumber) {
      firstRangeNumber = indexOf(months, firstRange) + 1;
    }
    if (!secondRangeNumber) {
      secondRangeNumber = indexOf(months, secondRange) + 1;
    }
    if (firstRangeNumber > secondRangeNumber) {
      return false;
    }
    computedMonths = range(firstRangeNumber, secondRangeNumber+1);
  } else {
    let monthNumber = Number(value);
    if (!validateMonths(monthNumber, value)) {
      return false;
    }
    if (!monthNumber) {
      monthNumber = indexOf(months, value) + 1;
    }
    computedMonths = [monthNumber];
  }
  return computedMonths;
};

const evaluateMonths = value => {
  if (value.includes(',')) {
    let valuesArray = value.split(',');
    let responses = [];
    let failed = false;
    forEach(valuesArray, values => {
      let response = evaluateMonthsUtil(values);
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
    return evaluateMonthsUtil(value);
  }
};

module.exports = {
  evaluateMonths,
};