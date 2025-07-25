"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ProfilingPage from "./_components/report";
import { SectionCards } from "./_components/section-cards";
import { Connection } from "./_components/types";

const SkeletonBoxes = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-48 w-full animate-pulse rounded-lg bg-gray-200/50 backdrop-blur-sm" />
    ))}
  </div>
);

export default function Page() {
  const searchParams = useSearchParams();
  const catalogueId = searchParams.get("catalogueId");
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatalogue, setSelectedCatalogue] = useState<string | null>(null);
  const [catalogueDetails, setCatalogueDetails] = useState<any | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/connections/get-connections");
        const data = await res.json();
        if (res.ok) {
          setConnections(data.connections);
          // Set initial selected catalogue
          if (catalogueId) {
            setSelectedCatalogue(catalogueId);
          } else if (data.connections.length > 0) {
            setSelectedCatalogue(data.connections[0].id);
          }
        } else {
          console.error(data.error || "Failed to load connections.");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [catalogueId]);

  useEffect(() => {
    const fetchCatalogueDetails = async () => {
      if (!selectedCatalogue) {
        setCatalogueDetails(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/connections/catalogue-overview/${selectedCatalogue}`);
        const data = await res.json();
        if (res.ok) {
          setCatalogueDetails(data.data);
        } else {
          console.error(data.error || "Failed to load catalogue details.");
          setCatalogueDetails(null);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setCatalogueDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogueDetails();
  }, [selectedCatalogue]);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {loading || !catalogueDetails ? (
        <SkeletonBoxes />
      ) : (
        <ProfilingPage
          connections={connections}
          selectedCatalogue={selectedCatalogue}
          catalogueDetails={catalogueDetails}
          changeCatalogue={(e) => setSelectedCatalogue(e)}
        />
      )}
    </div>
  );
}
