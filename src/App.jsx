import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import _ from 'lodash';
import styled from 'styled-components';

// Styled Components
const AppContainer = styled.div`
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
`;

const HeaderActions = styled.div`
  button {
    margin-left: 10px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  margin-bottom: 20px;
`;

const ToolTabs = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const TabButton = styled.button`
  padding: 8px 16px;
  background-color: ${(props) => (props.active ? '#fff' : '#f0f0f0')};
  border: 1px solid #ccc;
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
  color: ${(props) => (props.active ? '#000' : '#333')};
  cursor: pointer;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  border-bottom-color: ${(props) => (props.active ? '#fff' : '#ccc')};
`;

const ToolOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
`;

const OptionButton = styled.button`
  padding: 8px 12px;
  background-color: ${(props) => (props.active ? '#007bff' : '#e0e0e0')};
  color: ${(props) => (props.active ? 'white' : 'black')};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.active ? '#0069d9' : '#d0d0d0')};
  }
`;

const ObjectActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;

  button {
    padding: 8px 12px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    color: black;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

const CanvasContainer = styled.div`
  border: 1px solid #ccc;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  color: black;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const GalleryItem = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
  }

  footer {
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    align-items: center;
    button {
      cursor: pointer;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const AppInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 4px solid #007bff;
  color: #333;
`;

function App() {
  const [activeTab, setActiveTab] = useState('shapes');
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [artworks, setArtworks] = useState([]);
  const [currentArtworkName, setCurrentArtworkName] = useState(
    'Untitled Masterpiece'
  );
  const [showGallery, setShowGallery] = useState(false);
  const [showArtworkInfo, setShowArtworkInfo] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [artHistory, setArtHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize Fabric canvas
  useEffect(() => {
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f5f5f5',
      preserveObjectStacking: true,
    });

    // Add event listeners
    fabricCanvasRef.current.on('object:modified', saveToHistory);
    fabricCanvasRef.current.on('object:added', saveToHistory);

    // Setup initial canvas state
    initCanvas();

    // Cleanup on unmount
    return () => {
      fabricCanvasRef.current.dispose();
    };
  }, []);

  // Initialize canvas with background
  const initCanvas = () => {
    fabricCanvasRef.current.clear();

    // Add initial empty state to history
    const initialState = JSON.stringify(fabricCanvasRef.current.toJSON());
    setArtHistory([initialState]);
    setHistoryIndex(0);
  };

  // Save current state to history
  const saveToHistory = _.debounce(() => {
    const currentState = JSON.stringify(fabricCanvasRef.current.toJSON());

    // If we're not at the end of the history array, truncate
    if (historyIndex < artHistory.length - 1) {
      const newHistory = artHistory.slice(0, historyIndex + 1);
      setArtHistory([...newHistory, currentState]);
    } else {
      setArtHistory([...artHistory, currentState]);
    }

    setHistoryIndex(historyIndex + 1);
  }, 500);

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = JSON.parse(artHistory[newIndex]);
      fabricCanvasRef.current.loadFromJSON(state, () => {
        fabricCanvasRef.current.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  // Redo function
  const handleRedo = () => {
    if (historyIndex < artHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const state = JSON.parse(artHistory[newIndex]);
      fabricCanvasRef.current.loadFromJSON(state, () => {
        fabricCanvasRef.current.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  // Add a shape to canvas
  const addShape = (shapeType) => {
    let shape;

    switch (shapeType) {
      case 'circle':
        shape = new fabric.Circle({
          radius: 50,
          fill: getRandomColor(),
          left: 100,
          top: 100,
        });
        break;
      case 'rectangle':
        shape = new fabric.Rect({
          width: 100,
          height: 80,
          fill: getRandomColor(),
          left: 100,
          top: 100,
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: getRandomColor(),
          left: 100,
          top: 100,
        });
        break;
      case 'polygon':
        const points = generatePolygonPoints(6, 50);
        shape = new fabric.Polygon(points, {
          fill: getRandomColor(),
          left: 100,
          top: 100,
        });
        break;
      case 'star':
        const starPoints = generateStarPoints(5, 50, 25);
        shape = new fabric.Polygon(starPoints, {
          fill: getRandomColor(),
          left: 100,
          top: 100,
        });
        break;
      default:
        return;
    }

    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.setActiveObject(shape);
  };

  // Generate random color
  const getRandomColor = () => {
    const colors = [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      '#2196f3',
      '#03a9f4',
      '#00bcd4',
      '#009688',
      '#4caf50',
      '#8bc34a',
      '#cddc39',
      '#ffeb3b',
      '#ffc107',
      '#ff9800',
      '#ff5722',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Generate polygon points
  const generatePolygonPoints = (sides, radius) => {
    const points = [];
    const angleStep = (2 * Math.PI) / sides;

    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep;
      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      });
    }

    return points;
  };

  // Generate star points
  const generateStarPoints = (points, outerRadius, innerRadius) => {
    const starPoints = [];
    const angleStep = Math.PI / points;

    for (let i = 0; i < points * 2; i++) {
      const angle = i * angleStep;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      starPoints.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      });
    }

    return starPoints;
  };

  // Add a pattern to canvas
  const addPattern = (patternType) => {
    let pattern;

    switch (patternType) {
      case 'dots':
        createPatternWithShapes('circle', 10, 10);
        break;
      case 'grid':
        createPatternWithShapes('rectangle', 8, 8);
        break;
      case 'triangles':
        createPatternWithShapes('triangle', 6, 6);
        break;
      case 'stars':
        createPatternWithShapes('star', 4, 4);
        break;
      default:
        return;
    }
  };

  // Create pattern with multiple shapes
  const createPatternWithShapes = (shapeType, rows, cols) => {
    const group = [];
    const shapeSize = 20;
    const spacing = 40;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let shape;
        const x = j * spacing;
        const y = i * spacing;

        switch (shapeType) {
          case 'circle':
            shape = new fabric.Circle({
              radius: shapeSize / 2,
              fill: getRandomColor(),
              left: x,
              top: y,
            });
            break;
          case 'rectangle':
            shape = new fabric.Rect({
              width: shapeSize,
              height: shapeSize,
              fill: getRandomColor(),
              left: x,
              top: y,
            });
            break;
          case 'triangle':
            shape = new fabric.Triangle({
              width: shapeSize,
              height: shapeSize,
              fill: getRandomColor(),
              left: x,
              top: y,
            });
            break;
          case 'star':
            const starPoints = generateStarPoints(
              5,
              shapeSize / 2,
              shapeSize / 4
            );
            shape = new fabric.Polygon(starPoints, {
              fill: getRandomColor(),
              left: x,
              top: y,
            });
            break;
        }

        group.push(shape);
      }
    }

    const patternGroup = new fabric.Group(group, {
      left: 100,
      top: 100,
    });

    fabricCanvasRef.current.add(patternGroup);
    fabricCanvasRef.current.setActiveObject(patternGroup);
  };

  // Add art movement styles
  const applyArtStyle = (style) => {
    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();

    switch (style) {
      case 'impressionism':
        objects.forEach((obj) => {
          obj.set({
            opacity: 0.8,
            stroke: '#ffffff',
            strokeWidth: 2,
          });
        });
        canvas.backgroundColor = '#e6f7ff';
        break;
      case 'cubism':
        objects.forEach((obj) => {
          if (obj.type !== 'group') {
            obj.set({
              skewX: Math.random() * 20 - 10,
              skewY: Math.random() * 20 - 10,
              stroke: '#000000',
              strokeWidth: 2,
            });
          }
        });
        canvas.backgroundColor = '#f0e68c';
        break;
      case 'popart':
        objects.forEach((obj) => {
          obj.set({
            fill: getRandomColor(),
            stroke: '#000000',
            strokeWidth: 3,
          });
        });
        canvas.backgroundColor = '#ffffff';
        break;
      case 'expressionism':
        objects.forEach((obj) => {
          obj.set({
            angle: Math.random() * 20 - 10,
            scaleX: obj.scaleX * (1 + Math.random() * 0.4 - 0.2),
            scaleY: obj.scaleY * (1 + Math.random() * 0.4 - 0.2),
            stroke: '#000000',
            strokeWidth: 4,
          });
        });
        canvas.backgroundColor = '#ffcccc';
        break;
    }

    canvas.renderAll();
    saveToHistory();
  };

  // Add a filter to canvas
  const applyFilter = (filterType) => {
    setSelectedFilter(filterType);
    const canvas = fabricCanvasRef.current;

    // Reset any existing filters
    canvas.getObjects().forEach((obj) => {
      obj.filters = [];
      if (obj.applyFilters) {
        obj.applyFilters();
      }
    });

    switch (filterType) {
      case 'vintage':
        canvas.backgroundColor = '#f5e8c0';
        canvas.getObjects().forEach((obj) => {
          obj.opacity = 0.9;
        });
        break;
      case 'blackAndWhite':
        canvas.backgroundColor = '#ffffff';
        // Apply grayscale to objects with image source
        canvas.getObjects().forEach((obj) => {
          if (obj.type === 'image' && obj.applyFilters) {
            obj.filters.push(new fabric.Image.filters.Grayscale());
            obj.applyFilters();
          } else {
            // For shapes, convert fill to grayscale
            if (
              obj.fill &&
              typeof obj.fill === 'string' &&
              obj.fill.indexOf('#') === 0
            ) {
              const rgb = hexToRgb(obj.fill);
              if (rgb) {
                const gray = Math.round(
                  0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b
                );
                obj.set('fill', `rgb(${gray},${gray},${gray})`);
              }
            }
          }
        });
        break;
      case 'sepia':
        canvas.backgroundColor = '#f0e6d8';
        // Apply sepia to objects with image source
        canvas.getObjects().forEach((obj) => {
          if (obj.type === 'image' && obj.applyFilters) {
            obj.filters.push(new fabric.Image.filters.Sepia());
            obj.applyFilters();
          } else {
            // For shapes, convert fill to sepia-like colors
            if (
              obj.fill &&
              typeof obj.fill === 'string' &&
              obj.fill.indexOf('#') === 0
            ) {
              const rgb = hexToRgb(obj.fill);
              if (rgb) {
                const r = Math.min(
                  255,
                  Math.round(rgb.r * 0.393 + rgb.g * 0.769 + rgb.b * 0.189)
                );
                const g = Math.min(
                  255,
                  Math.round(rgb.r * 0.349 + rgb.g * 0.686 + rgb.b * 0.168)
                );
                const b = Math.min(
                  255,
                  Math.round(rgb.r * 0.272 + rgb.g * 0.534 + rgb.b * 0.131)
                );
                obj.set('fill', `rgb(${r},${g},${b})`);
              }
            }
          }
        });
        break;
      case 'vibrant':
        canvas.backgroundColor = '#f0f8ff';
        canvas.getObjects().forEach((obj) => {
          if (
            obj.fill &&
            typeof obj.fill === 'string' &&
            obj.fill.indexOf('#') === 0
          ) {
            const rgb = hexToRgb(obj.fill);
            if (rgb) {
              const r = Math.min(255, Math.round(rgb.r * 1.2));
              const g = Math.min(255, Math.round(rgb.g * 1.2));
              const b = Math.min(255, Math.round(rgb.b * 1.2));
              obj.set('fill', `rgb(${r},${g},${b})`);
            }
          }
        });
        break;
      default:
        canvas.backgroundColor = '#f5f5f5';
        break;
    }

    canvas.renderAll();
    saveToHistory();
  };

  // Convert hex to rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Save artwork
  const saveArtwork = () => {
    const canvasData = JSON.stringify(fabricCanvasRef.current.toJSON());
    const thumbnail = fabricCanvasRef.current.toDataURL({
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

    setArtworks([...artworks, newArtwork]);
    setShowArtworkInfo(false);
  };

  // Load artwork
  const loadArtwork = (artwork) => {
    fabricCanvasRef.current.loadFromJSON(JSON.parse(artwork.canvasData), () => {
      fabricCanvasRef.current.renderAll();
      setCurrentArtworkName(artwork.name);
      setSelectedFilter(artwork.filter);
      setShowGallery(false);

      // Reset history with the loaded artwork as the initial state
      const initialState = artwork.canvasData;
      setArtHistory([initialState]);
      setHistoryIndex(0);
    });
  };

  const downloadArtwork = (artwork) => {
    const link = document.createElement('a');
    link.download = `${artwork.name}.png`;
    link.href = artwork.thumbnail;
    link.click();
  };

  // Clear canvas
  const clearCanvas = () => {
    if (
      window.confirm(
        'Are you sure you want to clear the canvas? This cannot be undone.'
      )
    ) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#f5f5f5';
      fabricCanvasRef.current.renderAll();
      setCurrentArtworkName('Untitled Masterpiece');
      setSelectedFilter(null);

      // Reset history with empty canvas
      const initialState = JSON.stringify(fabricCanvasRef.current.toJSON());
      setArtHistory([initialState]);
      setHistoryIndex(0);
    }
  };

  // Delete selected object
  const deleteSelectedObject = () => {
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.renderAll();
      saveToHistory();
    }
  };

  // Clone selected object
  const cloneSelectedObject = () => {
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      activeObject.clone((cloned) => {
        cloned.set({
          left: activeObject.left + 20,
          top: activeObject.top + 20,
        });
        fabricCanvasRef.current.add(cloned);
        fabricCanvasRef.current.setActiveObject(cloned);
        fabricCanvasRef.current.renderAll();
      });
    }
  };

  // Bring selected object to front
  const bringToFront = () => {
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.bringToFront(activeObject);
      fabricCanvasRef.current.renderAll();
    }
  };

  // Send selected object to back
  const sendToBack = () => {
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.sendToBack(activeObject);
      fabricCanvasRef.current.renderAll();
    }
  };

  return (
    <AppContainer>
      <Header>
        <h1>Virtual Museum Art Creator</h1>
        <HeaderActions>
          <button onClick={() => setShowGallery(true)}>Gallery</button>
          <button onClick={() => setShowArtworkInfo(true)}>Save Artwork</button>
        </HeaderActions>
      </Header>

      <MainContent>
        <Toolbar>
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

          <ToolOptions>
            {activeTab === 'shapes' && (
              <>
                <OptionButton onClick={() => addShape('circle')}>
                  Circle
                </OptionButton>
                <OptionButton onClick={() => addShape('rectangle')}>
                  Rectangle
                </OptionButton>
                <OptionButton onClick={() => addShape('triangle')}>
                  Triangle
                </OptionButton>
                <OptionButton onClick={() => addShape('polygon')}>
                  Polygon
                </OptionButton>
                <OptionButton onClick={() => addShape('star')}>
                  Star
                </OptionButton>
              </>
            )}

            {activeTab === 'patterns' && (
              <>
                <OptionButton onClick={() => addPattern('dots')}>
                  Dots
                </OptionButton>
                <OptionButton onClick={() => addPattern('grid')}>
                  Grid
                </OptionButton>
                <OptionButton onClick={() => addPattern('triangles')}>
                  Triangles
                </OptionButton>
                <OptionButton onClick={() => addPattern('stars')}>
                  Stars
                </OptionButton>
              </>
            )}

            {activeTab === 'artStyles' && (
              <>
                <OptionButton onClick={() => applyArtStyle('impressionism')}>
                  Impressionism
                </OptionButton>
                <OptionButton onClick={() => applyArtStyle('cubism')}>
                  Cubism
                </OptionButton>
                <OptionButton onClick={() => applyArtStyle('popart')}>
                  Pop Art
                </OptionButton>
                <OptionButton onClick={() => applyArtStyle('expressionism')}>
                  Expressionism
                </OptionButton>
              </>
            )}

            {activeTab === 'filters' && (
              <>
                <OptionButton
                  active={selectedFilter === 'none'}
                  onClick={() => applyFilter('none')}>
                  None
                </OptionButton>
                <OptionButton
                  active={selectedFilter === 'vintage'}
                  onClick={() => applyFilter('vintage')}>
                  Vintage
                </OptionButton>
                <OptionButton
                  active={selectedFilter === 'blackAndWhite'}
                  onClick={() => applyFilter('blackAndWhite')}>
                  Black & White
                </OptionButton>
                <OptionButton
                  active={selectedFilter === 'sepia'}
                  onClick={() => applyFilter('sepia')}>
                  Sepia
                </OptionButton>
                <OptionButton
                  active={selectedFilter === 'vibrant'}
                  onClick={() => applyFilter('vibrant')}>
                  Vibrant
                </OptionButton>
              </>
            )}
          </ToolOptions>

          <ObjectActions>
            <button onClick={handleUndo}>Undo</button>
            <button onClick={handleRedo}>Redo</button>
            <button onClick={deleteSelectedObject}>Delete</button>
            <button onClick={cloneSelectedObject}>Clone</button>
            <button onClick={bringToFront}>Bring to Front</button>
            <button onClick={sendToBack}>Send to Back</button>
            <button onClick={clearCanvas}>Clear Canvas</button>
          </ObjectActions>
        </Toolbar>

        <CanvasContainer>
          <canvas ref={canvasRef} />
        </CanvasContainer>
      </MainContent>

      {showGallery && (
        <Modal>
          <ModalContent>
            <h2>Your Art Gallery</h2>
            {artworks.length === 0 ? (
              <p>No artworks saved yet. Create your masterpiece and save it!</p>
            ) : (
              <GalleryGrid>
                {artworks.map((artwork) => (
                  <GalleryItem key={artwork.id}>
                    <img src={artwork.thumbnail} alt={artwork.name} />
                    <h3>{artwork.name}</h3>
                    <p>Created: {artwork.date}</p>

                    <footer>
                      <button onClick={() => loadArtwork(artwork)}>Load</button>
                      <button onClick={() => downloadArtwork(artwork)}>
                        Download
                      </button>
                    </footer>
                  </GalleryItem>
                ))}
              </GalleryGrid>
            )}
            <ButtonGroup>
              <button onClick={() => setShowGallery(false)}>
                Close Gallery
              </button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {showArtworkInfo && (
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
              <button onClick={() => setShowArtworkInfo(false)}>Cancel</button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

      <AppInfo>
        <p>
          Welcome to the Virtual Museum Art Creator! Create your own
          museum-worthy digital art using shapes, patterns, and apply different
          art styles.
        </p>
      </AppInfo>
    </AppContainer>
  );
}

export default App;
