"use client";
// components/ExcelUploader.tsx
import { createClient } from "@supabase/supabase-js";
import React, { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";

const ExcelUploader = () => {
  const [fileData, setFileData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const numRowsToDisplay = 200;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result as string;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1 }) as any[][];

        // Filter the data based on conditions
        data = data.filter((row) => row[13] !== 0 && (row[3] === "Z4" || row[3] === "Z5"));

        // Remove text and convert to numeric for each cell at position 8
        data = data.map((row) => {
          // Remove commas from the string in row[8]
          const stringWithoutCommas = row[8].replace(/,/g, "");

          // Parse numeric part of the string without commas
          const numericValue = parseFloat(stringWithoutCommas);

          // Update row[8] with the numeric value
          row[8] = isNaN(numericValue) ? null : numericValue;
          return row;
        });

        setFileData(data);

        setLoading(false);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  async function uploadData() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseKey || !supabaseUrl) {
      throw new Error("Supabase key or URL is missing. Make sure they're set in the environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract relevant data for insertion
    const dataToInsert = fileData.map((row) => ({
      store: row[4],
      article: row[6],
      description: row[7],
      z_status: row[3],
      cost: row[14],
      rrp: row[8],
      soh: row[13],
      department: row[0],
      sub_department: row[1],
    }));

    try {
      const updateTime = new Date().toISOString(); // to set the updated_at time in the database for every row to the same timestamp
      const updateResponse = await supabase.from("stock").upsert(
        dataToInsert.map((row) => ({
          article: row.article,
          store: row.store,
          department: row.department,
          z_status: row.z_status,
          cost: row.cost,
          rrp: row.rrp,
          soh: row.soh,
          description: row.description, // included description
          sub_department: row.sub_department, // included sub_department
          updated_at: updateTime, // use created_at as updated_at
        })),
        { onConflict: "article, store", count: "exact" }
      );
      console.log("Data updated successfully:", updateResponse);

      const cleanupResponse = await supabase.from("stock").delete().neq("updated_at", updateTime);
      console.log("Data cleanup successfully:", cleanupResponse);

      setFileData([]);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div>
      {!fileData.length && (
        <input
          className="file-input file-input-bordered w-full max-w-xs mb-5 me-4"
          type="file"
          id="fileInput"
          name="file"
          onChange={handleFileChange}
        />
      )}
      {/* display loading whilst file is being uploaded*/}
      {loading && <div className="text-center text-xl">Loading...</div>}

      {fileData.length > 0 && (
        <>
          <button className="btn btn-outline ms-4" onClick={uploadData}>
            Submit
          </button>
          <button className="btn btn-outline ms-4" onClick={() => setFileData([])}>
            Clear
          </button>
          <div className="py-3">
            Displaying {numRowsToDisplay} of {fileData.length} rows
          </div>
          <table className="table-zebra hidden md:block">
            <thead className=" border border-l-0 border-r-0 border-t-0">
              <tr>
                <TH data="Store" />
                <TH data="Article" />
                <TH data="Description" />
                <TH data="Z Status" />
                <TH data="MAP" />
                <TH data="RRP" />
                <TH data="GM" />
                <TH data="SOH" />
              </tr>
            </thead>
            <tbody>
              {fileData.slice(0, numRowsToDisplay).map((row, index) => (
                <tr key={index} className="p-1">
                  <TD data={row[4]} />
                  <TD data={row[6]} />
                  <TD data={row[7]} />
                  <TD data={row[3]} />
                  <TD data={row[14]} />
                  <TD data={row[8]} />
                  <TD data={row[7]} />
                  <TD data={row[13]} />
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

function TD({ data }: { data: string }) {
  return <td className="pe-7">{data}</td>;
}

function TH({ data }: { data: string }) {
  return <th className="text-left pe-7">{data}</th>;
}

export default ExcelUploader;
