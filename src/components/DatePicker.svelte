<script lang="ts">
  // helpers
  import { formatDate } from 'src/helpers/helpers';

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

  const regex = new RegExp('^[0-9]+$');
</script>

<div class="flex flex-col gap-2">
  <p class={`${showError ? 'text-rose-500' : 'dark:text-whtie'}`}>{label}</p>
  <div class="flex gap-2 w-full">
    <div class="flex flex-col gap-2">
      <label for="" class={`${showError ? 'text-rose-500' : 'dark:text-whtie'}`}>Year</label>
      <input
        class={`${showError ? 'border-rose-500' : 'border-neutral-100 dark:border-slate-600'} border-2 w-full box-border p-1 bg-neutral-100 dark:text-white dark:bg-slate-600 rounded`}
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
        class={`${showError ? 'border-rose-500' : 'border-neutral-100 dark:border-slate-600'} border-2 w-full box-border p-1 bg-neutral-100 dark:text-white dark:bg-slate-600 rounded`}
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
        class={`${showError ? 'border-rose-500' : 'border-neutral-100 dark:border-slate-600'} border-2 w-full box-border p-1 bg-neutral-100 dark:text-white dark:bg-slate-600 rounded`}
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