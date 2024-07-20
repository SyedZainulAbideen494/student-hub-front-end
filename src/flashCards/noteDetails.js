import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './noteDetailsPage.css';
import FooterNav from '../app_modules/footernav';

const NoteDetailPage = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nav = useNavigate()

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`${API_ROUTES.getNote}/${id}`);
                setNote(response.data);
            } catch (error) {
                setError('Error fetching note details.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!note) return <div className="no-note">No note found.</div>;

    const images = note.images || [];

    const handleBackClick = () => {
        nav('/notes');
    };

    const downloadAsPDF = () => {
        const input = document.querySelector('.note-content-note-detail-page');
        html2canvas(input, { useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = pdfWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Add initial image
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Handle page breaks
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            // Save the PDF
            pdf.save('note.pdf');
        }).catch((error) => console.error('Error generating PDF:', error));
    };

    const downloadAsPNG = () => {
        const input = document.querySelector('.note-content-note-detail-page');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = imgData;
                link.download = 'note.png';
                link.click();
            })
            .catch((error) => console.error('Error generating PNG:', error));
    };

    return (
        <div className="note-detail-page">
            <div className="note-header-note-detail-page">
                <button onClick={handleBackClick} className="back-button-note-detail-page">
                    <span className="arrow-note-detail-page">←</span> Back
                </button>
                <h1>{note.title}</h1>
            </div>
            <div className="note-content-note-detail-page card-note-detail-page">
                <div
                    className="note-content-quill-note-detail-page"
                    dangerouslySetInnerHTML={{ __html: note.headings }}
                />
                <p className="note-description-note-detail-page">{note.description}</p>
                {images.length > 0 && (
                    <div className="note-images-section-note-detail-page">
                        <h2>Images</h2>
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={`${API_ROUTES.displayImg}/${image}`}
                                alt={`Note image ${index + 1}`}
                                className="note-image-note-detail-page"
                                onError={(e) => console.error(`Error loading image: ${e.target.src}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="note-download-buttons">
                <button onClick={downloadAsPDF} className="download-button">Download as PDF</button>
            </div>
            <FooterNav />
        </div>
    );
};

export default NoteDetailPage;