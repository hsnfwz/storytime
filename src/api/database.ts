// config
import supabase from '$config/supabase';

// get 1 or more records
const getRecords = async (
  table: string,
  columns: string = 'id',
  filter: {} = {},
  sort: {
    column: string,
    options: {
      ascending: boolean,
    },
  } = {
    column: 'created_at',
    options: {
      ascending: false,
    },
  },
  limit: number = 100,
) => {
  const { data, error } = await supabase
  .from(table)
  .select(columns)
  .match(filter)
  .order(sort.column, sort.options)
  .limit(limit);

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
  const { data, error } = await supabase
  .from(table)
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
  filter: {},
) => {
  const { data, error } = await supabase
  .from(table)
  .update(values)
  .match(filter)
  .select();

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

// delete 1 or more records
const deleteRecords = async (
  table: string,
  filter: {},
) => {
  const { data, error } = await supabase
  .from(table)
  .delete()
  .match(filter)
  .select();

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