"use client";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <p>Viewing Information For: {params.id}</p>;
}
