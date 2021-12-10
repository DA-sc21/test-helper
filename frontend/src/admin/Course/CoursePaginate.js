import _ from 'lodash';

export function coursePaginate(items, pageNumber, pageSize) {
    const startIndex = (pageNumber - 1) * pageSize;
    // console.log(items)

    return _(items)
        .slice(startIndex)
        .take(pageSize)
        .value();
}
