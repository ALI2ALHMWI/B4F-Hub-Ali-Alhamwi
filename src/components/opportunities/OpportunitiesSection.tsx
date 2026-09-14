import { useEffect, useState } from "react";
import { getOpportunities } from "../../services/api";
import type {
  Opportunity,
  OpportunityFilters as OpportunityFiltersState,
} from "../../types";
import OpportunitiesHeader from "./OpportunitiesHeader";
import OpportunityFilters from "./OpportunityFilters";
import OpportunityList from "./OpportunityList";

function OpportunitiesSection() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OpportunityFiltersState>({
    search: "",
    type: "all",
    workMode: "all",
  });

  async function loadOpportunities() {
    setLoading(true);
    setError(null);
    try {
      const loadedOpportunities = await getOpportunities();
      setOpportunities(loadedOpportunities);
    } catch (requestError) {
      if (requestError instanceof Error) {
        setError(requestError.message);
      } else {
        setError("Something went wrong while loading opportunities.");
      }
    } finally {
      setLoading(false);
    }
  }

  function getFilteredOpportunities(): Opportunity[] {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return opportunities.filter((opportunity) => {
      const matchesType =
        filters.type === "all" || opportunity.type === filters.type;

      const matchesWorkMode =
        filters.workMode === "all" || opportunity.workMode === filters.workMode;

      const matchesSearch =
        normalizedSearch === "" ||
        opportunity.title.toLowerCase().includes(normalizedSearch) ||
        opportunity.company.toLowerCase().includes(normalizedSearch) ||
        opportunity.skills.some((skill) =>
          skill.toLowerCase().includes(normalizedSearch),
        );

      return matchesType && matchesWorkMode && matchesSearch;
    });
  }

  const filteredOpportunities = getFilteredOpportunities();

  useEffect(() => {
    void loadOpportunities();
  }, []);

  return (
    <section className="hub-panel opportunities-panel">
      <OpportunitiesHeader opportunityCount={opportunities.length} />

      <div className="opportunities-content">
        <OpportunityFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalOpportunities={opportunities.length}
          visibleOpportunities={filteredOpportunities.length}
        />

        <div className="opportunity-feed">
          <OpportunityList
            opportunities={filteredOpportunities}
            loading={loading}
            totalOpportunities={opportunities.length}
            error={error}
            onRetry={loadOpportunities}
          />
        </div>
      </div>
    </section>
  );
}

export default OpportunitiesSection;
