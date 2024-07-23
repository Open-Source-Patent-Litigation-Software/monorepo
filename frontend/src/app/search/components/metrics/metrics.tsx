import React, { useState } from 'react';
import styles from './Metrics.module.css';
import { MetricProps } from '@/types/types';

const Metrics: React.FC<MetricProps> = ({
  metrics,
  addMetric,
  removeMetric,
  editMetric,
  lockMetrics,
  threshold,
  numPatents,
  handleNumPatentsChange,
  handleThresholdChange,
  loading // Add the loading prop
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const half = Math.ceil(metrics.length / 2);

  if (loading) {
    return (
      <>
        <div className={styles.subHeaderContainer}>
          <div className={`${styles.skeleton} ${styles.skeletonHeader}`}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.row}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div className={styles.metric} key={index}>
                <div className={styles.skeletonBox}>
                  <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
                  <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
                  <div className={styles.buttonGroup}>
                    <div className={`${styles.skeleton} ${styles.skeletonButton}`}></div>
                    <div className={`${styles.skeleton} ${styles.skeletonButton}`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.row}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div className={styles.metric} key={index + half}>
                <div className={styles.skeletonBox}>
                  <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
                  <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
                  <div className={styles.buttonGroup}>
                    <div className={`${styles.skeleton} ${styles.skeletonButton}`}></div>
                    <div className={`${styles.skeleton} ${styles.skeletonButton}`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.optionsContainer}>
            <div className={`${styles.inputContainer} ${styles.skeletonBox}`}>
              <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
              <div className={`${styles.skeleton} ${styles.skeletonInput}`}></div>
            </div>
            <div className={`${styles.inputContainer} ${styles.skeletonBox}`}>
              <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
              <div className={`${styles.skeleton} ${styles.skeletonInput}`}></div>
            </div>
            <div className={styles.buttonsContainer}>
              <div className={`${styles.skeleton} ${styles.skeletonButton}`}></div>
              <div className={`${styles.skeleton} ${styles.skeletonButton}`}></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.subHeaderContainer}>
        <h1>
          Lock in the 6 - 10 key feature for this patent.
        </h1>
      </div>
      <div className={styles.container}>
      <div className={styles.row}>
        {metrics.slice(0, half).map((metric, index) => (
          <div className={styles.metric} key={index}>
            <div className={styles.metricBox}>
              {editingIndex === index ? (
                <textarea
                  className={styles.textarea}
                  value={metric}
                  onChange={(e) => editMetric(index, e.target.value)}
                />
              ) : (
                <div className={styles.metricText}>{metric}</div>
              )}
              <div className={styles.buttonGroup}>
                {editingIndex === index ? (
                  <button className={styles.saveButton} onClick={() => setEditingIndex(null)}>Save</button>
                ) : (
                  <button className={styles.editButton} onClick={() => setEditingIndex(index)}>Edit</button>
                )}
                <button className={styles.removeButton} onClick={() => removeMetric(index)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.row}>
        {metrics.slice(half).map((metric, index) => (
          <div className={styles.metric} key={index + half}>
            <div className={styles.metricBox}>
              {editingIndex === index + half ? (
                <textarea
                  className={styles.textarea}
                  value={metric}
                  onChange={(e) => editMetric(index + half, e.target.value)}
                />
              ) : (
                <div className={styles.metricText}>{metric}</div>
              )}
              <div className={styles.buttonGroup}>
                {editingIndex === index + half ? (
                  <button className={styles.saveButton} onClick={() => setEditingIndex(null)}>Save</button>
                ) : (
                  <button className={styles.editButton} onClick={() => setEditingIndex(index + half)}>Edit</button>
                )}
                <button className={styles.removeButton} onClick={() => removeMetric(index + half)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.optionsContainer}>
        <div className={styles.inputContainer}>
          <label htmlFor="threshold" className={styles.inputLabel}>Threshold</label>
          <input
            id="threshold"
            type="number"
            min="0"
            max="100"
            defaultValue={threshold}
            onChange={(e) => handleThresholdChange(Number(e.target.value))}
            className={styles.numberInput}
            placeholder="Min value"
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="numPatents" className={styles.inputLabel}>Number of Patents</label>
          <input
            id="numPatents"
            type="number"
            min="0"
            max="100"
            defaultValue={numPatents}
            onChange={(e) => handleNumPatentsChange(Number(e.target.value))}
            className={styles.numberInput}
            placeholder="Max value"
          />
        </div>
        <div className={styles.buttonsContainer}>
          <button className={styles.addButton} onClick={addMetric}>Add Metric</button>
          <button className={styles.lockButton} onClick={lockMetrics}>Lock Metrics</button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Metrics;
