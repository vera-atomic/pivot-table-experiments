# Backend things to figure out

- [ ] data normalization:
  - [ ] date hierarchies (day, week, month): we need to have these as separate columns in our dataset, ex: if a purchase order is to be made on Dec 15 2024 and we want to segment by year, a 2024 column need to exist on that row. Same for week, month. Otherwise FE has to process and insert those columns.
  - [ ] choose some columns, that will always be named the same (PIVOT_DEFAULT_SETTINGS, DEFAULT_COLUMN_SETTINGS): sku, quantity, date, year, month. These will be the filters that show up by default in the pivot table on load.
  - [ ] will aggregations always be a sum of quantity?
