import { CSSProperties } from "react";

export const barStyle: CSSProperties = {
    height: '5vh',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
};

export const previewStyle: CSSProperties = {
    width: '100%',         // Set the width to 100% of the container
    height: '300px',      // Set a fixed height for the preview container
    overflowX: 'auto',    // Enable horizontal scrolling
    overflowY: 'hidden',   // Disable vertical scrolling (optional)
    whiteSpace: 'nowrap',  // Prevent line breaks
    border: '1px solid #ccc', // Optional: add a border for visibility
    boxSizing: 'border-box' // Ensure padding and border are included in width
};