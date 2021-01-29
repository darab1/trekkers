class QueryOptions {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    const queryObj = { ...this.queryObject }; // create a hard copy of the query

    const excludedQueryFields = ['sort', 'limit', 'page', 'fields'];
    excludedQueryFields.forEach(el => delete queryObj[el]);

    // Filtering using lte, lt, gte, gt operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      console.log(this.queryObject);

      const sortStr = this.queryObject.sort.split(',').join(' ');
      this.query = this.query.sort(sortStr);
    } else {
      this.query = this.query.sort('price');
    }

    return this;
  }

  limitFields() {
    if (this.queryObject.fields) {
      const fieldsStr = this.queryObject.fields.split(',').join(' ');
      this.query = this.query.select(fieldsStr);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryObject.page * 1 || 1;
    const limit = this.queryObject.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = QueryOptions;
