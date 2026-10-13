// Evenkeel public API. Import '@evenkeel/styles' (src/styles/index.css) once, then use these.
export { Button, type ButtonProps } from './components/Button/Button';
export { IconButton, type IconButtonProps } from './components/IconButton/IconButton';
export { Link, type LinkProps } from './components/Link/Link';
export { TextField, type TextFieldProps } from './components/TextField/TextField';
export { TextArea, type TextAreaProps } from './components/TextArea/TextArea';
export { SearchField, type SearchFieldProps } from './components/SearchField/SearchField';
export { Select, type SelectProps, type SelectOption } from './components/Select/Select';
export { Checkbox, type CheckboxProps } from './components/Checkbox/Checkbox';
export { Radio, RadioGroup, type RadioProps, type RadioGroupProps } from './components/Radio/Radio';
export { Toggle, type ToggleProps } from './components/Toggle/Toggle';
export { SegmentedControl, type SegmentedControlProps, type SegmentOption } from './components/SegmentedControl/SegmentedControl';
export { Badge, type BadgeProps } from './components/Badge/Badge';
export { Spinner, type SpinnerProps } from './components/Spinner/Spinner';
export { ProgressBar, type ProgressBarProps } from './components/ProgressBar/ProgressBar';
export { Box, type BoxProps } from './components/Box/Box';
export { Icon, type IconProps, type IconName } from './icons/Icon';
export { iconNames } from './icons/icons';
export { applyTheme, clearTheme } from './theme/runtime';
export { presets } from './theme/presets';
// Phase 3: app structure
export { AppLayout, useAppLayout, type AppLayoutProps } from './components/AppLayout/AppLayout';
export { TopBar, type TopBarProps } from './components/TopBar/TopBar';
export { SideNavigation, type SideNavigationProps, type NavItem } from './components/SideNavigation/SideNavigation';
export { Breadcrumbs, type BreadcrumbsProps, type Crumb } from './components/Breadcrumbs/Breadcrumbs';
export { PageHeader, type PageHeaderProps } from './components/PageHeader/PageHeader';
export { Tabs, type TabsProps, type Tab } from './components/Tabs/Tabs';
export { Table, type TableProps, type TableColumn, type TableSorting } from './components/Table/Table';
export { Sheet, type SheetProps } from './components/Sheet/Sheet';
export { Inspector, InspectorSection, type InspectorProps, type InspectorSectionProps } from './components/Inspector/Inspector';
export { KeyValueList, type KeyValueListProps, type KeyValue } from './components/KeyValueList/KeyValueList';
// Components used by patterns and demos
export { Alert, type AlertProps } from './components/Alert/Alert';
export { Pagination, pageList, type PaginationProps } from './components/Pagination/Pagination';
export { EmptyState, type EmptyStateProps } from './components/EmptyState/EmptyState';
export { Metric, type MetricProps } from './components/Metric/Metric';
export { Avatar, type AvatarProps } from './components/Avatar/Avatar';
export { Card, type CardProps } from './components/Card/Card';
export { Chart, type ChartProps, type ChartSeries } from './components/Chart/Chart';
// Phase 5: remaining components
export { Tooltip, type TooltipProps } from './components/Tooltip/Tooltip';
export { Popover, type PopoverProps } from './components/Popover/Popover';
export { Menu, type MenuProps, type MenuEntry } from './components/Menu/Menu';
export { ToastProvider, useToast, ToastView, type ToastOptions } from './components/Toast/Toast';
export { Skeleton, type SkeletonProps } from './components/Skeleton/Skeleton';
export { ExpandableSection, type ExpandableSectionProps } from './components/ExpandableSection/ExpandableSection';
export { Steps, type StepsProps, type Step } from './components/Steps/Steps';
export { ComboBox, type ComboBoxProps, type ComboOption } from './components/ComboBox/ComboBox';
export { Slider, type SliderProps } from './components/Slider/Slider';
export { Tag, TagGroup, type TagProps } from './components/Tag/Tag';
// More charts
export { categorical, type ChartTone } from './components/Chart/Chart';
export { Donut, type DonutProps, type DonutDatum } from './components/Donut/Donut';
export { BarList, type BarListProps, type BarListDatum } from './components/BarList/BarList';
export { Sparkline, type SparklineProps } from './components/Sparkline/Sparkline';
export { Heatmap, type HeatmapProps } from './components/Heatmap/Heatmap';
export { Gauge, type GaugeProps } from './components/Gauge/Gauge';
// Palettes: spectrum (13 hues × 12 steps), greys, system colours and data-viz palettes. CSS: --ek-* (build/css/palettes.css)
export {
  spectrum, spectrumHues, spectrumSeeds, greys, greyNames, viz, categoricalSlots, sequentialRamps, divergingRamps,
  systemColors, systemColorNames, systemColorJobs, systemStep, resolveSystemColor, palettesJson,
  VIZ_MAX_CATEGORICAL, VIZ_RECOMMENDED_CATEGORICAL,
  type SpectrumHue, type SystemColor, type SystemColorJob, type SequentialRamp, type DivergingRamp, type VizStatus, type FigmaPalettes,
} from './theme/palettes';
export { seriesAttr, type ChartPalette } from './components/Chart/Chart';
export { type HeatmapPalette } from './components/Heatmap/Heatmap';
export { Illustration, illustrations, illustrationNames, type IllustrationProps, type IllustrationName } from './illustrations';
// AI patterns: assistant, agents, summaries and settings. Colour roles: --color-ai-* (marks AI content only)
export * from './components/AI';
