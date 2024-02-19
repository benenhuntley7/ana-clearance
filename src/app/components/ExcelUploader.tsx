"use client";
// components/ExcelUploader.tsx
import React, { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";

const ExcelUploader = () => {
  const [fileData, setFileData] = useState<any[]>([]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result as string;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1 });
        setFileData(data);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  return (
    <div>
      <input
        className=" file-input file-input-bordered w-full max-w-xs mb-5"
        type="file"
        name="file"
        onChange={handleFileChange}
      />
      {fileData.length > 0 && (
        <table className="table-zebra hidden md:block">
          <thead className=" border border-l-0 border-r-0 border-t-0">
            <tr>
              <TH data="Article" />
              <TH data="EAN" />
              <TH data="Description" />
              <TH data="Z Status" />
              <TH data="MAP" />
              <TH data="RRP" />
              <TH data="GM" />
              <TH data="SOH" />
            </tr>
          </thead>
          <tbody>
            {fileData.map((row, index) => (
              <tr key={index} className="p-1">
                <TD data={row[1]} />
                <TD data={row[2]} />
                <TD data={row[3]} />
                <TD data={row[4]} />
                <TD data={row[6]} />
                <TD data={row[7]} />
                <TD data={row[8]} />
                <TD data={row[19]} />
              </tr>
            ))}
          </tbody>
        </table>
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
