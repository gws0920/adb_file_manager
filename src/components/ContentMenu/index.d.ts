export interface MenuItem {
  label: string
  icon: any
  fn: () => void
  disabled?: boolean
  topDivider?: boolean
}
