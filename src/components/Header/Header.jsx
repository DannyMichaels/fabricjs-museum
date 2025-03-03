import { HeaderContainer, HeaderActions } from '../../styles/StyledComponents';
import useGalleryStore from '../../store/galleryStore';

const Header = () => {
  const { toggleGallery, toggleSaveModal } = useGalleryStore();

  return (
    <HeaderContainer>
      <h1>Virtual Museum Art Creator</h1>
      <HeaderActions>
        <button onClick={() => toggleGallery(true)}>Gallery</button>
        <button onClick={() => toggleSaveModal(true)}>Save Artwork</button>
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header;
