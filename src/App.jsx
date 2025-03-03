import { AppContainer, MainContent, AppInfo } from './styles/StyledComponents';
import {
  Header,
  ToolsPanel,
  CanvasContainer,
  GalleryModal,
  SaveArtworkModal,
} from './components';

function App() {
  return (
    <AppContainer>
      <Header />

      <MainContent>
        <ToolsPanel />
        <CanvasContainer />
      </MainContent>

      <GalleryModal />
      <SaveArtworkModal />

      <AppInfo>
        <p>
          Welcome to the Virtual Museum Art Creator! Create your own
          museum-worthy digital art using shapes, patterns, and apply different
          art styles.
          <br />
          Made by&nbsp;
          <a
            target="_blank"
            href="https://www.upwork.com/freelancers/~019a9afd0f1e94fc80">
            &copy;&nbsp;Daniel Michael
          </a>
        </p>
      </AppInfo>
    </AppContainer>
  );
}

export default App;
