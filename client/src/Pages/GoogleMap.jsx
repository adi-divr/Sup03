import React from 'react';

const GoogleMap = () => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250.8209621482407!2d76.31665325149353!3d9.888381346004216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b08722aa8eb0245%3A0xa76954cc3b5f3f31!2sRamada%20by%20Wyndham%20Kochi!5e0!3m2!1sen!2sin!4v1735196307067!5m2!1sen!2sin"
      width="317"
      height="183"
      style={{ border: 0, borderRadius: '12px', marginTop: '10px' }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Google Map"
    ></iframe>
    
  );
};

export default GoogleMap;
