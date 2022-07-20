import { Filter, QueryParams } from "@typesModule/types";
import { defaultFilters } from "./getFilters";

const filterName = defaultFilters[0]

export const defaultQueryParams: QueryParams = {
   page: 1,
   pageSize: 10,
   filters: [filterName],
   sort: 'asc',
   searchValue: ''
}

export const getQueryParams = (filter: Filter) => ({
   ...defaultQueryParams,
   filters: [filter]
})