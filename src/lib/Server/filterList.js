// eslint-disable-next-line no-undef
module.exports = () => ({
  exec({ $mongo: { $db } }, { domainId, tagFilters, headerFilter, pageIndex = 0, size = 20 }) {
    const queryTitle = { $exists: true, $ne: '' };

    if (headerFilter) {
      queryTitle.$regex = headerFilter;
      queryTitle.$options = 'i';
    }

    const query = {
      $or: [{ 'header.heading': queryTitle }, { 'header.title': queryTitle }],
    };
    if (domainId && domainId !== 'undefined') query.domainId = domainId;

    if (tagFilters) {
      if (tagFilters.include.length) query.tags = { ...(query.tags || {}), $all: tagFilters.include };

      if (tagFilters.exclude.length) query.tags = { ...(query.tags || {}), $nin: tagFilters.exclude };
    }

    // TODO: Look at all page type collections
    return $db
      .collection('pages')
      .find(query)
      .sort({ 'header.heading': 1 })
      .skip(pageIndex * size)
      .limit(size)
      .toArray();
  },
});
