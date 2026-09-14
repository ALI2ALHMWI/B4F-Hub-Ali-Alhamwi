import type {
  OpportunityFilters,
  OpportunityType,
  WorkMode,
} from "../../types";

interface OpportunityFiltersProps {
  filters: OpportunityFilters;
  onFiltersChange: (filters: OpportunityFilters) => void;
  totalOpportunities: number;
  visibleOpportunities: number;
}

const types: Array<{ value: OpportunityType | "all"; label: string }> = [
  { value: "all", label: "All types" },
  { value: "job", label: "Job" },
  { value: "internship", label: "Internship" },
  { value: "scholarship", label: "Scholarship" },
  { value: "volunteer", label: "Volunteer" },
];

const workModes: Array<{ value: WorkMode | "all"; label: string }> = [
  { value: "all", label: "All work modes" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-site" },
];

function OpportunityFilters({
  filters,
  onFiltersChange,
  totalOpportunities,
  visibleOpportunities,
}: OpportunityFiltersProps) {
  function handleSearchChange(value: string): void {
    onFiltersChange({ ...filters, search: value });
  }

  function handleTypeChange(value: OpportunityType | "all"): void {
    onFiltersChange({ ...filters, type: value });
  }

  function handleWorkModeChange(value: WorkMode | "all"): void {
    onFiltersChange({ ...filters, workMode: value });
  }

  return (
    <div className="opportunity-filters">
      <div className="filters-top-row">
        <div>
          <strong>
            {visibleOpportunities} of {totalOpportunities}{" "}
            {totalOpportunities === 1 ? "opportunity" : "opportunities"}
          </strong>
        </div>
      </div>

      <label className="search-field">
        <span aria-hidden="true">⌕</span>

        <input
          type="search"
          value={filters.search}
          onChange={(event) => {
            handleSearchChange(event.target.value);
          }}
          placeholder="Search by title, company, or skill..."
          aria-label="Search opportunities"
        />
      </label>

      <div className="opportunity-select-row">
        <div>
          <span className="filter-label">Type</span>
          <select
            value={filters.type}
            onChange={(event) => {
              handleTypeChange(event.target.value as OpportunityType | "all");
            }}
            aria-label="Filter by opportunity type"
          >
            {types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="filter-label">Work mode</span>
          <select
            value={filters.workMode}
            onChange={(event) => {
              handleWorkModeChange(event.target.value as WorkMode | "all");
            }}
            aria-label="Filter by work mode"
          >
            {workModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default OpportunityFilters;
