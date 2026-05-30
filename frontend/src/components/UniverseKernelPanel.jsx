import { useEffect, useState } from "react";

export default function UniverseKernelPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/runtime/universe-kernel");
        const json = await response.json();
        setData(json);
      } catch (error) {
        setData({
          ok: false,
          error: error.message,
        });
      }
    }
