import type { Post } from "../../types";

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.createdAt));

  const categoryLabel =
    post.category.charAt(0).toUpperCase() + post.category.slice(1);

  return (
    <article className="post-card">
      <div className="post-card-top">
        <div className="post-author">
          <div className="post-avatar">{post.avatar}</div>

          <div>
            <h3>{post.author}</h3>
            <time dateTime={post.createdAt}>{formattedDate}</time>
          </div>
        </div>

        <span className={`category-badge category-${post.category}`}>
          {categoryLabel}
        </span>
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-card-bottom">
        <span className={post.liked ? "like-count liked" : "like-count"}>
          <span aria-hidden="true">♥</span>
          {post.likes} {post.likes === 1 ? "like" : "likes"}
        </span>

        <span className="post-status">
          {post.liked ? "Liked" : "Not liked"}
        </span>
      </div>
    </article>
  );
}

export default PostCard;
