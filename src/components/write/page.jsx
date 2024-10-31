"use client";

import Image from "next/image";
import styles from "./writePage.module.css";
import { useEffect, useState, useRef } from "react";
import "react-quill/dist/quill.bubble.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/utils/firebase";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const WritePage = ({ closeModal }) => {
  const { status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState(n9ull);
  const [preview, setPreview] = useState("");
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("general");
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const modalContentRef = useRef(null);
  const quillModules = {
    clipboard: {
      matchVisual: false, // Forces pasted content to match editor styling
    },
  };

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  useEffect(() => {
    if (file) {
      const storage = getStorage(app);
      const upload = () => {
        setUploading(true);
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.error("Error uploading file:", error);
            setUploading(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setMedia(downloadURL);
              setUploading(false);
            });
          }
        );
      };
      upload();
    }
  }, [file]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

      const generateUniqueSlug = (title, desc) => {
        const baseSlug = slugify(`${title} ${desc}`);
        const uniqueIdentifier = Date.now();
        return `${baseSlug}-${uniqueIdentifier}`;
      };
      
  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 150) {
      setTitle(value);
    }
  };

  const handleContentChange = (content) => {
    if (content.length <= 40000) {
      setValue(content);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title && !value && !media) {
      alert("Please add at least a title, description, or image.");
      return;
    }
    
    if (title.length > 150) {
      alert("Title cannot exceed 150 characters.");
      return;
    }
    if (value.length > 40000) {
      alert("Description cannot exceed 40,000 characters.");
      return;
    }

    setPublishing(true);

    const uniqueSlug = generateUniqueSlug(title);

    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        desc: value,
        img: media,
        slug: uniqueSlug,
        catSlug: catSlug || "general",
      }),
    });

    setPublishing(false);

    if (res.status === 200) {
      const data = await res.json();
      router.push(`/posts/${data.slug}`);
      closeModal(); // Close the modal after successful publish
    }
  };

  const handleDeleteImage = () => {
    setFile(null);
    setPreview("");
    setMedia("");
  };

  const handleClickOutside = (event) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
      closeModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClickOutside}>
      <div className={styles.modalContent} ref={modalContentRef}>
        <button className={styles.closeButton} onClick={closeModal}>
          &times;
        </button>
        <form className={styles.container} onSubmit={handleSubmit}>
          <textarea
            type="text"
            placeholder="Title"
            className={styles.input}
            value={title}
            onChange={handleTitleChange}
          />
          <div className={styles.characterCount}>
            {150 - title.length} characters remaining
            {title.length > 150 && <span className={styles.error}>Title limit reached!</span>}
          </div>
          <select
            className={styles.select}
            value={catSlug}
            onChange={(e) => setCatSlug(e.target.value)}
          >
<option value="general">General</option>
<option value="business">Business </option>
<option value="technology">Technology</option>
<option value="economics">Economics</option>
<option value="science">Science</option>
<option value="engineering">Engineering</option>
<option value="mathematics">Mathematics</option>



          </select>

      

// In your ReactQuill component
<ReactQuill
  className={`${theme === 'dark' ? 'dark-theme' : 'light-theme'} editor`}
  theme="bubble"
  value={value}
  onChange={handleContentChange}
  placeholder="What's trending..."
  modules={quillModules}
/>


          <div className={styles.characterCount}>
            {40000 - value.length} characters remaining
            {value.length > 40000 && <span className={styles.error}>Content limit reached!</span>}
          </div>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="file" className={styles.fileLabel}>
            {uploading ? "Uploading..." : "Upload Image"}
          </label>
          {preview && (
            <div className={styles.previewContainer}>
              <Image src={preview} alt="Preview" className={styles.preview} width={200} height={200} />
              <button className={styles.deleteButton} onClick={handleDeleteImage}>
                &times;
              </button>
            </div>
          )}
          <div className={styles.buttons}>
            <button className={styles.button} type="submit" disabled={uploading || publishing}>
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WritePage;
