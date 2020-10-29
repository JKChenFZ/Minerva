function isNullOrUndefined(valueToCheck) {
    return valueToCheck === undefined || valueToCheck === null;
}

function includesNullOrUndefined(valuesToCheck) {
    return valuesToCheck.some(isNullOrUndefined);
}

export { isNullOrUndefined, includesNullOrUndefined };
