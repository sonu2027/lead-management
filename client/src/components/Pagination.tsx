import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalLeads: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalLeads,
  limit,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}) => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 4) {
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 3) {
        if (totalPages > 5) {
          pages.push("...");
        }
        for (let i = Math.max(2, totalPages - 4); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalLeads);

  if (totalPages <= 1) {
    return (
      <div className="bg-white px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {totalLeads} lead{totalLeads !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-4 py-3 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
       
        <div className="text-sm text-gray-700">
          Showing {startItem} to {endItem} of {totalLeads} lead
          {totalLeads !== 1 ? "s" : ""}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${hasPrevPage
                ? "text-gray-700 hover:bg-gray-100 border border-gray-300"
                : "text-gray-400 cursor-not-allowed border border-gray-200"
              }`}
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && onPageChange(page)
                }
                disabled={page === "..."}
                className={`px-3 py-1 text-sm rounded-md transition-colors font-medium ${page === currentPage
                    ? "bg-blue-600 text-white shadow-md"
                    : page === "..."
                      ? "text-gray-400 cursor-default px-2"
                      : "text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${hasNextPage
                ? "text-gray-700 hover:bg-gray-100 border border-gray-300"
                : "text-gray-400 cursor-not-allowed border border-gray-200"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
