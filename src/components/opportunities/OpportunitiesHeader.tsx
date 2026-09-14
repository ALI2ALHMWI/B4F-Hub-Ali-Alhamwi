interface OpportunitiesHeaderProps {
  opportunityCount: number;
}

function OpportunitiesHeader({ opportunityCount }: OpportunitiesHeaderProps) {
  return (
    <div className="panel-heading">
      <div>
        <h2>Opportunities</h2>
      </div>

      <span className="panel-count">
        {opportunityCount}  {opportunityCount === 1 ? "opportunity" : "opportunities"}
      </span>
    </div>
  );
}

export default OpportunitiesHeader;
