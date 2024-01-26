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

const incrementAndDecrement = async (tableName: string, rowId: string, incrementColumnName: string, incrementAmount: number, decrementColumnName: string, decrementAmount: number) => {
  const { data, error } = await supabaseClient.rpc('increment_and_decrement', {
    table_name: tableName,
    row_id: rowId,
    increment_column_name: incrementColumnName,
    increment_amount: incrementAmount,
    decrement_column_name: decrementColumnName,
    decrement_amount: decrementAmount,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const increment2AndDecrement = async (tableName: string, rowId: string, incrementColumnName1: string, incrementAmount1: number, incrementColumnName2: string, incrementAmount2: number, decrementColumnName: string, decrementAmount: number) => {
  const { data, error } = await supabaseClient.rpc('increment_2_and_decrement', {
    table_name: tableName,
    row_id: rowId,
    increment_column_name_1: incrementColumnName1,
    increment_amount_1: incrementAmount1,
    increment_column_name_2: incrementColumnName2,
    increment_amount_2: incrementAmount2,
    decrement_column_name: decrementColumnName,
    decrement_amount: decrementAmount,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const increment3AndDecrement = async (tableName: string, rowId: string, incrementColumnName1: string, incrementAmount1: number, incrementColumnName2: string, incrementAmount2: number, incrementColumnName3: string, incrementAmount3: number, decrementColumnName: string, decrementAmount: number) => {
  const { data, error } = await supabaseClient.rpc('increment_3_and_decrement', {
    table_name: tableName,
    row_id: rowId,
    increment_column_name_1: incrementColumnName1,
    increment_amount_1: incrementAmount1,
    increment_column_name_2: incrementColumnName2,
    increment_amount_2: incrementAmount2,
    increment_column_name_3: incrementColumnName3,
    increment_amount_3: incrementAmount3,
    decrement_column_name: decrementColumnName,
    decrement_amount: decrementAmount,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const increment = async (tableName: string, rowId: string, incrementColumnName: string, incrementAmount: number) => {
  const { data, error } = await supabaseClient.rpc('increment', {
    table_name: tableName,
    row_id: rowId,
    increment_column_name: incrementColumnName,
    increment_amount: incrementAmount,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const increment2 = async (tableName: string, rowId: string, incrementColumnName1: string, incrementAmount1: number, incrementColumnName2: string, incrementAmount2: number) => {
  const { data, error } = await supabaseClient.rpc('increment_2', {
    table_name: tableName,
    row_id: rowId,
    increment_column_name_1: incrementColumnName1,
    increment_amount_1: incrementAmount1,
    increment_column_name_2: incrementColumnName2,
    increment_amount_2: incrementAmount2,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const increment3 = async (tableName: string, rowId: string, incrementColumnName1: string, incrementAmount1: number, incrementColumnName2: string, incrementAmount2: number, incrementColumnName3: string, incrementAmount3: number) => {
  const { data, error } = await supabaseClient.rpc('increment_3', {
    table_name: tableName,
    row_id: rowId,
    increment_column_name_1: incrementColumnName1,
    increment_amount_1: incrementAmount1,
    increment_column_name_2: incrementColumnName2,
    increment_amount_2: incrementAmount2,
    increment_column_name_3: incrementColumnName3,
    increment_amount_3: incrementAmount3,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const increment4 = async (tableName: string, rowId: string, incrementColumnName1: string, incrementAmount1: number, incrementColumnName2: string, incrementAmount2: number, incrementColumnName3: string, incrementAmount3: number, incrementColumnName4: string, incrementAmount4: number) => {
  const { data, error } = await supabaseClient.rpc('increment_4', {
    table_name: tableName,
    row_id: rowId,
    increment_column_name_1: incrementColumnName1,
    increment_amount_1: incrementAmount1,
    increment_column_name_2: incrementColumnName2,
    increment_amount_2: incrementAmount2,
    increment_column_name_3: incrementColumnName3,
    increment_amount_3: incrementAmount3,
    increment_column_name_4: incrementColumnName4,
    increment_amount_4: incrementAmount4,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const increment5 = async (tableName: string, rowId: string, incrementColumnName1: string, incrementAmount1: number, incrementColumnName2: string, incrementAmount2: number, incrementColumnName3: string, incrementAmount3: number, incrementColumnName4: string, incrementAmount4: number, incrementColumnName5: string, incrementAmount5: number) => {
  const { data, error } = await supabaseClient.rpc('increment_5', {
    table_name: tableName,
    row_id: rowId,
    increment_column_name_1: incrementColumnName1,
    increment_amount_1: incrementAmount1,
    increment_column_name_2: incrementColumnName2,
    increment_amount_2: incrementAmount2,
    increment_column_name_3: incrementColumnName3,
    increment_amount_3: incrementAmount3,
    increment_column_name_4: incrementColumnName4,
    increment_amount_4: incrementAmount4,
    increment_column_name_5: incrementColumnName5,
    increment_amount_5: incrementAmount5,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const decrement = async (tableName: string, rowId: string, decrementColumnName: string, decrementAmount: number) => {
  const { data, error } = await supabaseClient.rpc('decrement', {
    table_name: tableName,
    row_id: rowId,
    decrement_column_name: decrementColumnName,
    decrement_amount: decrementAmount,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const decrement2 = async (tableName: string, rowId: string, decrementColumnName1: string, decrementAmount1: number, decrementColumnName2: string, decrementAmount2: number) => {
  const { data, error } = await supabaseClient.rpc('decrement_2', {
    table_name: tableName,
    row_id: rowId,
    decrement_column_name_1: decrementColumnName1,
    decrement_amount_1: decrementAmount1,
    decrement_column_name_2: decrementColumnName2,
    decrement_amount_2: decrementAmount2,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const decrement3 = async (tableName: string, rowId: string, decrementColumnName1: string, decrementAmount1: number, decrementColumnName2: string, decrementAmount2: number, decrementColumnName3: string, decrementAmount3: number) => {
  const { data, error } = await supabaseClient.rpc('decrement_3', {
    table_name: tableName,
    row_id: rowId,
    decrement_column_name_1: decrementColumnName1,
    decrement_amount_1: decrementAmount1,
    decrement_column_name_2: decrementColumnName2,
    decrement_amount_2: decrementAmount2,
    decrement_column_name_3: decrementColumnName3,
    decrement_amount_3: decrementAmount3,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const decrement4 = async (tableName: string, rowId: string, decrementColumnName1: string, decrementAmount1: number, decrementColumnName2: string, decrementAmount2: number, decrementColumnName3: string, decrementAmount3: number, decrementColumnName4: string, decrementAmount4: number) => {
  const { data, error } = await supabaseClient.rpc('decrement_4', {
    table_name: tableName,
    row_id: rowId,
    decrement_column_name_1: decrementColumnName1,
    decrement_amount_1: decrementAmount1,
    decrement_column_name_2: decrementColumnName2,
    decrement_amount_2: decrementAmount2,
    decrement_column_name_3: decrementColumnName3,
    decrement_amount_3: decrementAmount3,
    decrement_column_name_4: decrementColumnName4,
    decrement_amount_4: decrementAmount4,
  });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

const decrement5 = async (tableName: string, rowId: string, decrementColumnName1: string, decrementAmount1: number, decrementColumnName2: string, decrementAmount2: number, decrementColumnName3: string, decrementAmount3: number, decrementColumnName4: string, decrementAmount4: number, decrementColumnName5: string, decrementAmount5: number) => {
  const { data, error } = await supabaseClient.rpc('decrement_5', {
    table_name: tableName,
    row_id: rowId,
    decrement_column_name_1: decrementColumnName1,
    decrement_amount_1: decrementAmount1,
    decrement_column_name_2: decrementColumnName2,
    decrement_amount_2: decrementAmount2,
    decrement_column_name_3: decrementColumnName3,
    decrement_amount_3: decrementAmount3,
    decrement_column_name_4: decrementColumnName4,
    decrement_amount_4: decrementAmount4,
    decrement_column_name_5: decrementColumnName5,
    decrement_amount_5: decrementAmount5,
  });

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
  increment,
  increment2,
  increment3,
  increment4,
  increment5,
  decrement,
  decrement2,
  decrement3,
  decrement4,
  decrement5,
  incrementAndDecrement,
  increment2AndDecrement,
  increment3AndDecrement,
};