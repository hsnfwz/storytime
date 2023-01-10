// svelte
import { dev } from '$app/environment';

// config
import supabase from '$config/supabase';

// get 1 or more records
const getRecords = async (
  table: string,
  columns: string = 'id',
  match: {
    [key: string]: string | number,
  } = {},
  order: {
    column: string,
    ascending: boolean,
  } = {
    column: 'created_at',
    ascending: false,
  },
  range: {
    from: number,
    to: number,
  } = {
    from: 0,
    to: 47,
  }
) => {
  let _table: string = table;

  if (dev) {
    _table = `dev_${table}`;
  } else {
    _table = `prod_${table}`;
  }

  const { data, error } = await supabase
  .from(_table)
  .select(columns)
  .match(match)
  .order(order.column, { ascending: order.ascending })
  .range(range.from, range.to)

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

// insert 1 or more records
const insertRecords = async (
  table: string,
  values: any[],
) => {
  let _table: string = table;

  if (dev) {
    _table = `dev_${table}`;
  } else {
    _table = `prod_${table}`;
  }

  const { data, error } = await supabase
  .from(_table)
  .insert(values)
  .select()

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

// update 1 or more records
const updateRecords = async (
  table: string,
  values: {},
  match: {
    [key: string]: string,
  } = {}
) => {
  let _table: string = table;

  if (dev) {
    _table = `dev_${table}`;
  } else {
    _table = `prod_${table}`;
  }

  const { data, error } = await supabase
  .from(_table)
  .update(values)
  .match(match)
  .select()

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

// delete 1 or more records
const deleteRecords = async (
  table: string,
  match: {
    [key: string]: string,
  } = {}
) => {
  let _table: string = table;

  if (dev) {
    _table = `dev_${table}`;
  } else {
    _table = `prod_${table}`;
  }

  const { data, error } = await supabase
  .from(_table)
  .delete()
  .match(match)
  .select()

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

// unique functions will appear here
// ...

export {
  getRecords,
  insertRecords,
  updateRecords,
  deleteRecords,
};