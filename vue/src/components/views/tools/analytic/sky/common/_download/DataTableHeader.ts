export interface DataTableHeader {
  title: string; // Display text of the header
  value: string; // The key to map the data to the column
  key?: string; // Unique key for custom actions or grouping
  align?: "start" | "center" | "end"; // Alignment of the column
  sortable?: boolean; // Whether the column is sortable
  minWidth?: string | number; // Minimum width of the column
  children?: DataTableHeader[]; // For nested headers (sub-headers)
}
