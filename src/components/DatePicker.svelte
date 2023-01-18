<script lang="ts">
  // helpers
  import { formatDate } from '$helpers/helpers';

  // state
  let today: any = new Date();
  const todayYear: number = today.getUTCFullYear();
  const todayMonth: number = today.getUTCMonth();
  const todayDay: number = today.getUTCDate();

  // props
  export let label: string = 'Date';
  export let year: number = todayYear;
  export let month: number = todayMonth;
  export let day: number = todayDay;
  export let showError: boolean = false;

  // state
  const monthsList: { monthName: string, monthNumber: number }[] = [
    { monthName: 'January', monthNumber: 0 },
    { monthName: 'February', monthNumber: 1 },
    { monthName: 'March', monthNumber: 2 },
    { monthName: 'April', monthNumber: 3 },
    { monthName: 'May', monthNumber: 4 },
    { monthName: 'June', monthNumber: 5 },
    { monthName: 'July', monthNumber: 6 },
    { monthName: 'August', monthNumber: 7 },
    { monthName: 'September', monthNumber: 8},
    { monthName: 'October', monthNumber: 9 },
    { monthName: 'November', monthNumber: 10 },
    { monthName: 'December', monthNumber: 11 },
  ];

  let yearsList: number[] = [];

  let i = 0;
  while (i <= 100) {
    const year: number = todayYear - i;

    yearsList.push(year);

    i++;
  }

  let daysList: number[] = [];

  $: {
    const _daysList: number[] = [];
    const daysInMonth: number = new Date(year, month.monthNumber + 1, 0).getUTCDate();

    let i = 0;
    while (i < daysInMonth) {
      const day: number = i + 1;

      _daysList.push(day);

      i++;
    }

    daysList = [..._daysList];
  }

  let showYearsList: boolean = false;
  let showMonthsList: boolean = false;
  let showDaysList: boolean = false;

  const regex = new RegExp('^[0-9]+$');
</script>

