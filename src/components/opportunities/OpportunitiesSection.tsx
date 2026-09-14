import { useEffect, useRef, useState } from "react";
import HashSet from "../../data-structures/HashSet";
import Stack from "../../data-structures/Stack";
import HashTable from "../../data-structures/HashTable";
import { getOpportunities, updateOpportunity } from "../../services/api";
import type {
  Opportunity,
  OpportunityFilters as OpportunityFiltersState,
} from "../../types";
import OpportunitiesHeader from "./OpportunitiesHeader";
import OpportunityFilters from "./OpportunityFilters";
import OpportunityList from "./OpportunityList";
import { useNotifications } from "../notifications/NotificationCenter";

function OpportunitiesSection() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OpportunityFiltersState>({
    search: "",
    type: "all",
    workMode: "all",
  });
  const [expandedOpportunityId, setExpandedOpportunityId] = useState<
    number | null
  >(null);

  const [applyingOpportunityId, setApplyingOpportunityId] = useState<
    number | null
  >(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const savedOpportunityIds = useRef(new HashSet<number>());
  const [savedVersion, setSavedVersion] = useState(0);
  const opportunityHistory = useRef(new Stack<number>());
  const [historyVersion, setHistoryVersion] = useState(0);
  const opportunityTable = useRef(new HashTable<Opportunity>());
  const { notify } = useNotifications();

  async function loadOpportunities() {
    setLoading(true);
    setError(null);
    try {
      const loadedOpportunities = await getOpportunities();
      setOpportunities(loadedOpportunities);
      opportunityTable.current.clear();

      loadedOpportunities.forEach((opportunity) => {
        opportunityTable.current.set(opportunity.id, opportunity);
      });
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
    setExpandedOpportunityId((currentId) => {
      if (currentId === opportunityId) {
        return null;
      }

      if (currentId !== null) {
        opportunityHistory.current.push(currentId);
        setHistoryVersion((currentVersion) => currentVersion + 1);
      }

      return opportunityId;
    });
  }
  function handleBackToPreviousOpportunity(): void {
    const previousOpportunityId = opportunityHistory.current.pop();

    if (previousOpportunityId === undefined) {
      return;
    }

    const previousOpportunity = opportunityTable.current.get(
      previousOpportunityId,
    );

    if (!previousOpportunity) {
      return;
    }

    setExpandedOpportunityId(previousOpportunity.id);
    setHistoryVersion((currentVersion) => currentVersion + 1);
  }

  function handleToggleSaved(opportunityId: number): void {
    if (savedOpportunityIds.current.has(opportunityId)) {
      savedOpportunityIds.current.delete(opportunityId);
      notify("Opportunity removed from saved items.", "info");
    } else {
      savedOpportunityIds.current.add(opportunityId);
      notify("Opportunity saved successfully.", "success");
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

      opportunityTable.current.set(updatedOpportunity.id, updatedOpportunity);

      setOpportunities((currentOpportunities) =>
        currentOpportunities.map((currentOpportunity) =>
          currentOpportunity.id === updatedOpportunity.id
            ? updatedOpportunity
            : currentOpportunity,
        ),
      );
      notify("Application submitted successfully.", "success");
    } catch (requestError) {
      if (requestError instanceof Error) {
        setApplyError(requestError.message);
        notify(requestError.message, "error");
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
  void historyVersion;

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

        {!opportunityHistory.current.isEmpty() && (
          <button
            className="back-history-button"
            type="button"
            onClick={handleBackToPreviousOpportunity}
          >
            ← Back to previous opportunity
          </button>
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
