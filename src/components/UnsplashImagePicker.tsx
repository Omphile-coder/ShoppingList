import { useState } from "react";
import { useGetImagesQuery } from "../api/imageApi";

type Props = {
  label: string;
  searchHint: string;
  value: string;
  disabled?: boolean;
  onChange: (url: string) => void;
};

export function UnsplashImagePicker({
  label,
  searchHint,
  value,
  disabled,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");

  const { currentData, isFetching, isError, refetch } = useGetImagesQuery(
    query,
    {
      skip: !open || !query,
    },
  );

  const search = () => {
    const next = term.trim();
    if (!next) return;
    if (next === query) void refetch();
    else setQuery(next);
  };

  return (
    <div className="image-picker">
      <p className="control-label">{label}</p>

      {value && <img src={value} alt={label} className="selected-item-image" />}

      <div className="image-picker-actions">
        <button
          type="button"
          className="action-btn edit-btn"
          disabled={disabled}
          onClick={() => {
            const next = searchHint.trim();
            setTerm(next);
            setQuery(next);
            setOpen(true);
          }}
        >
          {value ? "Change image" : "Choose image"}
        </button>

        {value && (
          <button
            type="button"
            className="action-btn delete-btn"
            disabled={disabled}
            onClick={() => onChange("")}
          >
            Remove
          </button>
        )}
      </div>

      {open && (
        <div className="image-picker-results">
          <div className="image-search-row">
            <input
              type="text"
              placeholder="Search for an item, e.g. apples"
              value={term}
              disabled={disabled}
              onChange={(event) => setTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  search();
                }
              }}
              className="auth-input"
            />
            <button
              type="button"
              className="action-btn btn-primary"
              disabled={disabled || !term.trim() || isFetching}
              onClick={search}
            >
              {isFetching ? "Searching..." : "Search"}
            </button>
            <button
              type="button"
              className="action-btn edit-btn"
              onClick={() => setOpen(false)}
            >
              Hide
            </button>
          </div>

          {isError ? (
            <p className="alert-error">
              Could not load images. Check your connection and try again.
            </p>
          ) : !query ? (
            <p className="image-help">Search Unsplash for a matching image.</p>
          ) : currentData?.results.length ? (
            <div className="image-results-grid">
              {currentData.results.map((photo) => (
                <div key={photo.id}>
                  <button
                    type="button"
                    className="image-result-btn"
                    disabled={disabled}
                    onClick={() => {
                      onChange(photo.urls.small);
                      setOpen(false);
                    }}
                    aria-label={`Select ${photo.alt_description || query}`}
                  >
                    <img
                      src={photo.urls.thumb}
                      alt={photo.alt_description || query}
                      loading="lazy"
                    />
                  </button>
                  <a
                    href={`${photo.user.links.html}?utm_source=shopping_list_app&utm_medium=referral`}
                    target="_blank"
                    rel="noreferrer"
                    className="image-credit"
                  >
                    {photo.user.name}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="image-help">No images found. Try another search.</p>
          )}

          <a
            href="https://unsplash.com/?utm_source=shopping_list_app&utm_medium=referral"
            target="_blank"
            rel="noreferrer"
            className="image-credit"
          >
            Photos from Unsplash
          </a>
        </div>
      )}
    </div>
  );
}
