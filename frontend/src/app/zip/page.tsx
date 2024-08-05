'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../_components/navbar/navbar';
import { Footer } from '../../_components/footer/footer';
import PatentInput from '@/_components/patentInput/patentInput';
import styles from './style.module.css';
import LoadingSpinner from '../search/components/loading/loadingSpinner';

const Index = () => {
  const [patents, setPatents] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notFoundPatents, setNotFoundPatents] = useState<string[]>([]);
  const [additionalData, setAdditionalData] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
      setInputValue(value);
  };

  const handleFormSubmit = async () => {
    const values = inputValue.split(/[\n,]/).map(value => value.trim()).filter(value => value !== '');
    setPatents([...values]);
    setNotFoundPatents([]);
    setAdditionalData('');
  };

  const handleRemoveBox = (index: number) => {
      const values = [...patents];
      values.splice(index, 1);
      setPatents(values);
  };

  const handlePatentChange = (index: number, value: string) => {
      const values = [...patents];
      values[index] = value;
      setPatents(values);
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setAdditionalData(null);
    setNotFoundPatents([]);
    try {
      const response = await fetch('/api/zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patent_ids: patents }),
      });

      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const jsonResponse = await response.json();
          if (jsonResponse.message === 'No valid patents found') {
            setNotFoundPatents(jsonResponse.not_found);
          } else {
            console.error('Unexpected JSON response:', jsonResponse);
          }
        } else {
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
        <div className={styles.container}>
            <h1 className={styles.heading}>Patent PDF Downloader</h1>
            <PatentInput handleDownload={handleDownload} notFoundPatents={notFoundPatents} handleFormSubmit={handleFormSubmit} handleInputChange={handleInputChange} handlePatentChange={handlePatentChange} handleRemoveBox={handleRemoveBox} loading={isLoading} patents={patents} />
            {patents.length == 0 && (
              <div
                  style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      width: "50%",
                      textAlign: "center",
                      justifyItems: "center",
                      margin: "auto",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                  }}
              >
                  Please input patetent numbers separated on new lines or by commas!
              </div>
            )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
