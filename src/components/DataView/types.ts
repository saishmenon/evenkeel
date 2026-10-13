import type { ReactNode } from 'react';
import type { IconName } from '../../icons/Icon';
import type { MenuButtonItem } from './MenuButton';
import type { DataGroup } from './model';

/** One column of the table and list views. Columns are presentation; fields (model.ts) are data. */
export interface DataColumn<T> {
  id: string;
  /** Plain text: it is also used in the column settings and resize handles. */
  header: string;
  cell: (item: T) => ReactNode;
  /** The DataField id this column sorts by. Without it the header isn't sortable. */
  field?: string;
  /** Numbers and amounts: right-aligned with tabular figures, so digits line up. */
  numeric?: boolean;
  align?: 'start' | 'end';
  /** Starting width in px. People can resize it. */
  width?: number;
  minWidth?: number;
  /** A summary for group headers and the totals row, e.g. a sum. Return text. */
  total?: (items: T[]) => ReactNode;
  /** The column that names the row. It sticks to the left and opens the item. Default: the first column. */
  isRowHeader?: boolean;
  /** Can't be hidden in column settings. The row header is always required. */
  required?: boolean;
}

/** A command on one or many items: Refund, Export, Assign. */
export interface ItemAction {
  id: string;
  label: string;
  icon?: IconName;
  destructive?: boolean;
}

/** Props every view shares. `items` are already searched, filtered and sorted. */
export interface ViewProps<T> {
  /** What the items are, for screen readers: "Payments". */
  label: string;
  items: T[];
  getId: (item: T) => string;
  /** A short name for one item: "pay_8Kd2Lm", "Cascade Courier Co.". Used in labels like "Actions for …". */
  getTitle: (item: T) => string;
  /** Open an item (inspector, detail page). Rows, cards and events become clickable. */
  onOpen?: (item: T) => void;
  /** The item shown in the inspector, highlighted. */
  activeId?: string;
  /** Groups to show (from groupItems). Omit for one flat list. */
  groups?: DataGroup<T>[];
  /** Menu items for each item's "…" menu. */
  itemActions?: (item: T) => MenuButtonItem[];
  onItemAction?: (actionId: string, item: T) => void;
  /** Shown when there are no items. */
  empty?: ReactNode;
  loading?: boolean;
}
