"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterQuery = void 0;
const filterQuery = (queryObj, pureKey) => {
    const filteredQuery = {};
    Object.keys(queryObj).forEach((key) => {
        if (pureKey.includes(key)) {
            filteredQuery[key] = queryObj[key];
        }
    });
    return filteredQuery;
};
exports.filterQuery = filterQuery;
