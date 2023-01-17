<script lang="ts">
  // components
  import Button from '$components/Button.svelte';

  // state
  let today: any = new Date();
  const todayMonth: number = today.getUTCMonth();
  const todayDay: number = today.getUTCDate();
  const todayYear: number = today.getUTCFullYear();

  // props
  export let label: string = 'Date';
  export let month: { monthName: string, monthNumber: number } = {
    monthName: new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(today),
    monthNumber: todayMonth,
  }
  export let day: number = todayDay;
  export let year: number = todayYear;
  export let showError: boolean = false;
  export let errorMessage: string = '';

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
</script>

<div class="flex flex-col gap-2">
  <p class={`${showError ? 'text-red-500' : 'dark:text-white'}`}>{label}</p>
  <div class="grid sm:grid-cols-3 gap-2 items-start">
    <div
      class="flex flex-col gap-2 items-center relative rounded"
      on:mouseup={() => {
        showMonthsList = false;
        showDaysList = false;
      }}
    >
      <button
        class={`${showError ? 'border-red-500' : 'border-neutral-100 dark:border-slate-600'} w-full p-2 flex gap-2 justify-center items-center ${showYearsList ? 'rounded-t border-x border-t' : 'rounded border'} dark:text-white bg-neutral-100 dark:bg-slate-600`}
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
              class="p-2 dark:text-white dark:bg-slate-600"
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
        class={`${showError ? 'border-red-500' : 'border-neutral-100 dark:border-slate-600'} w-full p-2 flex gap-2 justify-center items-center ${showMonthsList ? 'rounded-t border-x border-t' : 'rounded border'} dark:text-white bg-neutral-100 dark:bg-slate-600`}
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
              class="p-2 dark:text-white dark:bg-slate-600"
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
        class={`${showError ? 'border-red-500' : 'border-neutral-100 dark:border-slate-600'} w-full p-2 flex gap-2 justify-center items-center ${showDaysList ? 'rounded-t border-x border-t' : 'rounded border'} dark:text-white bg-neutral-100 dark:bg-slate-600`}
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
              class="p-2 dark:text-white dark:bg-slate-600"
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
    <p class="text-red-500">{errorMessage}</p>
  {/if}
</div>