import React from "react";
import Patent from "./patent";
import { PatentListProps } from "@/types/types";
import styles from "./Patent.module.css";
import Tag from "./components/tag"
import { motion } from 'framer-motion';
import PatentSkeleton from "./patentSkeleton";

const itemVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

// PatentList component definition
const PatentList: React.FC<PatentListProps> = ({ items, metrics, search, handleTagClick, selectedTag, unlockMetrics, loading }) => {
  const loadingAnimation = {
    background: [
      'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)'
    ],
    backgroundSize: '200% 100%',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  };

  if (loading) {
    return (
      <div>
        <div className={styles.metricsContainer}>
          <div className={styles.editContainer}>
            <motion.div
              className={`${styles.skeleton} ${styles.skeletonButton}`}
              animate={loadingAnimation}
            ></motion.div>
          </div>
          <div className={styles.tagsContainer}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={styles.editContainer}>
                <motion.div
                  className={`${styles.skeleton} ${styles.skeletonTag}`}
                  animate={loadingAnimation}
                ></motion.div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.patentsContainer}>
          {Array.from({ length: 6 }).map((_, index) => (
            <PatentSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (items == null) {
    return (<>Items are null.</>);
  }

  return (
    <div className={styles.patentListContainer}>
      <div className={styles.metricsContainer}>
        <div className={styles.editContainer}>
          <button className={styles.editButton} onClick={unlockMetrics}>
            Edit Metrics
          </button>
        </div>
        <div className={styles.tagsContainer}>
          {metrics.map((tag, index) => (
            <Tag
              key={tag}
              label={tag}
              selected={index === selectedTag}
              onClick={() => handleTagClick(index)}
            />
          ))}
        </div>
      </div>
      <div className={styles.patentsContainer}>
        {items.map((item, index) => (
          <Patent
            key={index}
            item={item}
            searchMetrics={metrics}
            search={search}
          />
        ))}
      </div>
    </div>
  );
};

export default PatentList;
