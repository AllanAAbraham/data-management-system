import * as actions from './actions';

const initialState = {
  samples: [],
  sampleForm: { name: '', date_collected: '', experiment_type: '', storage_location: ''},
  isTableVisible: false,
  editSampleForm: { name: '', date_collected: '', experiment_type: '', storage_location: ''},
  isModalOpen: false,
  isAddModalOpen: false,
  searchQuery: { name: '', date_collected: '', experiment_type: '', storage_location: ''},
  searchResults: [],
  error: null,
  currentSample: null,
  isEditModalOpen: false,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case actions.ADD_SAMPLE:
      return {
        ...state,
        samples: [...state.samples, action.sample],
      };
    case actions.SET_SAMPLES:
      return {
        ...state,
        samples: action.samples,
      };
    case actions.SET_SAMPLE_FORM:
      return {
        ...state,
        sampleForm: action.sampleForm,
      };
    case actions.SET_IS_TABLE_VISIBLE:
      return {
        ...state,
        isTableVisible: action.isTableVisible,
      };
    case actions.SET_EDIT_SAMPLE_FORM:
      return {
        ...state,
        editSampleForm: action.editSampleForm,
      };
    case actions.SET_IS_ADD_MODAL_OPEN:
      return {
        ...state,
        isAddModalOpen: action.isAddModalOpen,
      };
    case actions.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };
    case actions.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.searchResults,
      };
    case actions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case actions.SET_CURRENT_SAMPLE:
      return {
        ...state,
        currentSample: action.payload,
      };

    case actions.SET_IS_EDIT_MODAL_OPEN:
      return {
        ...state,
        isEditModalOpen: action.payload,
      };
    default:
      return state;
  }
}

export default rootReducer;