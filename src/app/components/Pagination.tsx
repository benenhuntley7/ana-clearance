import React, { useState } from "react";

interface PaginationProps {
  storeData: any[]; // Adjust the type accordingly
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  ITEMS_PER_PAGE: number;
}

export const Pagination: React.FC<PaginationProps> = ({ storeData, currentPage, setCurrentPage, ITEMS_PER_PAGE }) => {
  // Calculate the total number of pages
  const totalPages = Math.ceil(storeData.length / ITEMS_PER_PAGE);

  // Create a range of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex justify-between w-full my-4">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={currentPage === 1 ? "text-gray-400 me-2" : " me-2"}
      >
        Prev
      </button>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => setCurrentPage(pageNumber)}
          disabled={currentPage === pageNumber}
          className={currentPage === pageNumber ? "font-bold me-2" : " me-2"}
        >
          {pageNumber}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={currentPage === totalPages ? "text-gray-400 me-2" : " me-2"}
      >
        Next
      </button>
    </div>
  );
};
