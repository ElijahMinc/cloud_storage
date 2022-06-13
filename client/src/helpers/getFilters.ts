import { Filter, QueryParams } from "../types/types";

export const defaultFilters: Filter[] = [
   {
      id: 1,
      value: 'name'
   },
   {
      id: 2,
      value: 'type'
   },
   {
      id: 3,
      value: 'date'
   },
   
]



export const setFilters = (filter: Filter): QueryParams => {
   
   return {
      page: 1,
      pageSize: 10,
      filters: [filter],
      sort: 'asc',
      searchValue: ''
   }
}