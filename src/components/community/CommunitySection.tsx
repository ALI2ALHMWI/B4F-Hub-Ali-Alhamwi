import {  useState } from "react";
import { getPosts, updatePost } from "../../services/api";
import useFetch from "../../hooks/useFetch";

import type {
  CommunityFilters as CommunityFiltersState,
  Post,
} from "../../types";
import CommunityHeader from "./CommunityHeader";
import PostList from "./PostList";
import CreatePostForm from "./CreatePostForm";
import CommunityFilters from "./CommunityFilters";
import { useNotifications } from "../notifications/NotificationCenter";

function CommunitySection() {
const {
  data: postsData,
  loading,
  error,
  refetch: loadPosts,
  updateData: updatePosts,
} = useFetch<Post[]>(getPosts);

const posts = postsData ?? [];

  const [likingPostId, setLikingPostId] = useState<number | null>(null);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CommunityFiltersState>({
    search: "",
    category: "all",
    onlyLiked: false,
  });
  

const { notify } = useNotifications();
  
  function handlePostCreated(newPost: Post): void {
    updatePosts((currentPosts) => [newPost, ...(currentPosts ?? [])]);

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

     updatePosts((currentPosts) =>
       (currentPosts ?? []).map((currentPost) =>
         currentPost.id === updatedPost.id ? updatedPost : currentPost,
       ),
     );

      notify(
        updatedPost.liked
          ? "Post liked successfully."
          : "Post unliked successfully.",
        "success",
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
  function getFilteredPosts(): Post[] {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        filters.category === "all" || post.category === filters.category;

      const matchesSearch =
        normalizedSearch === "" ||
        post.author.toLowerCase().includes(normalizedSearch) ||
        post.content.toLowerCase().includes(normalizedSearch);
      
      const matchesLiked = !filters.onlyLiked || post.liked;

      return matchesCategory && matchesSearch && matchesLiked;
    });
  }

  const filteredPosts = getFilteredPosts();

  return (
    <section className="hub-panel community-panel">
      <CommunityHeader postCount={posts.length} />

      <div className="community-content">
        <CreatePostForm onPostCreated={handlePostCreated} />

        <CommunityFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalPosts={posts.length}
          visiblePosts={filteredPosts.length}
        />
        {likeError && (
          <div className="like-error-message" role="alert">
            {likeError}
          </div>
        )}

        <div className="post-feed">
          <PostList
            posts={filteredPosts}
            loading={loading}
            totalPosts={posts.length}
            error={error}
            onRetry={loadPosts}
            onToggleLike={handleToggleLike}
            likingPostId={likingPostId}
          />
        </div>
      </div>
    </section>
  );
}

export default CommunitySection;
