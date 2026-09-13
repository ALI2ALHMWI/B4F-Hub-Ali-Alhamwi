import type { CommunityFilters, PostCategory } from "../../types";

interface CommunityFiltersProps {
  filters: CommunityFilters;
  onFiltersChange: (filters: CommunityFilters) => void;
  totalPosts: number;
  visiblePosts: number;
}

const categories: Array<{
  value: PostCategory | "all";
  label: string;
}> = [
  {
    value: "all",
    label: "All categories",
  },
  {
    value: "announcement",
    label: "Announcements",
  },
  {
    value: "event",
    label: "Events",
  },
  {
    value: "community",
    label: "Community",
  },
  {
    value: "resource",
    label: "Resources",
  },
];

function CommunityFilters({
  filters,
  onFiltersChange,
  totalPosts,
  visiblePosts,
}: CommunityFiltersProps) {
  function handleSearchChange(value: string): void {
    onFiltersChange({
      ...filters,
      search: value,
    });
  }

  function handleCategoryChange(value: PostCategory | "all"): void {
    onFiltersChange({
      ...filters,
      category: value,
    });
  }

  return (
    <div className="community-filters">
      <div className="filters-top-row">
        <div>
          <span className="filter-label">COMMUNITY FEED</span>

          <strong>
            {visiblePosts} of {totalPosts} {totalPosts === 1 ? "post" : "posts"}
          </strong>
        </div>

        <select
          value={filters.category}
          onChange={(event) => {
            handleCategoryChange(event.target.value as PostCategory | "all");
          }}
          aria-label="Filter posts by category"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <label className="search-field">
        <span aria-hidden="true">⌕</span>

        <input
          type="search"
          value={filters.search}
          onChange={(event) => {
            handleSearchChange(event.target.value);
          }}
          placeholder="Search posts or authors..."
          aria-label="Search posts or authors"
        />
      </label>
    </div>
  );
}

export default CommunityFilters;
