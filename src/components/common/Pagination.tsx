import { ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <>
      <style>{`
        /* Pagination Wrapper */
        .pagination-wrap {
          display: flex;
          justify-content: center;
          margin-top: 2.5rem;
          margin-bottom: 2rem;
        }

        /* Pagination List */
        .pagination {
          display: flex;
          align-items: center;
          gap: 0;
          list-style: none;
          padding: 0;
          margin: 0;
          border: 1px solid #ffffff;
          background-color: #000000;
          overflow: hidden;
        }

        .pagination li {
          margin: 0;
          padding: 0;
        }

        .pagination > li > span {
          padding: 11px 20px;
        }

        /* Base Page Number Styles */
        .page-numbers {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 50px;
          height: 40px;
          padding: 0 1rem;
          font-weight: 400;
          text-decoration: none;
          background-color: #2d2d2d;
          color: #ffffff;
          transition: all 0.2s ease;
          cursor: pointer;
          border-right: 1px solid #ffffff;
          border-radius: 0;
          font-size: 0.95rem;
        }

        .pagination li:last-child .page-numbers {
          border-right: none;
        }

        .page-numbers:hover:not(.current):not(.dots) {
          background-color: #3d3d3d;
        }

        /* Current Active Page */
        .page-numbers.current {
          background-color: #1373e8;
          font-weight: 400;
          cursor: default;
          color: #ffffff;
        }

        /* Dots Separator */
        .page-numbers.dots {
          background-color: #2d2d2d;
          cursor: default;
          min-width: 50px;
        }

        .page-numbers.dots:hover {
          background-color: #2d2d2d;
        }

        /* Next Button */
        .next.page-numbers {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background-color: #2d2d2d;
          min-width: auto;
          padding: 0 1.2rem;
        }

        .next.page-numbers:hover {
          background-color: #3d3d3d;
        }

        /* Material Icons for Next Button */
        .next.page-numbers .material-left {
          font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .page-numbers {
            min-width: 40px;
            padding: 0 0.75rem;
            font-size: 0.875rem;
            height: 36px;
          }
          
          .next.page-numbers {
            padding: 0 1rem;
          }
        }
      `}</style>

      <div className="pagination-wrap">
        <ul className="pagination">
          {/* Page Numbers */}
          {pages.map((page, index) => (
            <li key={index}>
              {page === '...' ? (
                <span className="page-numbers dots">…</span>
              ) : currentPage === page ? (
                <span aria-current="page" className="page-numbers current">
                  {page}
                </span>
              ) : (
                <a
                  href={`${basePath}/page/${page}`}
                  className="page-numbers"
                >
                  {page}
                </a>
              )}
            </li>
          ))}

          {/* Next Button */}
          {currentPage < totalPages && (
            <li>
              <a
                href={`${basePath}/page/${currentPage + 1}`}
                className="next page-numbers"
              >
                <span className="material-left">Next</span>
                <ChevronRight size={16} />
              </a>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
