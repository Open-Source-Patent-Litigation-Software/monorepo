// components/PatentSkeleton.tsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Patent.module.css';

const PatentSkeleton: React.FC = () => (
  <motion.div
    className={styles.skeletonCard}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className={styles.skeletonCardHeader}>
      <motion.div
        className={`${styles.skeleton} ${styles.skeletonTitle}`}
        animate={{
          backgroundPosition: ['-200px 0', 'calc(200px + 100%) 0'],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      ></motion.div>
      <motion.div
        className={`${styles.skeleton} ${styles.skeletonScore}`}
        animate={{
          backgroundPosition: ['-200px 0', 'calc(200px + 100%) 0'],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      ></motion.div>
    </div>
    <motion.div
      className={`${styles.skeleton} ${styles.skeletonText}`}
      animate={{
        backgroundPosition: ['-200px 0', 'calc(200px + 100%) 0'],
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    ></motion.div>
    <motion.div
      className={`${styles.skeleton} ${styles.skeletonText}`}
      animate={{
        backgroundPosition: ['-200px 0', 'calc(200px + 100%) 0'],
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    ></motion.div>
    <motion.div
      className={`${styles.skeleton} ${styles.skeletonText}`}
      animate={{
        backgroundPosition: ['-200px 0', 'calc(200px + 100%) 0'],
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    ></motion.div>
  </motion.div>
);

export default PatentSkeleton;
