// src/pages/BarangaysPage.tsx
import { useEffect, useState } from "react";
import api from "../api/axios";

const BarangaysPage = () => {
  const [barangays, setBarangays] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/barangays");
        setBarangays(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Barangays</h2>
      <ul>
        {barangays.map((b) => (
          <li key={b._id} className="mb-2 p-2 bg-white rounded shadow">{b.name} — {b.municipality}</li>
        ))}
      </ul>
    </div>
  );
};

export default BarangaysPage;
