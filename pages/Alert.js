
import React from 'react';
import PropTypes from 'prop-types';


const Alert = ({ message, type, onClose }) => {
  if (!message) return null; // Não renderiza se não houver mensagem

  return (
    <div className='position-absolute alert-position'>
      <div className={`alert alert-${type} alert-dismissible fade show `} role="alert">
        {message}
        <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar"></button>
      </div>
    </div>

  );
};

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default Alert;
