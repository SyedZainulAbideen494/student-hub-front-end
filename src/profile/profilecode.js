<button className="delete-button" onClick={() => openDeleteModal(eduscribe.id)}>
<i className="fas fa-trash"></i>
</button>






{showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to delete this EduScribe?</p>
      <button className="modal-button" onClick={handleDelete}>Yes, Delete</button>
      <button className="modal-button" onClick={closeDeleteModal}>Cancel</button>
    </div>
  </div>
)}







const handleDelete = async () => {
  try {
    await axios.delete(`${API_ROUTES.deleteEduScribe}/${deleteId}`);
    setEduScribe(eduscribes.filter(eduscribe => eduscribe.id !== deleteId));
    closeDeleteModal();
  } catch (err) {
    console.error('Error deleting eduscribe:', err);
  }
};



const [showModal, setShowModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);