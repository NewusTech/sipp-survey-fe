import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

const Paginations = ({
  currentPage,
  totalPages,
  onPageChange,
  onPrevious,
  onNext,
}: PaginationProps) => {
  const maxVisiblePages = window.innerWidth >= 768 ? 10 : 3; // Maximum number of visible page links
  const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

  // Function to generate page links based on current page and total pages
  const generatePageLinks = () => {
    const pages = [];
    const startPage = Math.max(currentPage - halfMaxVisiblePages, 1);
    const endPage = Math.min(currentPage + halfMaxVisiblePages, totalPages);

    // Add ellipsis if start page is greater than 1
    if (startPage > 1) {
      pages.push(
        <PaginationLink
          key="start-ellipsis"
          className="disabled w-5 h-5 flex items-center"
        >
          ...
        </PaginationLink>,
      );
    }

    // Add page links within visible range
    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <PaginationLink
          key={page}
          onClick={() => onPageChange(page)}
          className={`cursor-pointer w-5 h-5 rounded-full text-${currentPage === page ? "white" : "black"} ${currentPage === page ? "bg-gray-500 hover:bg-gray-700 hover:text-white transition-all duration-500" : "bg-white hover:bg-gray-200 transition-all duration-500"} text-[10px]`}
        >
          {page}
        </PaginationLink>,
      );
    }

    // Add ellipsis if end page is less than total pages
    if (endPage < totalPages) {
      pages.push(
        <PaginationLink
          key="end-ellipsis"
          className="disabled w-5 h-5 flex items-center"
        >
          ...
        </PaginationLink>,
      );
    }

    return pages;
  };

  return (
    <Pagination className="mt-5">
      <PaginationContent className="flex items-center gap-14 md:gap-24">
        <PaginationItem>
          <PaginationPrevious
            onClick={onPrevious}
            className={`text-abu hover:text-biru cursor-pointer ${currentPage === 1 ? "cursor-not-allowed pointer-events-none  text-slate-300" : ""}`}
          />
        </PaginationItem>
        <PaginationItem className="flex gap-2">
          {generatePageLinks()}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={onNext}
            className={`text-abu hover:text-biru cursor-pointer ${currentPage === totalPages ? "cursor-not-allowed pointer-events-none text-slate-300" : ""}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginations;
