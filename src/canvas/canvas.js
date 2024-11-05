// src/Canvas.js
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [brushStyle, setBrushStyle] = useState('round');
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const startDrawing = (event) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineWidth = lineWidth;
    context.lineCap = brushStyle;
    context.strokeStyle = lineColor;
    context.globalAlpha = opacity;
    context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = async () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    const payload = {
      image: dataURL,
      notes: [...notes],
    };

    try {
      await axios.post('http://localhost:8080/api/save/canvas', payload);
      alert('Canvas saved successfully!');
      // Clear the canvas after saving
      clearCanvas();
      setNotes([]);
    } catch (error) {
      console.error('Error saving drawing:', error);
    }
  };

  const addTextNote = () => {
    if (text) {
      setNotes([...notes, { type: 'text', content: text }]);
      setText('');
    }
  };

  const addImageNote = () => {
    if (imageUrl) {
      setNotes([...notes, { type: 'image', content: imageUrl }]);
      setImageUrl('');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 200; // Adjust height to leave space for controls
  }, []);

  return (
    <div style={{ overflowY: 'scroll', maxHeight: '100vh' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: '1px solid black' }}
      />
      <div style={{ marginTop: '10px' }}>
        <input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} />
        <input type="range" min="1" max="50" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} />
        <input type="range" min="0" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(e.target.value)} />
        <select onChange={(e) => setBrushStyle(e.target.value)} value={brushStyle}>
          <option value="round">Round</option>
          <option value="butt">Butt</option>
          <option value="square">Square</option>
        </select>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={saveCanvas}>Save</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Add text note"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addTextNote}>Add Text</button>
      </div>
      <div>
        <input
          type="url"
          placeholder="Add image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button onClick={addImageNote}>Add Image</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        {notes.map((note, index) => (
          <div key={index}>
            {note.type === 'text' ? (
              <p>{note.content}</p>
            ) : (
              <img src={note.content} alt="note" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
