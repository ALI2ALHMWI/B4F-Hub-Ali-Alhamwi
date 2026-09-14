import type { Opportunity } from "../../types";
import OpportunityCard from "./OpportunityCard";

interface OpportunityListProps {
  opportunities: Opportunity[];
  loading: boolean;
  totalOpportunities: number;
  error: string | null;
  onRetry: () => void;
  expandedOpportunityId: number | null;
  onToggleDetails: (opportunityId: number) => void;
  onApply: (opportunity: Opportunity) => Promise<void>;
  applyingOpportunityId: number | null;
  onToggleSaved: (opportunityId: number) => void;
  savedOpportunityIds: {
    has: (value: number) => boolean;
  };
  savedVersion: number;
}

function OpportunityList({
  opportunities,
  loading,
  totalOpportunities,
  error,
  onRetry,
  expandedOpportunityId,
  onToggleDetails,
  onApply,
  applyingOpportunityId,
  onToggleSaved,
  savedOpportunityIds,
  savedVersion,
}: OpportunityListProps) {
  void savedVersion;
  if (loading) {
    return (
      <div className="section-state" role="status">
        <div className="loading-spinner" aria-hidden="true" />
        <h3>Loading opportunities...</h3>
        <p>We are getting the latest openings for you.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-state section-error" role="alert">
        <div className="state-icon" aria-hidden="true">
          !
        </div>

        <h3>Could not load opportunities</h3>

        <p>{error}</p>

        <button className="secondary-button" type="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (opportunities.length === 0 && totalOpportunities > 0) {
    return (
      <div className="section-state">
        <div className="state-icon" aria-hidden="true">
          ⌕
        </div>

        <h3>No opportunities match your filters</h3>

        <p>Try changing your search, type, or work mode filter.</p>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="section-state">
        <div className="state-icon" aria-hidden="true">
          ↗
        </div>

        <h3>No opportunities yet</h3>

        <p>New roles and openings will appear here.</p>
      </div>
    );
  }

  return (
    <div className="opportunity-list">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          expanded={expandedOpportunityId === opportunity.id}
          saved={savedOpportunityIds.has(opportunity.id)}
          onToggleDetails={onToggleDetails}
          onToggleSaved={onToggleSaved}
          onApply={onApply}
          applying={applyingOpportunityId === opportunity.id}
        />
      ))}
    </div>
  );
}

export default OpportunityList;
