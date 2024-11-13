
'use client';

import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './PostOptions.module.css';

const PostOptions = ({ post, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleDelete = async () => {
    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      onDelete(post.id);
    } else {
      alert("Failed to delete the post!");
    }
  };

  const handleShare = () => {
    // You can extend this to trigger share functionality (e.g., social media)
    alert(`Share this post: ${window.location.href}/posts/${post.slug}`);
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className={styles.optionsButton}
      >
        ...
      </button>

      {showOptions && (
        <div className={styles.options}>
          <div onClick={handleShare} className={styles.option}>
            <FontAwesomeIcon icon={faShareAlt} />
            <span>Share</span>
          </div>
          <div onClick={handleDelete} className={styles.option}>
            <FontAwesomeIcon icon={faTrash} />
            <span>Delete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostOptions;