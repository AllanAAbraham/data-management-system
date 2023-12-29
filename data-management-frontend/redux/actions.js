export const ADD_SAMPLE = 'ADD_SAMPLE';
export const SET_SAMPLES = 'SET_SAMPLES';
export const SET_SAMPLE_FORM = 'SET_SAMPLE_FORM';
export const SET_IS_TABLE_VISIBLE = 'SET_IS_TABLE_VISIBLE';
export const SET_EDIT_SAMPLE_FORM = 'SET_EDIT_SAMPLE_FORM';
export const SET_IS_MODAL_OPEN = 'SET_IS_MODAL_OPEN';
export const SET_IS_ADD_MODAL_OPEN = 'SET_IS_ADD_MODAL_OPEN';
export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
export const SET_ERROR = 'SET_ERROR';
export const SET_CURRENT_SAMPLE = 'SET_CURRENT_SAMPLE';
export const SET_IS_EDIT_MODAL_OPEN = 'SET_IS_EDIT_MODAL_OPEN';


export function addSample(sample) {
  return { type: ADD_SAMPLE, sample };
}

export function setSamples(samples) {
  return { type: SET_SAMPLES, samples };
}

export function setSampleForm(sampleForm) {
  return { type: SET_SAMPLE_FORM, sampleForm };
}

export function setIsTableVisible(isTableVisible) {
  return { type: SET_IS_TABLE_VISIBLE, isTableVisible };
}

export function setEditSampleForm(editSampleForm) {
  return { type: SET_EDIT_SAMPLE_FORM, editSampleForm };
}

export function setIsModalOpen(isModalOpen) {
  return { type: SET_IS_MODAL_OPEN, isModalOpen };
}

export function setIsAddModalOpen(isAddModalOpen) {
  return { type: SET_IS_ADD_MODAL_OPEN, isAddModalOpen };
}

export const setSearchQuery = query => ({
    type: SET_SEARCH_QUERY,
    payload: query
  });

export function setSearchResults(searchResults) {
  return { type: SET_SEARCH_RESULTS, searchResults };
}

export const setCurrentSample = (sample) => ({
    type: SET_CURRENT_SAMPLE,
    payload: sample,
});

export const setIsEditModalOpen = (isOpen) => ({
    type: SET_IS_EDIT_MODAL_OPEN,
    payload: isOpen,
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error,
});