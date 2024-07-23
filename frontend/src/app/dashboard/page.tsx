"use client";

import React from "react";
import { Navbar } from "../../_components/navbar/navbar";
import styles from "./dashboard.module.css";
import PopUpModal from "../../_components/popup/popup";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirectToTool } from "@/redirects/toolRedirect";
import Link from "next/link";
import { Footer } from "../../_components/footer/footer";

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
  AggregateSummaries: {
    route: "/patentID",
    imageUrl: "open-book.svg",
    description: "Summarize as many patents as you'd like, all at once.",
  },
  BulkZipDownload: {
    route: "/zip",
    imageUrl: "compact-disc.svg",
    description:
      "Download PDFs for as many patents as you need, all with one click.",
  },
  InContextSummary: {
    route: "/",
    imageUrl: "highlighter.svg",
    description:
      "Summarize patents within the context of your patent analysis needs.",
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
                  <img
                    src={imageUrl}
                    alt={name}
                    className={styles.cardImage}
                  ></img>
                  <div key={name}>{name.replace(/([A-Z])/g, " $1").trim()}</div>
                  <p className={styles.cardDescription}>{description}</p>
                </Link>
              )
            )}
          </div>
        )}
        {!isLoading && !user && (
          <div>
            <PopUpModal
              title="Sign In"
              error="Use the sign in button in the top right to access our tools!"
            ></PopUpModal>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
