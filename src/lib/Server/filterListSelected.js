// eslint-disable-next-line no-undef
module.exports = () => ({
  exec({ $mongo: { $db } }, { domainId, tagFilters, limit = 8 }) {
    const query = {};
    if (domainId && domainId !== 'undefined') query.domainId = domainId;

    if (tagFilters && !tagFilters.selected.length) {
      if (tagFilters.include.length) query.tags = { $in: tagFilters.include };

      if (tagFilters.exclude.length) query.tags = { ...(query.tags || {}), $nin: tagFilters.exclude };
    }

    if (tagFilters && tagFilters.selected.length) {
      query._id = { $in: tagFilters.selected };
    }

    // TODO: Look at all page type collections
    return $db.collection('pages').find(query).limit(limit).toArray();
  },
});