<!-- <div class="flex flex-col gap-2 w-full">
  <p class={`${showError ? 'text-rose-500' : 'dark:text-white'}`}>{label}</p>
  <div class="grid sm:grid-cols-3 gap-2 items-start">
    <div
      class="flex flex-col gap-2 items-center relative rounded"
      on:mouseup={() => {
        showMonthsList = false;
        showDaysList = false;
      }}
    >
      <button
        class={`${showError ? 'border-rose-500' : 'border-neutral-100 dark:border-slate-600'} w-full p-2 flex gap-2 justify-center items-center ${showYearsList ? 'rounded-t border-x border-t' : 'rounded border'} dark:text-white bg-neutral-100 dark:bg-slate-600 transition-all hover:dark:bg-slate-500 hover:dark:border-slate-500 hover:bg-neutral-200 hover:border-neutral-200`}
        type="button"
        on:click={() => showYearsList = !showYearsList}
      >
        {year}
        {#if showYearsList}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" />
          </svg>              
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        {/if}
      </button>
      {#if showYearsList}
        <div
          id="list"
          class={`flex flex-col max-h-40 overflow-y-auto absolute top-full left-0 bg-neutral-100 z-50 w-full ${showYearsList ? 'rounded-b border-x border-b border-neutral-100 dark:border-slate-600' : ''}`}
        >
          {#each yearsList as yearItem}
            <button
              class="p-2 dark:text-white dark:bg-slate-600 transition-all hover:dark:bg-slate-500 hover:bg-neutral-200 hover:border-neutral-200"
              type="button"
              on:click={() => {
                year = yearItem;
                showYearsList = false;
              }}
            >
              {yearItem}
            </button>
          {/each}
        </div>
      {/if}
    </div>
    <div
      class="flex flex-col gap-2 items-center relative rounded"
      on:mouseup={() => {
        showYearsList = false;
        showDaysList = false;
      }}
    >
      <button
        class={`${showError ? 'border-rose-500' : 'border-neutral-100 dark:border-slate-600'} w-full p-2 flex gap-2 justify-center items-center ${showMonthsList ? 'rounded-t border-x border-t' : 'rounded border'} dark:text-white bg-neutral-100 dark:bg-slate-600 transition-all hover:dark:bg-slate-500 hover:dark:border-slate-500 hover:bg-neutral-200 hover:border-neutral-200`}
        type="button"
        on:click={() => showMonthsList = !showMonthsList}
      >
        {month.monthName}
        {#if showMonthsList}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" />
          </svg>              
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        {/if}
      </button>
      {#if showMonthsList}
        <div
          id="list"
          class={`flex flex-col max-h-40 overflow-y-auto absolute top-full left-0 bg-neutral-100 z-50 w-full ${showMonthsList ? 'rounded-b border-x border-b border-neutral-100 dark:border-slate-600' : ''}`}
        >
          {#each monthsList as monthItem}
            <button
              class="p-2 dark:text-white dark:bg-slate-600 transition-all hover:dark:bg-slate-500 hover:dark:border-slate-500 hover:bg-neutral-200 hover:border-neutral-200"
              type="button"
              on:click={() => {
                month = monthItem;
                showMonthsList = false;
              }}
            >
              {monthItem.monthName}
            </button>
          {/each}
        </div>
      {/if}
    </div>
    <div
      class="flex flex-col gap-2 items-center relative rounded"
      on:mouseup={() => {
        showYearsList = false;
        showMonthsList = false;
      }}
    >
      <button
        class={`${showError ? 'border-rose-500' : 'border-neutral-100 dark:border-slate-600'} w-full p-2 flex gap-2 justify-center items-center ${showDaysList ? 'rounded-t border-x border-t' : 'rounded border'} dark:text-white bg-neutral-100 dark:bg-slate-600 transition-all hover:dark:bg-slate-500 hover:dark:border-slate-500 hover:bg-neutral-200 hover:border-neutral-200`}
        type="button"
        on:click={() => showDaysList = !showDaysList}
      >
        {day}
        {#if showDaysList}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" />
          </svg>              
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        {/if}
      </button>
      {#if showDaysList}
        <div
          id="list"
          class={`flex flex-col max-h-40 overflow-y-auto absolute top-full left-0 bg-neutral-100 z-50 w-full ${showDaysList ? 'rounded-b border-x border-b border-neutral-100 dark:border-slate-600' : ''}`}
        >
          {#each daysList as dayItem}
            <button
              class="p-2 dark:text-white dark:bg-slate-600 transition-all hover:dark:bg-slate-500 hover:dark:border-slate-500 hover:bg-neutral-200 hover:border-neutral-200"
              type="button"
              on:click={() => {
                day = dayItem;
                showDaysList = false;
              }}
            >
              {dayItem}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  {#if showError && errorMessage}
    <p class="text-rose-500">{errorMessage}</p>
  {/if}
</div> -->
<div class="flex flex-col gap-4">
  <p class={`${showError ? 'text-rose-500' : 'dark:text-whtie'}`}>{label}</p>
  <div class="flex gap-2 w-full">
    <div class="flex flex-col gap-2">
      <label for="" class={`${showError ? 'text-rose-500' : 'dark:text-whtie'}`}>Year</label>
      <input
        class={`${showError ? 'border-rose-500' : 'border-neutral-100 dark:border-slate-600'} border-2 w-full box-border p-2 bg-neutral-100 dark:text-white dark:bg-slate-600 rounded`}
        type="text"
        placeholder="YYYY"
        value={year}
        on:input={(e) => {
          if (regex.test(e.target.value)) {
            year = e.target.value;
          }
        }}
        maxlength="4"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="" class={`${showError ? 'text-rose-500' : 'dark:text-whtie'}`}>Month</label>
      <input
        class={`${showError ? 'border-rose-500' : 'border-neutral-100 dark:border-slate-600'} border-2 w-full box-border p-2 bg-neutral-100 dark:text-white dark:bg-slate-600 rounded`}
        type="text"
        placeholder="MM"
        value={month}
        on:input={(e) => {
          if (regex.test(e.target.value)) {
            month = e.target.value;
          }
        }}
        maxlength="2"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="" class={`${showError ? 'text-rose-500' : 'dark:text-whtie'}`}>Day</label>
      <input
        class={`${showError ? 'border-rose-500' : 'border-neutral-100 dark:border-slate-600'} border-2 w-full box-border p-2 bg-neutral-100 dark:text-white dark:bg-slate-600 rounded`}
        type="text"
        placeholder="DD"
        value={day}
        on:input={(e) => {
          if (regex.test(e.target.value)) {
            day = e.target.value;
          }
        }}
        maxlength="2"
      />
    </div>
  </div>
  <p class="st-font-italic">{formatDate(new Date(year, month-1, day))}</p>
</div>