import styled from 'styled-components';

// Container Components
export const AppContainer = styled.div`
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CanvasWrapper = styled.div`
  border: 1px solid #ccc;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
`;

// Header Components
export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
`;

export const HeaderActions = styled.div`
  button {
    margin-left: 10px;
    padding: 8px 16px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #3a7bc8;
    }
  }
`;

// Toolbar Components
export const ToolbarContainer = styled.div`
  margin-bottom: 20px;
`;

export const ToolTabs = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

export const TabButton = styled.button`
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

export const ToolOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
`;

export const OptionButton = styled.button`
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

export const ObjectActions = styled.div`
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

// Modal Components
export const Modal = styled.div`
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

export const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  color: black;
`;

// Gallery Components
export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export const GalleryItemContainer = styled.div`
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
      padding: 6px 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #f0f0f0;
      cursor: pointer;
      color: black;

      &:hover {
        background-color: #e0e0e0;
      }
    }
  }
`;

// Form Components
export const FormGroup = styled.div`
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

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;

    &:first-child {
      background-color: #4a90e2;
      color: white;

      &:hover {
        background-color: #3a7bc8;
      }
    }

    &:last-child {
      background-color: #f0f0f0;
      color: black;

      &:hover {
        background-color: #e0e0e0;
      }
    }
  }
`;

// Info Components
export const AppInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 4px solid #007bff;
  color: #333;
`;
