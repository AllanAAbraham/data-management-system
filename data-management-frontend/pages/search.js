// pages/SearchPage.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { setEditSampleForm, setIsEditModalOpen, setSearchQuery, setSearchResults, setError } from '../redux/actions';


const SearchPage = () => {
    const dispatch = useDispatch();
    const editSampleForm = useSelector(state => state.editSampleForm);
    const isEditModalOpen = useSelector(state => state.isEditModalOpen);
    const searchQuery = useSelector(state => state.searchQuery);
    const searchResults = useSelector(state => state.searchResults);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSample, setSelectedSample] = useState(null); 
      
    useEffect(() => {
      if (searchQuery) {
        searchSamples();
      } else {
        dispatch(setSearchResults([])); 
      }
    }, [searchQuery, dispatch]);

    const clearFields = () => {
        dispatch(setSearchQuery({
          name: '',
          experiment_type: '',
          storage_location: '',
          date_collected: '',
        }));
      };

    const deleteSample = async (id) => {
      try {
        await axios.delete(`http://localhost:8000/samples/${id}`);
        
        searchSamples();
      } catch (error) {
        console.error(error);
        dispatch(setError('Failed to delete sample'));
      }
    };
    
    const searchSamples = async () => {

      if (!searchQuery.name && !searchQuery.experiment_type && !searchQuery.storage_location && !searchQuery.date_collected) {
          dispatch(setSearchResults([])); 
          return; 
        }
      
        try {
          const response = await axios.get(`http://localhost:8000/samples-search`, { params: searchQuery });
          dispatch(setSearchResults(response.data)); 
        } catch (error) {
          console.error(error);
          dispatch(setError('Failed to find sample'));
        }
      };
  
    const updateSample = async (event) => {
      event.preventDefault();
    
      try {
        await axios.put(`http://localhost:8000/samples/${editSampleForm.id}`, editSampleForm);
        dispatch(setIsEditModalOpen(false));
        
        searchSamples();
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
        <div>
    
    
  </div>
  <h3 style={{ textAlign: 'center'}}>Search Samples</h3>
  <div style={{  justifyContent: 'center', marginBottom: '20px'  }}>
      <Link href="/">
        <button>Return to Home Page</button>
      </Link>
    </div>
  <div className="search-samples-div">
  <input
  type="text"
  placeholder="Name"
  value={searchQuery.name}
  onChange={e => dispatch(setSearchQuery({ ...searchQuery, name: e.target.value }))}
/>
<input
  type="text"
  placeholder="Experiment Type"
  value={searchQuery.experiment_type}
  onChange={e => dispatch(setSearchQuery({ ...searchQuery, experiment_type: e.target.value }))}
/>
<input
  type="text"
  placeholder="Storage Location"
  value={searchQuery.storage_location}
  onChange={e => dispatch(setSearchQuery({ ...searchQuery, storage_location: e.target.value }))}
/>
<input
  type="date"
  value={searchQuery.date_collected}
  onChange={e => dispatch(setSearchQuery({ ...searchQuery, date_collected: e.target.value }))}
/>
<button onClick={clearFields}>Clear all fields</button>

</div>
    {searchResults.length > 0 && (
  <div>
    <table className='search-table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Date Collected</th>
          <th>Experiment Type</th>
          <th>Storage Location</th>
        </tr>
      </thead>
      <tbody>
        {searchResults.map((sample) => (
          <tr key={sample.id}>
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
    </table>
  </div>
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

export default SearchPage;