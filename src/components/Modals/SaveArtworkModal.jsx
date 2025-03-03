import {
  Modal,
  ModalContent,
  FormGroup,
  ButtonGroup,
} from '../../styles/StyledComponents';
import useGalleryStore from '../../store/galleryStore';
import useCanvasStore from '../../store/canvasStore';

const SaveArtworkModal = () => {
  const {
    currentArtworkName,
    setCurrentArtworkName,
    showSaveModal,
    toggleSaveModal,
    addArtwork,
  } = useGalleryStore();

  const { fabricCanvas, selectedFilter } = useCanvasStore();

  if (!showSaveModal) return null;

  const saveArtwork = () => {
    if (!fabricCanvas) return;

    const canvasData = JSON.stringify(fabricCanvas.toJSON());
    const thumbnail = fabricCanvas.toDataURL({
      format: 'jpeg',
      quality: 0.8,
    });

    const newArtwork = {
      id: Date.now(),
      name: currentArtworkName,
      canvasData,
      thumbnail,
      date: new Date().toLocaleDateString(),
      filter: selectedFilter,
    };

    addArtwork(newArtwork);
    toggleSaveModal(false);
  };

  return (
    <Modal>
      <ModalContent>
        <h2>Save Your Masterpiece</h2>
        <FormGroup>
          <label htmlFor="artwork-name">Artwork Name:</label>
          <input
            id="artwork-name"
            type="text"
            value={currentArtworkName}
            onChange={(e) => setCurrentArtworkName(e.target.value)}
          />
        </FormGroup>
        <ButtonGroup>
          <button onClick={saveArtwork}>Save</button>
          <button onClick={() => toggleSaveModal(false)}>Cancel</button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default SaveArtworkModal;
