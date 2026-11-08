import { useId, useState } from "react";
import { Search } from "lucide-react";
import { useGetImagesQuery } from "../api/imageApi";

type Props = {
  value: string;
  disabled?: boolean;
  onChange: (url: string) => void;
};

// Shows Unsplash search in the item form and returns the selected photo URL.
export function UnsplashImagePicker({ value, disabled, onChange }: Props) {
  const searchId = useId();
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");
  const { currentData, isFetching, isError, refetch } = useGetImagesQuery(query, { skip: !query });

  // Searches only when requested and lets the user retry the same query.
  function search() {
    const next = term.trim();
    if (!next || isFetching) return;
    if (next === query) void refetch();
    else setQuery(next);
  }

  return (
    <div className="image-picker">
      <label className="control-label" htmlFor={searchId}>Item image (optional)</label>
      <div className="image-search-row">
        <input
          id={searchId}
          className="auth-input"
          type="search"
          placeholder="Search Unsplash, e.g. apples"
          value={term}
          maxLength={100}
          disabled={disabled}
          onChange={(event) => setTerm(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            search();
          }}
        />
        <button type="button" className="icon-button image-search-button"
          aria-label="Search Unsplash" disabled={disabled || !term.trim() || isFetching} onClick={search}>
          <Search size={17} aria-hidden="true" />
        </button>
      </div>
      <p className="image-help">
        Photos courtesy of <a href="https://unsplash.com/?utm_source=shopping_list_app&utm_medium=referral"
          target="_blank" rel="noreferrer">Unsplash contributors</a>.
      </p>

      {value && (
        <div className="image-picker-selection">
          <img src={value} alt="Selected item photo" className="selected-item-image" />
          <button type="button" className="action-btn edit-btn" disabled={disabled} onClick={() => onChange("")}>
            Remove image
          </button>
        </div>
      )}

      {query && (
        <div className="image-picker-results">
          {isFetching ? (
            <p className="image-help" role="status">Searching for photos...</p>
          ) : isError ? (
            <p className="alert-error" role="alert">Photo search is unavailable. Try again or paste an image URL.</p>
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
                      setQuery("");
                    }}
                    aria-label={`Select ${photo.alt_description || query}`}
                  >
                    <img src={photo.urls.thumb} alt="" loading="lazy" />
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
            <p className="image-help" role="status">No images found. Try another search.</p>
          )}
        </div>
      )}
    </div>
  );
}
