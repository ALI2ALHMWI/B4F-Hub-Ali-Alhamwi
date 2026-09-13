import type { Post } from "../../types";
import PostCard from "./PostCard";

interface PostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onToggleLike: (post: Post) => Promise<void>;
  likingPostId: number | null;
}

function PostList({
  posts,
  loading,
  error,
  onRetry,
  onToggleLike,
  likingPostId,
}: PostListProps) {
  if (loading) {
    return (
      <div className="section-state" role="status">
        <div className="loading-spinner" aria-hidden="true" />
        <h3>Loading community posts...</h3>
        <p>We are getting the latest updates for you.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-state section-error" role="alert">
        <div className="state-icon" aria-hidden="true">
          !
        </div>

        <h3>Could not load community posts</h3>

        <p>{error}</p>

        <button className="secondary-button" type="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="section-state">
        <div className="state-icon" aria-hidden="true">
          ✦
        </div>

        <h3>No community posts yet</h3>

        <p>When people share updates, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onToggleLike={onToggleLike}
          liking={likingPostId === post.id}
        />
      ))}
    </div>
  );
}

export default PostList;
