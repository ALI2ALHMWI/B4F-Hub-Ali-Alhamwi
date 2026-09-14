interface CommunityHeaderProps {
  postCount: number;
}

function CommunityHeader({ postCount }: CommunityHeaderProps) {
  return (
    <div className="panel-heading">
      <div>
        <h2>Community</h2>
      </div>
      <span className="panel-count">
        {postCount} {postCount === 1 ? "post" : "posts"}
      </span>
    </div>
  );
}

export default CommunityHeader;
