"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const uploadPDF = async () => {
    if (!file) return alert("Please select a PDF.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/extract", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginTop: "30px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  };

  const thStyle: React.CSSProperties = {
    background: "#0070f3",
    color: "white",
    padding: "10px",
    textAlign: "left",
  };

  const tdStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "10px",
  };

  return (
    <main style={{ padding: "40px", fontFamily: "Inter, sans-serif", background: "#f4f7fb", minHeight: "100vh" }}>
      <h1 style={{ color: "#0070f3" }}>PDF Allergen & Nutrition Extractor</h1>

      <div style={cardStyle}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          style={{ padding: "10px" }}
        />

        <button
          onClick={uploadPDF}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#0070f3",
            color: "white",
            borderRadius: "6px",
            border: "none",
            fontWeight: "bold",
          }}
        >
          Upload & Extract
        </button>
      </div>

      {loading && (
        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          ⏳ Processing PDF…
        </p>
      )}

      {result && !loading && (
        <div style={{ marginTop: "40px" }}>

          {/* ALLERGEN TABLE */}
          <div style={cardStyle}>
            <h2 style={{ color: "#0070f3" }}>Allergens Found</h2>
            {Array.isArray(result.allergens) && result.allergens.length > 0 ? (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Allergen</th>
                  </tr>
                </thead>
                <tbody>
                  {result.allergens.map((a: any, i: number) => (
                    <tr key={i}>
                      <td style={tdStyle}>{a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No allergens detected.</p>
            )}
          </div>

          {/* NUTRITION TABLE */}
          <div style={cardStyle}>
            <h2 style={{ color: "#0070f3" }}>Nutritional Values</h2>

            {result.nutrition && typeof result.nutrition === "object" ? (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Nutrient</th>
                    <th style={thStyle}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.nutrition).map(([key, value], i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{key}</td>
                      <td style={tdStyle}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No nutrition data found.</p>
            )}
          </div>

          {/* RAW TEXT */}
          <div style={cardStyle}>
            <h2 style={{ color: "#0070f3" }}>Raw Text Preview</h2>
            <pre
              style={{
                background: "#f0f4ff",
                padding: "15px",
                borderRadius: "8px",
                whiteSpace: "pre-wrap",
              }}
            >
              {result.raw_text}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}
