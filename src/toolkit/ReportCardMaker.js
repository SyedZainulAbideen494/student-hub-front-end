import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaArrowLeft, FaCheckCircle, FaPen } from "react-icons/fa";
import './ReportCardMaker.css';

const ReportCardMaker = () => {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [marksObtained, setMarksObtained] = useState("");
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [previousSubjectIndex, setPreviousSubjectIndex] = useState(null);

  const addSubject = () => {
    if (subject && totalMarks && marksObtained) {
      if (previousSubjectIndex !== null) {
        const updatedSubjects = [...subjects];
        updatedSubjects[previousSubjectIndex] = { subject, totalMarks: parseFloat(totalMarks), marksObtained: parseFloat(marksObtained) };
        setSubjects(updatedSubjects);
        setPreviousSubjectIndex(null);
        setSuccessMessage("Subject updated successfully!");
      } else {
        setSubjects([
          ...subjects,
          { subject, totalMarks: parseFloat(totalMarks), marksObtained: parseFloat(marksObtained) },
        ]);
        setSuccessMessage("Subject added successfully!");
      }
      setSubject("");
      setTotalMarks("");
      setMarksObtained("");
    }
  };

  const editLastSubject = (index) => {
    const subjectToEdit = subjects[index];
    setSubject(subjectToEdit.subject);
    setTotalMarks(subjectToEdit.totalMarks);
    setMarksObtained(subjectToEdit.marksObtained);
    setPreviousSubjectIndex(index);
  };

  const generateReport = () => {
    setIsReportGenerated(true);
    setSuccessMessage("Report generated successfully!");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const randomNumber = Math.floor(Math.random() * 10000);
    doc.text("Edusify Report Card", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Subject", "Max Marks", "Marks Obtained"]],
      body: subjects.map((s) => [s.subject, s.totalMarks, s.marksObtained]),
    });
    doc.save(`edusify_report_card_${randomNumber}.pdf`);
    setSuccessMessage("PDF downloaded successfully!");
  };

  const totalMaxMarks = subjects.reduce((acc, curr) => acc + curr.totalMarks, 0);
  const totalMarksObtained = subjects.reduce((acc, curr) => acc + curr.marksObtained, 0);
  const percentage = (totalMarksObtained / totalMaxMarks) * 100 || 0;

  // Success message disappearing after 2 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="report-card-maker__container__report__card__maker">
              <button className="back-button__report__card__maker" onClick={() => window.history.back()}>
        <FaArrowLeft />
      </button>

      <h2 className="report-card-maker__heading__report__card__maker">Edusify Report Card Maker</h2>
      

      {/* Conditionally show the form only if report is not generated */}
      {!isReportGenerated && (
        <>
          <div className="subject-input__container__report__card__maker">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <input
              type="number"
              placeholder="Total Marks"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
            />
            <input
              type="number"
              placeholder="Marks Obtained"
              value={marksObtained}
              onChange={(e) => setMarksObtained(e.target.value)}
            />
          </div>
          
          <button className="add-subject__button__report__card__maker" onClick={addSubject}>
            {previousSubjectIndex !== null ? "Update Subject" : "Add Subject"}
          </button>

          {subjects.length > 0 && (
            <button className="generate-report__button__report__card__maker" onClick={generateReport}>
              Generate Report
            </button>
          )}

          {subjects.length > 0 && (
            <div className="subject-list__container__report__card__maker">
              <h3>Added Subjects</h3>
              <ul>
                {subjects.map((subj, index) => (
                  <li key={index}>
                    {subj.subject} - Max Marks: {subj.totalMarks}, Marks Obtained: {subj.marksObtained}{" "}
                    <button className="edit-subject__button__report__card__maker" onClick={() => editLastSubject(index)}>
                      <FaPen /> Edit
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Show report section only after report is generated */}
      {isReportGenerated && (
        <div className="report-card__table__report__card__maker">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Max Marks</th>
                <th>Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subj, index) => (
                <tr key={index}>
                  <td>{subj.subject}</td>
                  <td>{subj.totalMarks}</td>
                  <td>{subj.marksObtained}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{totalMaxMarks}</strong></td>
                <td><strong>{totalMarksObtained}</strong></td>
              </tr>
              <tr>
                <td colSpan="3"><strong>Percentage: {percentage.toFixed(2)}%</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {isReportGenerated && (
        <button className="download-pdf__button__report__card__maker" onClick={downloadPDF}>
          Download Report as PDF
        </button>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="success-modal__report__card__maker">
          <div className="success-message__report__card__maker">
            <FaCheckCircle /> {successMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCardMaker;
