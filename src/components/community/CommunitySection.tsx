import { useEffect, useState } from "react";
import { getPosts, updatePost } from "../../services/api";
import type { Post } from "../../types";
import CommunityHeader from "./CommunityHeader";
import PostList from "./PostList";
import CreatePostForm from "./CreatePostForm";

function CommunitySection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingPostId, setLikingPostId] = useState<number | null>(null);
  const [likeError, setLikeError] = useState<string | null>(null);

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

   async function handleToggleLike(post: Post): Promise<void> {
     if (likingPostId !== null) {
       return;
     }

     setLikeError(null);
     setLikingPostId(post.id);

     try {
       const updatedPost = await updatePost(post.id, {
         liked: !post.liked,
       });

       setPosts((currentPosts) =>
         currentPosts.map((currentPost) =>
           currentPost.id === updatedPost.id ? updatedPost : currentPost,
         ),
       );
     } catch (requestError) {
       if (requestError instanceof Error) {
         setLikeError(requestError.message);
       } else {
         setLikeError("Something went wrong while updating the like.");
       }
     } finally {
       setLikingPostId(null);
     }
   }

  useEffect(() => {
    void loadPosts();
  }, []);

  return (
    <section className="hub-panel community-panel">
      <CommunityHeader postCount={posts.length} />

      <div className="community-content">
        <CreatePostForm onPostCreated={handlePostCreated} />
        {likeError && (
          <div className="like-error-message" role="alert">
            {likeError}
          </div>
        )}
        <PostList
          posts={posts}
          loading={loading}
          error={error}
          onRetry={loadPosts}
          onToggleLike={handleToggleLike}
          likingPostId={likingPostId}
        />
      </div>
    </section>
  );
}

export default CommunitySection;
