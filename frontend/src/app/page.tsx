import Image from "next/image";
import styles from "./page.module.css";
import { Navbar } from "./components/navbar/navbar";
export default function Home() {
  return (
    <main>
      <Navbar />
      {/* <div>Summary</div>
      <div>Statistics</div>
      <div>Demo</div>
      <div>Footer</div> */}
    </main>
  );
}
