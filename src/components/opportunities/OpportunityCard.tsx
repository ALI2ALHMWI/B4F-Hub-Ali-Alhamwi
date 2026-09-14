import type { Opportunity } from "../../types";

interface OpportunityCardProps {
  opportunity: Opportunity;
  expanded: boolean;
  onToggleDetails: (opportunityId: number) => void;
  onApply: (opportunity: Opportunity) => Promise<void>;
  applying: boolean;
}

const typeLabels: Record<Opportunity["type"], string> = {
  job: "Job",
  internship: "Internship",
  scholarship: "Scholarship",
  volunteer: "Volunteer",
};

const workModeLabels: Record<Opportunity["workMode"], string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  "on-site": "On-site",
};

function OpportunityCard({
  opportunity,
  expanded,
  onToggleDetails,
  onApply,
  applying,
}: OpportunityCardProps) {
  const formattedDeadline = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(opportunity.deadline));

  return (
    <article className="opportunity-card">
      <div className="opportunity-card-top">
        <div className="opportunity-company">
          <div className="company-logo">{opportunity.companyLogo}</div>

          <div>
            <h3>{opportunity.title}</h3>
            <span className="opportunity-company-name">
              {opportunity.company}
            </span>
          </div>
        </div>

        <span className={`type-badge type-${opportunity.type}`}>
          {typeLabels[opportunity.type]}
        </span>
      </div>

      <div className="opportunity-meta-row">
        <span className={`work-mode-badge work-mode-${opportunity.workMode}`}>
          {workModeLabels[opportunity.workMode]}
        </span>
        <span className="opportunity-location">{opportunity.location}</span>
      </div>

      <div className="skills-list" aria-label="Required skills">
        {opportunity.skills.map((skill) => (
          <span className="skill-chip" key={skill}>
            {skill}
          </span>
        ))}
      </div>

      {expanded && (
        <div className="opportunity-details">
          <p className="opportunity-description">{opportunity.description}</p>
          <span className="opportunity-deadline">
            Apply by {formattedDeadline}
          </span>
        </div>
      )}

      <div className="opportunity-card-bottom">
        <button
          className="view-details-button"
          type="button"
          onClick={() => {
            onToggleDetails(opportunity.id);
          }}
          aria-expanded={expanded}
        >
          {expanded ? "Hide details" : "View details"}
        </button>

        <button
          className={
            opportunity.applied ? "apply-button applied" : "apply-button"
          }
          type="button"
          onClick={() => {
            void onApply(opportunity);
          }}
          disabled={opportunity.applied || applying}
        >
          {opportunity.applied ? "Applied" : applying ? "Applying..." : "Apply"}
        </button>
      </div>
    </article>
  );
}

export default OpportunityCard;
