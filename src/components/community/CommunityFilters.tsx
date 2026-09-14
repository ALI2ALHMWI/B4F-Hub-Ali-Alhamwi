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
          <strong>
            {visiblePosts} of {totalPosts} {totalPosts === 1 ? "post" : "posts"}
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
          placeholder="Search posts or authors..."
          aria-label="Search posts or authors"
        />
      </label>
      <div
        className="category-filter-buttons"
        aria-label="Filter posts by category"
      >
        {categories.map((category) => {
          const isActive = filters.category === category.value;

          return (
            <button
              key={category.value}
              className={
                isActive
                  ? "category-filter-button active"
                  : "category-filter-button"
              }
              type="button"
              onClick={() => {
                handleCategoryChange(category.value);
              }}
              aria-pressed={isActive}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CommunityFilters;
