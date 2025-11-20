"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadPDF = async () => {
    if (!file) return alert("Please select a PDF.");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("https://nutrient-extract-9uay57hf0-ronald-turyatembas-projects.vercel.app", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>PDF Allergen & Nutrition Extractor</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
        if (!e.target.files || e.target.files.length === 0) return;
          setFile(e.target.files[0]);
            }}
      />

      <button
        onClick={uploadPDF}
        style={{
          marginLeft: "10px",
          padding: "8px 16px",
          cursor: "pointer",
          backgroundColor: "#0070f3",
          color: "white",
          borderRadius: "5px",
          border: "none",
        }}
      >
        Upload & Extract
      </button>

      {loading && <p style={{ marginTop: "20px" }}>Processing PDF…</p>}

      {result && !loading && (
        <div style={{ marginTop: "40px" }}>
          <h2>Allergens Found</h2>
          <pre>{JSON.stringify(result.allergens, null, 2)}</pre>

          <h2>Nutritional Values</h2>
          <pre>{JSON.stringify(result.nutrition, null, 2)}</pre>

          <h2>Raw Text Preview</h2>
          <pre>{result.raw_text}</pre>
        </div>
      )}
    </main>
  );
}
