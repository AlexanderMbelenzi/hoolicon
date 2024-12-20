"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Modal from "../ParentComponent";
import WritePage from "../write/page";
import ThemeToggle from "../themeToggle/ThemeToggle";
import { FaUser, FaCog, FaCrown, FaSignInAlt, FaSignOutAlt, FaPlus, FaEllipsisV, FaHandsHelping, FaBullhorn } from "react-icons/fa";


const AuthLinks = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { status } = useSession();

  // Effect to manage body overflow when the menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'auto'; // Enable scrolling
    }
  }, [isMenuOpen]);

  const handleMenuClick = () => {
    setMenuOpen(false);
  };

  const handleAddIconClick = () => {
    setModalOpen(true);
    setMenuOpen(false); // Close the menu if open
  };

  const handleDotsClick = () => {
    setMenuOpen(!isMenuOpen);
    setModalOpen(false); // Close the modal if open
  };

  return (
    <>
      {status === "unauthenticated" ? (
        <Link href="/login" className={styles.link}>
          Log in
        </Link>
      ) : (
        <span className={`${styles.link} ${styles.link}`} >
          Premium
        </span>
      )}

      <div className={styles.dots} onClick={handleDotsClick}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>

      {isMenuOpen && (
        <>
          <div className={styles.popupMenu}>

            <Link href="/" onClick={handleMenuClick}>
              <FaUser className={styles.icon} /> Profile
            </Link>
            <Link href="/" onClick={handleMenuClick}>
              <FaHandsHelping className={styles.icon} /> Contributor Program
            </Link>
            <Link href="/" onClick={handleMenuClick}>
              <FaCog className={styles.icon} /> Settings
            </Link>

            <Link href="/" onClick={handleMenuClick}>
              <FaBullhorn className={styles.icon} /> Advertise on Hoolicon
            </Link>
            <Link href="/" onClick={handleMenuClick}>
              <FaCrown className={styles.icon} /> Go premium
            </Link>


            {status === "unauthenticated" ? (
              <Link  href="/login" onClick={handleMenuClick}>
                <FaSignInAlt className={styles.icon} /> Login
              </Link>
            ) : (
              
               <Link  href="/login" onClick={signOut}>
               <FaSignOutAlt className={styles.icon} /> Logout
             </Link>
            )}

<div style={{ display: 'flex', alignItems: 'center' }}>
  <ThemeToggle />
  <span style={{ marginLeft: '20px' }}>Theme</span>

</div>



          </div>
          <div className={styles.overlay} onClick={handleMenuClick}></div>
        </>
      )}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
          <WritePage closeModal={() => setModalOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default AuthLinks;
