import {
  ToolbarContainer,
  ToolTabs,
  TabButton,
} from '../../styles/StyledComponents';
import useCanvasStore from '../../store/canvasStore';
import ShapesTools from './ShapesTools';
import PatternsTools from './PatternsTools';
import ArtStyleTools from './ArtStyleTools';
import FiltersTools from './FiltersTools';
import CanvasControls from '../Canvas/CanvasControls';

const ToolsPanel = () => {
  const { activeTab, setActiveTab } = useCanvasStore();

  return (
    <ToolbarContainer>
      <ToolTabs>
        <TabButton
          active={activeTab === 'shapes'}
          onClick={() => setActiveTab('shapes')}>
          Shapes
        </TabButton>
        <TabButton
          active={activeTab === 'patterns'}
          onClick={() => setActiveTab('patterns')}>
          Patterns
        </TabButton>
        <TabButton
          active={activeTab === 'artStyles'}
          onClick={() => setActiveTab('artStyles')}>
          Art Styles
        </TabButton>
        <TabButton
          active={activeTab === 'filters'}
          onClick={() => setActiveTab('filters')}>
          Filters
        </TabButton>
      </ToolTabs>

      {activeTab === 'shapes' && <ShapesTools />}
      {activeTab === 'patterns' && <PatternsTools />}
      {activeTab === 'artStyles' && <ArtStyleTools />}
      {activeTab === 'filters' && <FiltersTools />}

      <CanvasControls />
    </ToolbarContainer>
  );
};

export default ToolsPanel;
