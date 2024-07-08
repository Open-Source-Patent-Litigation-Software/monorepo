'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../_components/navbar/navbar';
import { Footer } from '../../_components/footer/footer';
import LoadingSpinner from '../search/components/loading/loadingSpinner';
import styles from '../search/styles.module.css';

const Index = () => {
  const [patentQuery, setPatentQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notFoundPatents, setNotFoundPatents] = useState<string[]>([]);
  const [additionalData, setAdditionalData] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setAdditionalData(null);
    setNotFoundPatents([]);
    try {
      const response = await fetch('/api/download-patents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patent_ids: patentQuery.split(',').map(id => id.trim()) }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'patents.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();

        const additionalDataHeader = response.headers.get('Additional-Data');
        if (additionalDataHeader) {
          const additionalDataJson = JSON.parse(additionalDataHeader);
          setAdditionalData(additionalDataJson.message);
          setNotFoundPatents(additionalDataJson.not_found);
        }
      } else {
        const errorResponse = await response.json();
        if (errorResponse.not_found) {
          setNotFoundPatents(errorResponse.not_found);
        }
        console.error('Failed to download patents');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (additionalData) {
      alert(additionalData);
    }
  }, [additionalData]);

  return (
    <>
      <div className={styles.colored_div}>
        <Navbar />
        <div className={styles.animation_container}>
          <div className={styles.search_container}>
            <h2 className={styles.search_bar_title}>Search{"\n"}Patents</h2>
            <div className={styles.search_input_wrapper}>
              <textarea
                className={styles.search_textarea}
                onChange={(e) => setPatentQuery(e.target.value)}
                placeholder="Enter patent IDs, separated by commas."
              />
              <button
                className={styles.search_button}
                onClick={handleDownload}
                disabled={isLoading}
              >
                {isLoading ? 'Downloading...' : 'Download PDFs'}
              </button>
            </div>
          </div>
          {isLoading && <LoadingSpinner />}
          {notFoundPatents.length > 0 && (
            <div>
              <p>The following patents could not be found:</p>
              <ul>
                {notFoundPatents.map((patentId, index) => (
                  <li key={index}>{patentId}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
