import { GalleryItemContainer } from '../../styles/StyledComponents';
import useCanvasStore from '../../store/canvasStore';
import useGalleryStore from '../../store/galleryStore';
import useHistoryStore from '../../store/historyStore';

const GalleryItem = ({ artwork }) => {
  const { fabricCanvas, setSelectedFilter } = useCanvasStore();
  const { toggleGallery, setCurrentArtworkName, deleteArtwork } =
    useGalleryStore();
  const { initHistory } = useHistoryStore();

  const loadArtwork = () => {
    if (!fabricCanvas) return;

    fabricCanvas.loadFromJSON(JSON.parse(artwork.canvasData), () => {
      fabricCanvas.renderAll();
      setCurrentArtworkName(artwork.name);
      setSelectedFilter(artwork.filter);
      toggleGallery(false);

      // Reset history with the loaded artwork as the initial state
      initHistory(artwork.canvasData);
    });
  };

  const downloadArtwork = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.download = `${artwork.name}.png`;
    link.href = artwork.thumbnail;
    link.click();
  };

  const onDeleteClick = (e) => {
    e.stopPropagation();
    deleteArtwork(artwork.id);
  };

  return (
    <GalleryItemContainer>
      <img src={artwork.thumbnail} alt={artwork.name} />
      <h3>{artwork.name}</h3>
      <p>Created: {artwork.date}</p>

      <footer>
        <button onClick={loadArtwork}>Load</button>
        <button onClick={downloadArtwork}>Download</button>
        <button onClick={onDeleteClick}>Delete</button>
      </footer>
    </GalleryItemContainer>
  );
};

export default GalleryItem;
