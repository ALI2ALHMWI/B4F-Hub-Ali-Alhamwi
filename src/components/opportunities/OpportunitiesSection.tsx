import { useEffect, useRef, useState } from "react";
import HashSet from "../../data-structures/HashSet";
import { getOpportunities, updateOpportunity } from "../../services/api";
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
  const [expandedOpportunityId, setExpandedOpportunityId] = useState< number | null>(null);

  const [applyingOpportunityId, setApplyingOpportunityId] = useState<  number | null >(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const savedOpportunityIds = useRef(new HashSet<number>());
  const [savedVersion, setSavedVersion] = useState(0);


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

  function handleToggleDetails(opportunityId: number): void {
    setExpandedOpportunityId((currentId) =>
      currentId === opportunityId ? null : opportunityId,
    );
  }
  function handleToggleSaved(opportunityId: number): void {
    if (savedOpportunityIds.current.has(opportunityId)) {
      savedOpportunityIds.current.delete(opportunityId);
    } else {
      savedOpportunityIds.current.add(opportunityId);
    }

    setSavedVersion((currentVersion) => currentVersion + 1);
  }


  async function handleApply(opportunity: Opportunity): Promise<void> {
    if (applyingOpportunityId !== null || opportunity.applied) {
      return;
    }

    setApplyError(null);
    setApplyingOpportunityId(opportunity.id);

    try {
      const updatedOpportunity = await updateOpportunity(opportunity.id, {
        applied: true,
      });

      setOpportunities((currentOpportunities) =>
        currentOpportunities.map((currentOpportunity) =>
          currentOpportunity.id === updatedOpportunity.id
            ? updatedOpportunity
            : currentOpportunity,
        ),
      );
    } catch (requestError) {
      if (requestError instanceof Error) {
        setApplyError(requestError.message);
      } else {
        setApplyError(
          "Something went wrong while submitting your application.",
        );
      }
    } finally {
      setApplyingOpportunityId(null);
    }
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

        {applyError && (
          <div className="apply-error-message" role="alert">
            {applyError}
          </div>
        )}

        <div className="opportunity-feed">
          <OpportunityList
            opportunities={filteredOpportunities}
            loading={loading}
            totalOpportunities={opportunities.length}
            error={error}
            onRetry={loadOpportunities}
            expandedOpportunityId={expandedOpportunityId}
            onToggleDetails={handleToggleDetails}
            onApply={handleApply}
            applyingOpportunityId={applyingOpportunityId}
            onToggleSaved={handleToggleSaved}
            savedOpportunityIds={savedOpportunityIds.current}
            savedVersion={savedVersion}
          />
        </div>
      </div>
    </section>
  );
}

export default OpportunitiesSection;
