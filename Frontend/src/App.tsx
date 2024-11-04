import React, { useState } from 'react';
import { Header } from './components/main_page';
import { Button } from '@blueprintjs/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Importing drag-and-drop components
import { previewStyle } from './css_styles';
import '@blueprintjs/core/lib/css/blueprint.css';

const App: React.FC = () => {
  const [filePreviews, setFilePreviews] = useState<{ type: string; data: string }[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const previews: { type: string; data: string }[] = [];
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push({ type: file.type, data: reader.result as string });
          if (previews.length === fileArray.length) {
            setFilePreviews(prevPreviews => [...prevPreviews, ...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleClear = () => {
    setFilePreviews([]);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return; // Exit if dropped outside any destination

    const reorderedPreviews = Array.from(filePreviews);
    const [movedPreview] = reorderedPreviews.splice(result.source.index, 1);
    reorderedPreviews.splice(result.destination.index, 0, movedPreview);

    setFilePreviews(reorderedPreviews); // Update state with new order
  };

  return (
    <div>
      <Header />
      <div style={{ textAlign: 'center', marginLeft: '35vw' }}>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          multiple
          accept=".pdf, .doc, .docx, image/*"
          style={{ margin: '10px' }}
        />
        <Button
          onClick={handleClear}
          intent="danger"
          style={{ marginLeft: '10px' }}
          text="Clear"
        />
      </div>
      {filePreviews.length > 0 && (
        <div>
          <h3 style={{ color: 'black' }}>File Previews:</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    ...previewStyle,
                    width: '100%',
                    height: '300px',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    whiteSpace: 'nowrap',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'inline-flex' }}>
                    {filePreviews.map((preview, index) => (
                      <Draggable key={`draggable-${index}`} draggableId={`draggable-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              margin: '10px',
                              ...provided.draggableProps.style // Include draggable style
                            }}
                          >
                            {preview.type.startsWith('image/') ? (
                              <img
                                src={preview.data}
                                alt={`preview-${index}`}
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                              />
                            ) : preview.type === 'application/pdf' ? (
                              <iframe
                                src={preview.data}
                                title={`preview-${index}`}
                                style={{ width: '150px', height: '200px' }}
                              />
                            ) : (
                              <div>Unsupported file type</div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder} {/* Placeholder for drag-and-drop */}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

export default App;