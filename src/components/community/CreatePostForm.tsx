import { ChangeEvent, FormEvent, useState } from "react";
import { createPost } from "../../services/api";
import type { Post, PostCategory } from "../../types";
import { useNotifications } from "../notifications/NotificationCenter";

interface CreatePostFormProps {
  onPostCreated: (post: Post) => void;
}

const postCategories: Array<{
  value: PostCategory;
  label: string;
}> = [
  {
    value: "announcement",
    label: "Announcement",
  },
  {
    value: "event",
    label: "Event",
  },
  {
    value: "community",
    label: "Community",
  },
  {
    value: "resource",
    label: "Resource",
  },
];

function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory | "">("");
  const [validationError, setValidationError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);
const { notify } = useNotifications();
  const MIN_CHARACTERS = 3;
  const MAX_CHARACTERS = 2000;

  function handleContent(event: ChangeEvent<HTMLTextAreaElement>): void {
    setContent(event.target.value);
    if (validationError) {
      setValidationError("");
    }

    if (requestError) {
      setRequestError("");
    }
  }
  function handleCategory(event: ChangeEvent<HTMLSelectElement>) {
    setCategory(event.target.value as PostCategory | "");
    if (validationError) {
      setValidationError("");
    }
  }
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setValidationError("");
    setRequestError("");

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setValidationError("Please write something before publishing.");
      return;
    }

    if (trimmedContent.length < MIN_CHARACTERS) {
      setValidationError("Your post must be at least 3 characters.");
      return;
    }

    if (trimmedContent.length > MAX_CHARACTERS) {
      setValidationError("Your post must be 2000 characters or fewer.");
      return;
    }

    if (!category) {
      setValidationError("Please choose a post category.");
      return;
    }

    setSubmitting(true);

    try {
      const newPost = await createPost({
        content: trimmedContent,
        category,
      });

      onPostCreated(newPost);
      notify("Post published successfully.", "success");
      setContent("");
      setCategory("");
    } catch (error) {
      if (error instanceof Error) {
        setRequestError(error.message);
        notify(error.message, "error");
      } else {
        setRequestError("Something went wrong while publishing your post.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <div className="compose-heading">
        <div>
          <h3>Create a post</h3>
        </div>

        <span className="character-count">{content.length}/2000</span>
      </div>

      <textarea
        value={content}
        onChange={handleContent}
        placeholder="Share an update, ask a question, or celebrate a win..."
        rows={4}
        maxLength={2000}
        disabled={submitting}
        aria-label="Post content"
      />

      <div className="compose-actions">
        <select
          value={category}
          onChange={handleCategory}
          disabled={submitting}
          aria-label="Post category"
        >
          <option value="">Choose category</option>

          {postCategories.map((postCategory) => (
            <option key={postCategory.value} value={postCategory.value}>
              {postCategory.label}
            </option>
          ))}
        </select>

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Publishing..." : " post"}
        </button>
      </div>

      {validationError && (
        <p className="form-message form-validation-error" role="alert">
          {validationError}
        </p>
      )}

      {requestError && (
        <p className="form-message form-request-error" role="alert">
          {requestError}
        </p>
      )}
    </form>
  );
}

export default CreatePostForm;
