import { useMemo, useState, type FormEvent } from "react";
import { sort, countDoubleNumber, type OrderType } from "./utils";
import "./App.css";

type Domino = [number, number];

const DEFAULT_DOMINOES: Domino[] = [
  [6, 1],
  [4, 3],
  [5, 1],
  [3, 4],
  [1, 1],
  [3, 4],
  [1, 2],
];

// Fungsi untuk menggandakan daftar domino agar perubahan state tidak mengubah data awal.
function cloneDominoes(list: Domino[]): Domino[] {
  return list.map(([top, bottom]) => [top, bottom]);
}

// Fungsi untuk mengubah daftar domino menjadi teks seperti contoh pada instruksi.
function formatDominoes(list: Domino[]): string {
  const formattedPairs = list.map(([top, bottom]) => `(${top},${bottom})`);
  return `[${formattedPairs.join(", ")}]`;
}

// Komponen utama aplikasi Dominoes
export default function App() {
  const [dominoes, setDominoes] = useState<Domino[]>(() =>
    cloneDominoes(DEFAULT_DOMINOES)
  );
  const [totalToRemove, setTotalToRemove] = useState<string>("");

  const doubleNumbers = useMemo(
    () => countDoubleNumber(dominoes),
    [dominoes]
  );

  // Urutkan domino naik/turun
  const handleSort = (order: OrderType) => {
    setDominoes((prev) => sort(prev, order));
  };

  // Tukar posisi atas dan bawah
  const handleFlip = () => {
    setDominoes((prev) => prev.map(([top, bottom]) => [bottom, top]));
  };

  // Hapus duplikat domino (tanpa urutan)
  const handleRemoveDuplicates = () => {
    setDominoes((prev) => {
      const counts: Record<string, number> = {};

      prev.forEach(([a, b]) => {
        const key = [a, b].sort((x, y) => x - y).join("-");
        counts[key] = (counts[key] || 0) + 1;
      });

      return prev.filter(([a, b]) => {
        const key = [a, b].sort((x, y) => x - y).join("-");
        return counts[key] === 1;
      });
    });
  };

  // Reset data
  const handleReset = () => {
    setDominoes(cloneDominoes(DEFAULT_DOMINOES));
    setTotalToRemove("");
  };

  // Hapus berdasarkan total nilai
  const handleRemoveByTotal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number(totalToRemove);

    if (Number.isNaN(parsed)) return;

    setDominoes((prev) =>
      prev.filter(([top, bottom]) => top + bottom !== parsed)
    );
    setTotalToRemove("");
  };

  return (
    <div className="app">
      <h1>Dominoes</h1>

      <div className="info-panel">
        <div className="info-card">
          <h2>Source</h2>
          <p>{formatDominoes(DEFAULT_DOMINOES)}</p>
        </div>

        <div className="info-card">
          <h2>Double Numbers</h2>
          <p>{doubleNumbers}</p>
        </div>
      </div>

      <div className="domino-grid">
        {dominoes.map(([top, bottom], index) => (
          <div className="domino-card" key={`${top}-${bottom}-${index}`}>
            <span className="domino-value">{top}</span>
            <span className="domino-divider" />
            <span className="domino-value">{bottom}</span>
          </div>
        ))}
      </div>

      <div className="actions">
        <button type="button" onClick={() => handleSort("asc")}>
          Sort (ASC)
        </button>
        <button type="button" onClick={() => handleSort("desc")}>
          Sort (DESC)
        </button>
        <button type="button" onClick={handleFlip}>
          Flip
        </button>
        <button type="button" onClick={handleRemoveDuplicates}>
          Remove Dup
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>

      <form className="remove-form" onSubmit={handleRemoveByTotal}>
        <label htmlFor="totalInput">Input Number</label>
        <div className="remove-controls">
          <input
            id="totalInput"
            type="number"
            value={totalToRemove}
            onChange={(event) => setTotalToRemove(event.target.value)}
            placeholder="Total to remove"
          />
          <button type="submit" disabled={totalToRemove === ""}>
            Remove
          </button>
        </div>
      </form>
    </div>
  );
}