import './cell.css';

const Cell = ({ status, onClick }) => {
  const getColor = () => {
    if (status === 1) {
      return 'red';
    } else if (status === 2) {
      return 'yellow';
    } else {
      return 'white';
    }
  };

  return <div className="tile" style={{ backgroundColor: getColor() }} onClick={onClick}></div>;
};

export default Cell;

