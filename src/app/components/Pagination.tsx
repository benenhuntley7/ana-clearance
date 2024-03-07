import React, { useState } from "react";

interface PaginationProps {
  storeData: any[]; // Adjust the type accordingly
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  ITEMS_PER_PAGE: number;
}

export const Pagination = ({ storeData, currentPage, setCurrentPage, ITEMS_PER_PAGE }: PaginationProps) => {
  // Calculate the total number of pages
  const totalPages = Math.ceil(storeData.length / ITEMS_PER_PAGE);

  // If there is only one page, don't display pagination
  if (totalPages <= 1) {
    return null;
  }

  // Create a range of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex  my-4">
      <p>Page:</p>
      {/*       <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={currentPage === 1 ? "text-gray-400 me-2" : " me-2"}
      >
        Prev
      </button> */}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => setCurrentPage(pageNumber)}
          disabled={currentPage === pageNumber}
          className={currentPage === pageNumber ? "font-bold ms-2" : " ms-2"}
        >
          {pageNumber}
        </button>
      ))}
      {/*       <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={currentPage === totalPages ? "text-gray-400 me-2" : " me-2"}
      >
        Next
      </button> */}
    </div>
  );
};
