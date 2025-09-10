<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/vue-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { valueUpdater } from "@/lib/utils";
import { useDebounceFn } from "@vueuse/core";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  isPending: boolean;
  initialSorting?: SortingState;
  pageCount?: number;
  rowCount?: number;
  serverSidePagination?: boolean;
  rowClass?: (row: TData) => string;
  showSearch?: boolean;
}>();

const emit = defineEmits<{
  (
    e: "paginationChange",
    pagination: { pageIndex: number; pageSize: number }
  ): void;
  (e: "filterChange", filter: Ref<string, string>): void;
  (e: "globalFilterChange", filter: string): void;
}>();

const sorting = ref<SortingState>(props.initialSorting ?? []);
const filter = ref<string>("");
const columnVisibility = ref<VisibilityState>({
  id: false,
  step_type: false,
  subject: false,
  description: false,
});

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});

const table = useVueTable({
  get data() {
    return props.data ?? [];
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onGlobalFilterChange: (updaterOrValue) => {
    valueUpdater(updaterOrValue, filter);
    if (props.serverSidePagination) {
      emit("globalFilterChange", filter.value);
    }
  },
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  onPaginationChange: (updaterOrValue) => {
    valueUpdater(updaterOrValue, pagination);
    if (props.serverSidePagination) {
      emit("paginationChange", pagination.value);
    }
  },
  getFilteredRowModel: getFilteredRowModel(),
  manualPagination: props.serverSidePagination,
  manualFiltering: props.serverSidePagination,
  get pageCount() {
    return props.pageCount;
  },
  get rowCount() {
    return props.rowCount;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get globalFilter() {
      return filter.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get pagination() {
      return pagination.value;
    },
  },
});

watch(
  () => props.data,
  (newData) => {
    if (
      !props.serverSidePagination &&
      !newData?.length &&
      pagination.value.pageIndex > 0
    ) {
      pagination.value.pageIndex = Math.max(0, pagination.value.pageIndex - 1);
    }
  }
);

const debouncedSearch = useDebounceFn((value: string) => {
  filter.value = value;
  table.setGlobalFilter(value);
}, 300);

const handleSearchInputChange = (value: string) => {
  if (value === "") {
    filter.value = value;
    table.setGlobalFilter(value);
  } else {
    debouncedSearch(value);
  }
};
</script>

<template>
  <div class="flex items-center justify-between py-4">
    <div class="flex items-center">
      <div class="flex items-center">
        <div class="flex items-center gap-2">
          <Input
            v-if="showSearch"
            class="max-w-xl"
            placeholder="Search..."
            :model-value="filter"
            @update:model-value="
              (value) => handleSearchInputChange(value as string)
            " />
          <slot name="filters"></slot>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="sm" class="ml-auto">
                <LucideMenu class="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent :align="'end'">
              <DropdownMenuCheckboxItem
                v-for="column in table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())"
                :key="column.id"
                class="capitalize"
                :checked="column.getIsVisible()"
                @update:checked="
                  (value: boolean) => {
                    column.toggleVisibility(!!value);
                  }
                ">
                {{ column.id }}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <slot name="import"></slot>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between space-x-2">
      <slot name="actionsBeforePagination"></slot>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()">
        <LucideChevronLeft class="w-4 h-4" />
      </Button>
      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {{ table.getState().pagination.pageIndex + 1 }} of
          {{ table.getPageCount() }}
        </strong>
      </span>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()">
        <LucideChevronRight class="w-4 h-4" />
      </Button>
    </div>
  </div>
  <slot name="importDisclaimer" />
  <div class="border rounded-md my-2 overflow-x-auto relative">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            colspan="1"
            :class="
              header.id === 'actions'
                ? 'last:border-l last:border-foreground-muted last:bg-background last:sticky last:right-0 last:z-30 bg-clip-border last:text-center last:shadow-inner'
                : ''
            ">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
            :class="props.rowClass ? props.rowClass(row.original as TData) : ''">
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="
                cell.column.id === 'actions'
                  ? 'last:border-l last:border-foreground-muted last:bg-background last:sticky last:right-0 last:z-30 bg-clip-border last:text-center last:shadow-inner'
                  : ''
              ">
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="isPending">
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              Loading...
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              <slot name="noResults">
                <div class="text-center">No results.</div>
              </slot>
            </TableCell>
          </TableRow>
        </template>
        <slot name="extraRows" data-extra-row></slot>
      </TableBody>
    </Table>
  </div>
  <div class="flex items-center justify-end py-4 space-x-2">
    <Button
      variant="outline"
      size="sm"
      :disabled="!table.getCanPreviousPage()"
      @click="table.previousPage()">
      Previous
    </Button>
    <span className="flex items-center gap-1">
      <div>Page</div>
      <strong>
        {{ table.getState().pagination.pageIndex + 1 }} of
        {{ table.getPageCount() }}
      </strong>
    </span>
    <Button
      variant="outline"
      size="sm"
      :disabled="!table.getCanNextPage()"
      @click="table.nextPage()">
      Next
    </Button>
  </div>
</template>

<style scoped></style>
