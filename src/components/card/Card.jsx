import React from "react";
import { useRouter } from "next/router"; // For redirecting after deletion
import styles from "./card.module.css";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const Card = ({ key, item }) => {
  const router = useRouter(); // To handle redirection after deletion

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Show success message
        router.reload(); // Reload the page to reflect the deletion
      } else {
        alert(data.message); // Show error message if any
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Something went wrong!");
    }
  };

  const truncatedDesc = item?.desc.substring(0, 500);
  const truncatedDesc2 = item?.desc.substring(0, 140);

  const showMore = item?.desc.length > 300;

  return (
    <Link href={`/posts/${item.slug}`} passHref>
      <div className={styles.container} key={key}>
        <div className={styles.profileContainer}>
          <Image
            src={item.user?.image}
            alt={item.user?.name}
            className={styles.profileImage}
            width={40}
            height={40}
          />
          <div className={styles.verticalLine}></div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.header}>
            <div className={styles.userProfile}>
              <div className={styles.userInfo}>
                <div className={styles.userProfile}>
                  <Image
                    src={item.user?.image}
                    alt={item.user?.name}
                    className={styles.profileImage2}
                    width={26}
                    height={26}
                  />
                  <div className={styles.userInfo}>
                    <p className={styles.username}>
                      {item.user?.name.substring(0, 10)}
                    </p>
                    <p className={styles.userRole}>{item.user?.role}</p>
                  </div>
                  <img
                    src="/verified.png"
                    alt="Verified"
                    className={styles.verifiedIcon}
                  />
                  <span className={styles.date}>
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    }).substring(0, 13)}
                  </span>
                </div>
              </div>
            </div>

            <span className={styles.category}>{item.catSlug}</span>

            <span
              className={styles.deleteSpan}
              onClick={(e) => {
                e.preventDefault(); // Prevent the link action
                deletePost(item.id); // Trigger post deletion
              }}
            >
              ...
            </span>
          </div>
          <h1 className={styles.title}>{item.title.substring(0, 150)}</h1>
          <h1 className={styles.title2}>{item.title.substring(0, 150)}</h1>

          <div className={styles.descContainer}>
            <div
              className={styles.desc}
              dangerouslySetInnerHTML={{ __html: truncatedDesc }}
            />
            <div
              className={styles.desc2}
              dangerouslySetInnerHTML={{ __html: truncatedDesc2 }}
            />
          </div>

          {item.img && (
            <div className={styles.imageContainer}>
              <div
                className={styles.imageBackground}
                style={{
                  backgroundImage: `url(${item.img})`,
                }}
              />
              <Image
                src={item.img}
                alt={item.title}
                layout="intrinsic"
                className={styles.image}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.horizontalLine}></div>
    </Link>
  );
};

export default Card;
