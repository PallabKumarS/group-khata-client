import { Query } from "mongoose";
// biome-ignore lint/suspicious/noExplicitAny: <>
type MyFilterQuery = Record<string, any>;

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;

    if (searchTerm) {
      const orConditions: MyFilterQuery[] = searchableFields
        .map((field) => {
          if (field === "size") {
            const numericValue = Number(searchTerm);
            if (!Number.isNaN(numericValue)) return { [field]: numericValue };
            return null;
          }

          // Handle string fields (title, etc.)
          return {
            [field]: { $regex: new RegExp(searchTerm as string, "i") },
          };
        })
        .filter((condition): condition is MyFilterQuery => condition !== null);

      if (orConditions.length > 0) {
        this.modelQuery = this.modelQuery.find({ $or: orConditions });
      }
    }

    return this;
  }

  // filter here for filtering
  filter() {
    const queryObj = { ...this.query }; // copy

    // Filtering
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];

    excludeFields.map((el) => delete queryObj[el]);

    if ("status" in queryObj && queryObj.status === "") {
      delete queryObj.status;
    }

    this.modelQuery = this.modelQuery.find(queryObj as MyFilterQuery);

    return this;
  }

  // sorting here
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 8;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.replace(/,/g, " ") || "-__v";

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const totalDoc = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(totalDoc / limit);

    return {
      page,
      limit,
      totalDoc,
      totalPage,
    };
  }
}

export default QueryBuilder;
