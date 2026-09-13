import { useEffect, useState } from "react";
import { getPosts } from "../../services/api";
import type { Post } from "../../types";
import CommunityHeader from "./CommunityHeader";
import PostList from "./PostList";
import CreatePostForm from "./CreatePostForm";

function CommunitySection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const loadedPosts = await getPosts();
      setPosts(loadedPosts);
    } catch (requestError) {
      if (requestError instanceof Error) {
        setError(requestError.message);
      } else {
        setError("Something went wrong while loading posts.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handlePostCreated(newPost: Post): void {
    setPosts((currentPosts) => [newPost, ...currentPosts]);
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  return (
    <section className="hub-panel community-panel">
      <CommunityHeader postCount={posts.length} />

      <div className="community-content">
        <CreatePostForm onPostCreated={handlePostCreated} />
        <PostList
          posts={posts}
          loading={loading}
          error={error}
          onRetry={loadPosts}
        />
      </div>
    </section>
  );
}

export default CommunitySection;
