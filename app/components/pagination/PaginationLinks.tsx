const PaginationLinks = ({
    prev,
    next,
    hasPrev,
    hasNext,
    totalPages,
    page,
    setPage,
}: {
    prev: () => void;
    next: () => void;
    hasPrev: boolean;
    hasNext: boolean;
    totalPages: number;
    page: number;
    setPage: (page: number) => void;
}) => {
    return (
        <>
        <div className="flex items-center justify-center mt-10 gap-2">
          <button
            className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-50"
            onClick={prev}
            disabled={!hasPrev}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`px-3 py-1 text-xs rounded border ${n === page ? 'bg-theme-orange text-white border-theme-orange' : 'border-gray-300 text-gray-700'}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-50"
            onClick={next}
            disabled={!hasNext}
          >
            Next
          </button>
        </div>
        </>
    )
};

export default PaginationLinks;