// supabase
import { supabaseClient } from '$lib/db';

// get 1 or more records
const getRecords = async (
  table: string,
  columns: string = '*',
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
  const { data, error } = await supabaseClient
  .from(table)
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
  columns: string = '*',
) => {
  const { data, error } = await supabaseClient
  .from(table)
  .insert(values)
  .select(columns)

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
  } = {},
  columns: string = '*',
) => {
  const { data, error } = await supabaseClient
  .from(table)
  .update(values)
  .match(match)
  .select(columns)

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const updateRecordsGreatherThan = async (
  table: string,
  values: {},
  greaterThan: {
    column: string,
    value: any,
  },
  columns: string = '*',
) => {
  const { data, error } = await supabaseClient
  .from(table)
  .update(values)
  .gt(greaterThan.column, greaterThan.value)
  .select(columns)

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
  } = {},
  columns: string = '*',
) => {
  const { data, error } = await supabaseClient
  .from(table)
  .delete()
  .match(match)
  .select(columns)

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

export {
  getRecords,
  insertRecords,
  updateRecords,
  updateRecordsGreatherThan,
  deleteRecords,
};