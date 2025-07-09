const paginate = async (model, query = {}, reqQuery = {}, options = {}) => {
  const { page = 1, limit = 2, sort = "-createAt" } = reqQuery;
  const paginationOption = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    ...options,
  };
  try {
    const result = await model.paginate(query, paginationOption);
    return {
      data: result.docs,
      lastPage: result.lastPage,
      nextPage: result.nextPage,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      currentPage: result.page,
      counter: result.pagingCounter,
      limit: result.limit,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
    };
  } catch (error) {
    console.log("Pagination Error", error.message);
  }
};

module.exports = paginate;
