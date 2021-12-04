import _ from "lodash";
import {string} from "prop-types";

export function box<T>(multiplicityMaybe: T[] | T | undefined): T[] {
  if (_.isUndefined(multiplicityMaybe)) {
    return [];
  } else if (_.isArray(multiplicityMaybe)) {
    return multiplicityMaybe;
  } else {
    return [multiplicityMaybe];
  }
}

// {a: {b: c, d: e}}
// {b: {a: c}, d: {a: e}}
function swapPrimaryKey(base: Object): any {
  let retVal: { [key: string]: any } = {}
  for (const [rootKey, objectValue] of Object.entries(base)) {
    if (_.isObject(objectValue)) {
      for (const [key, value] of Object.entries(objectValue)) {
        const addedKey: { [key: string]: any } = {}
        addedKey[rootKey] = value;
        if (_.isObject(retVal[key])) {
          _.assign(retVal[key], addedKey);
        } else {
          retVal[key] = addedKey;
        }
      }
    }
  }
  return retVal;
}

// Make the key at the top level (such as pop type) as a property of the inner level
export function lower(top: any, loweringKey: string): any {
  // Top of the object - want to take these entries and lower them
  Object.entries(top).reduce((prior, current, {}, {}) => {
    // This 'key' is what we want to be incorporated into the values
    // If there's no key, *ignore*
    const [topKey, value] = current;
    if (_.isObject(value)) {
      return Object.entries(value).reduce((accum: { [key: string]: any }, newCurrent, {}, {}) => {
        const [settingKey, settingValue] = newCurrent;
        if (_.isObject(settingValue)) {
          accum[settingKey] = {
            ...settingValue
          }
          accum[settingKey][loweringKey] = topKey
        }
        return accum
      }, prior);
    } else {
      return value as any;
    }
  }, {});
}

declare global {
  interface ObjectConstructor {
    flatten(data: any): any;

    sortedByKeys(input: any): any;
  }
}

Object.flatten = function(data) {
  var result: any = {};
  function recurse (cur: any, prop: any) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for(var i=0, l=cur.length; i<l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0)
        result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop+"."+p : p);
      }
      if (isEmpty && prop)
        result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

Object.sortedByKeys = function (input: any): any {
  return Object.keys(input).sort().reduce(
    (obj: any, key) => {
      obj[key] = input[key];
      return obj;
    },
    {}
  );
}