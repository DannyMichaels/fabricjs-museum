import {
  Modal,
  ModalContent,
  GalleryGrid,
  ButtonGroup,
} from '../../styles/StyledComponents';
import useGalleryStore from '../../store/galleryStore';
import GalleryItem from './GalleryItem';

const GalleryModal = () => {
  const { artworks, showGallery, toggleGallery } = useGalleryStore();

  if (!showGallery) return null;

  return (
    <Modal>
      <ModalContent>
        <h2>Your Art Gallery</h2>
        {artworks.length === 0 ? (
          <p>No artworks saved yet. Create your masterpiece and save it!</p>
        ) : (
          <GalleryGrid>
            {artworks.map((artwork) => (
              <GalleryItem key={artwork.id} artwork={artwork} />
            ))}
          </GalleryGrid>
        )}
        <ButtonGroup>
          <button onClick={() => toggleGallery(false)}>Close Gallery</button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default GalleryModal;
