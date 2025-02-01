import { useEffect } from "react";
import "./AiExplainModal.css";
import LoaderFlashcardExplain from "./flashcardExplainLoader";

const formatContent = (content) => {
  if (!content) return "";

  // Format code blocks
  content = content.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");

  // Format large headers
  content = content.replace(/## (.*?)(?=\n|\r\n)/g, "<h2 class='large-text'>$1</h2>");

  // Format bold text (**text** → <strong>text</strong>)
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Format italic text (*text* → <em>text</em>)
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Format list items (* item → <ul><li>item</li></ul>)
  content = content.replace(/^\* (.*?)(?=\n|\r\n)/gm, "<li>$1</li>");
  content = content.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");

  // Format tables
  content = content.replace(/((?:\|.*?\|(?:\r?\n|$))+)/g, (match) => {
    const rows = match.split("\n").filter((row) => row.trim());
    const tableRows = rows
      .map((row, index) => {
        const cells = row.split("|").filter((cell) => cell.trim());
        if (index === 0) {
          const headerContent = cells.map((cell) => `<th>${cell.trim()}</th>`).join("");
          return `<tr>${headerContent}</tr>`;
        }
        const rowContent = cells.map((cell) => `<td>${cell.trim()}</td>`).join("");
        return `<tr>${rowContent}</tr>`;
      })
      .join("");
    return `<table>${tableRows}</table>`;
  });

  // Format LaTeX/math expressions ($math$ → MathJax syntax)
  content = content.replace(/\$(.*?)\$/g, (_, math) => `\\(${math}\\)`);

  return content;
};

const AIExplanationModal = ({ isOpen, onClose, explanation, loading, setExplanation }) => {
  useEffect(() => {
    if (!isOpen) {
      setExplanation(""); // Reset explanation when closing the modal
    }
  }, [isOpen, setExplanation]);

  if (!isOpen) return null;

  return (
    <div className="modal__ai__explain__set__Modal">
      <div className="modal__content__ai__explain__set__Modal">
        <button className="modal__close-btn__ai__explain__set__Modal" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal__title__ai__explain__set__Modal">AI Explanation</h2>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <LoaderFlashcardExplain />
          </div>
        ) : (
          <div
            className="modal__text__ai__explain__set__Modal"
            dangerouslySetInnerHTML={{ __html: formatContent(explanation) }} // Format before displaying
          />
        )}
      </div>
    </div>
  );
};

export default AIExplanationModal;
