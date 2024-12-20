"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import SidebarCategoryList from "../SidebarcategoryList/SidebarCategoryList";
import Modal from "../ParentComponent";
import WritePage from "../write/page";

const AuthLinks2 = () => {
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

  const handleBurgerClick = () => {
    setMenuOpen(!isMenuOpen);
    setModalOpen(false); // Close the modal if open
  };

  return (
    <>

      <div className={styles.burger} onClick={handleBurgerClick}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {isMenuOpen && (
        <>
          <div className={styles.responsiveMenu}>
          <SidebarCategoryList/>

          
       


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

export default AuthLinks2;
