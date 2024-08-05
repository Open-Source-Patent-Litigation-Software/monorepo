"use client";

import React from "react";
import Image from "next/image";
import { Navbar } from "../../_components/navbar/navbar";
import styles from "./dashboard.module.css";
import PopUpModal from "../../_components/popup/popup";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

const routesLoggedOut = {
  // add any logged out tools here (free trial tool later down the line etc.)
};
const routesLoggedIn = {
  PatentSearch: {
    route: "/search",
    imageUrl: "search.svg",
    description:
      "Use our specially trained AI model to automate patent analysis",
  },
  SavedPatents: {
    route: "/saved",
    imageUrl: "document.svg",
    description: "View your saved patents to revisit your past work.",
  },
  BulkZipDownload: {
    route: "/zip",
    imageUrl: "compact-disc.svg",
    description:
      "Download PDFs for any patent you can imagine, all with one click.",
  },
  SummaryDocumentGeneration: {
    route: "/bulk_summaries",
    imageUrl: "highlighter.svg",
    description:
      "Generate a full document summary for all the patents you need.",
  },
};

const Dashboard: React.FC = () => {
  const { user, error, isLoading } = useUser();
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        {!isLoading && user && (
          <div className={styles.dashboardContainer}>
            {Object.entries(routesLoggedIn).map(
              ([name, { route, imageUrl, description }]) => (
                <Link key={name} href={route} className={styles.styledCard}>
                  <Image
                    src={imageUrl}
                    alt={name}
                    className={styles.cardImage}
                    width={500}
                    height={300}
                  />
                  <div key={name}>{name.replace(/([A-Z])/g, " $1").trim()}</div>
                  <p className={styles.cardDescription}>{description}</p>
                </Link>
              )
            )}
          </div>
        )}
        {!isLoading && !user && (
          <PopUpModal
            title="Sign In"
            error="Use the sign in button in the top right to access our tools!"
          ></PopUpModal>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
