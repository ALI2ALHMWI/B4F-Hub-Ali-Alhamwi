interface CommunityHeaderProps {
  postCount: number;
}

function CommunityHeader({ postCount }: CommunityHeaderProps) {
  return (
    <div className="panel-heading">
      <div>
        <span className="eyebrow">STAY CONNECTED</span>

        <h2>Community</h2>

        <p>Share updates, ask questions, and celebrate wins.</p>
      </div>

      <span className="panel-count">
        {postCount} {postCount === 1 ? "post" : "posts"}
      </span>
    </div>
  );
}

export default CommunityHeader;
