// pages/index.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { setSamples, setSampleForm, setIsTableVisible, setEditSampleForm, setIsEditModalOpen, setIsAddModalOpen, setError } from '../redux/actions';
import Link from 'next/link'; 

const Home = () => {
  const dispatch = useDispatch();
  const samples = useSelector(state => state.samples);
  const sampleForm = useSelector(state => state.sampleForm);
  const isTableVisible = useSelector(state => state.isTableVisible);
  const editSampleForm = useSelector(state => state.editSampleForm);
  const isAddModalOpen = useSelector(state => state.isAddModalOpen);
  const isEditModalOpen = useSelector(state => state.isEditModalOpen);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  let sortedSamples = [...samples];
  if (sortField !== null) {
    sortedSamples.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSamples = sortedSamples.slice(startIndex, endIndex);

  
  const fetchSamples = async () => {
      try {
        const response = await axios.get('http://localhost:8000/samples');
        dispatch(setSamples(response.data));
      } catch (error) {
        console.error(error);
        dispatch(setError('Failed to fetch samples'));
      }
    };

  useEffect(() => {
    fetchSamples();
  }, [dispatch]);


  const toggleTable = () => {
    dispatch(setIsTableVisible(!isTableVisible));
  };

  const deleteSample = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/samples/${id}`);
      fetchSamples();
    } catch (error) {
      console.error(error);
      dispatch(setError('Failed to delete sample'));
    }
  };
  

  const addSample = async (event) => {
    event.preventDefault();
    if (!sampleForm.name || !sampleForm.date_collected || !sampleForm.experiment_type || !sampleForm.storage_location) {
      alert('Please fill out all fields.');
      return;
    }
  
    try {
      await axios.post('http://localhost:8000/samples', sampleForm)
      .then(() => {
        fetchSamples();
        dispatch(setSampleForm({
          name: '',
          date_collected: '',
          experiment_type: '',
          storage_location: '',
        }));
        dispatch(setIsAddModalOpen(false)); 
      });
    } catch (error) {
      //dispatch(setError(error.message));
      dispatch(setError('Failed to add sample'));
    }
  };

  const updateSample = async (event) => {
    event.preventDefault();
  
    try {
      await axios.put(`http://localhost:8000/samples/${editSampleForm.id}`, editSampleForm);
      dispatch(setIsEditModalOpen(false));
      fetchSamples();
      
    } catch (error) {
      console.error(error);
      dispatch(setError('Failed to update sample'));
    }
  };

  const openEditModal = (sample) => {
    dispatch(setEditSampleForm(sample));
    dispatch(setIsEditModalOpen(true));
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Sample Dashboard</h1>
      <div>
    

    <div style={{  justifyContent: 'center', marginBottom: '20px'  }}>
      <button onClick={() => dispatch(setIsAddModalOpen(true))}>Add Sample</button>
      <button onClick={toggleTable}>
        {isTableVisible ? "Hide Sample Data" : "See All Sample Data"}
      </button>
      <Link href="/search">
        <button>Search Sample Data</button>
      </Link>
    </div>
  </div>
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => dispatch(setIsAddModalOpen(false))}
        style={{
          content: {
            width: '200px', 
            height: '200px',
            margin: 'auto', 
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          },
        }}
      >
        <h2>Add a new sample</h2>
        <form onSubmit={addSample}>
          <input
            type="text"
            value={sampleForm.name}
            onChange={(e) => dispatch(setSampleForm({ ...sampleForm, name: e.target.value }))}
            placeholder="Name"
            maxLength="255"
            required
          />
          <input
            type="date"
            value={sampleForm.date_collected}
            onChange={(e) => dispatch(setSampleForm({ ...sampleForm, date_collected: e.target.value }))}
            placeholder="Date Collected"
            required
          />
          <input
            type="text"
            value={sampleForm.experiment_type}
            onChange={(e) => dispatch(setSampleForm({ ...sampleForm, experiment_type: e.target.value }))}
            placeholder="Experiment Type"
            maxLength="255"
            required
          />
          <input
            type="text"
            value={sampleForm.storage_location}
            onChange={(e) => dispatch(setSampleForm({ ...sampleForm, storage_location: e.target.value }))}
            placeholder="Storage Location"
            maxLength="255"
            required
          />
          <button type="submit">Add Sample</button>
        </form>
      </Modal>
      
      
    {isTableVisible && (
      <table className="sample-table">
        <thead>
          <tr>
            <th className="hoverable" onClick={() => { setSortField('name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>Name</th>
            <th className="hoverable" onClick={() => { setSortField('date_collected'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>Date Collected</th>
            <th className="hoverable" onClick={() => { setSortField('experiment_type'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>Experiment Type</th>
            <th className="hoverable" onClick={() => { setSortField('storage_location'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>Storage Location</th>
          </tr>
        </thead>
        <tbody>
        {currentSamples.map((sample, index) => (
            <tr key={index}>
              <td>{sample.name}</td>
              <td>{sample.date_collected}</td>
              <td>{sample.experiment_type}</td>
              <td>{sample.storage_location}</td>
              <td>
              <button onClick={() => openEditModal(sample)}>Edit</button>
              <button onClick={() => { setDeleteModalOpen(true); setSelectedSample(sample); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
  <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
  <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(samples.length / itemsPerPage)}>Next</button>
</div>
      </table>
      
    )}
    
    {isDeleteModalOpen && (
      <div 
      className="delete-modal"
      onClick={(e) => {
        if (e.target.className === 'delete-modal') {
          setDeleteModalOpen(false);
        }
      }}
    >
  <div className="delete-modal-content">
    <p>Are you sure you want to delete the following sample?</p>
    <p>Name: {selectedSample.name}</p>
    <p>Date Collected: {selectedSample.date_collected}</p>
    <p>Experiment Type: {selectedSample.experiment_type}</p>
    <p>Storage Location: {selectedSample.storage_location}</p>
    <button onClick={() => { deleteSample(selectedSample.id); setDeleteModalOpen(false); }}>Confirm</button>
    <button onClick={() => setDeleteModalOpen(false)}>Cancel</button>
    </div>
  </div>
)}

<Modal
  isOpen={isEditModalOpen}
  onRequestClose={() => dispatch(setIsEditModalOpen(false))}
  style={{
    content: {
      width: '200px', 
      height: '200px', 
      margin: 'auto',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  }}
>
  <h2>Edit sample</h2>
  <form onSubmit={updateSample}>
    <input
      type="text"
      value={editSampleForm.name}
      onChange={(e) => dispatch(setEditSampleForm({ ...editSampleForm, name: e.target.value }))}
      placeholder="Name"
      maxLength="255"
      required
    />
    <input
    type="date"
    value={editSampleForm.date_collected}
    onChange={(e) => dispatch(setEditSampleForm({ ...editSampleForm, date_collected: e.target.value }))}
    placeholder="Date Collected"
    required
  />
  <input
    type="text"
    value={editSampleForm.experiment_type}
    onChange={(e) => dispatch(setEditSampleForm({ ...editSampleForm, experiment_type: e.target.value }))}
    placeholder="Experiment Type"
    maxLength="255"
    required
  />
  <input
    type="text"
    value={editSampleForm.storage_location}
    onChange={(e) => dispatch(setEditSampleForm({ ...editSampleForm, storage_location: e.target.value }))}
    placeholder="Storage Location"
    maxLength="255"
    required
  />
    <button type="submit">Save</button>
  </form>
</Modal>

      

    </div>
    
  );
};

export default Home;