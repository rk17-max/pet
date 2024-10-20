import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Import the Modal component

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null); // New state for thumbnail
    const [category, setCategory] = useState(''); 
    const [description, setDescription] = useState('');
    const [name, setName] = useState(''); // New state for name
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleThumbnailChange = (e) => {
        setThumbnail(e.target.files[0]); // Update thumbnail state
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value); 
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value); 
    };

    const handleNameChange = (e) => {
        setName(e.target.value); // Update name state
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('pdf', file); 
        formData.append('thumbnail', thumbnail); // Add thumbnail to form data
        formData.append('category', category); 
        formData.append('description', description); // Add description to form data
        formData.append('name', name); // Add name to form data

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Upload response:', response.data); 
            alert('File uploaded successfully: ' + JSON.stringify(response.data));
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file: ' + error.message);
        }

        // Close modal after submission
        setIsModalOpen(false);
    };

    return (
        <div>
            <button onClick={() => setIsModalOpen(true)}>Upload PDF</button> {/* Open the modal */}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="file">Upload PDF:</label>
                        <input type="file" id="file" accept="application/pdf" onChange={handleFileChange} required />
                    </div>
                    <div>
                        <label htmlFor="thumbnail">Upload Thumbnail:</label>
                        <input type="file" id="thumbnail" accept="image/*" onChange={handleThumbnailChange} required /> {/* Thumbnail input */}
                    </div>
                    <div>
                        <label htmlFor="name">Name:</label> {/* New Name input */}
                        <input 
                            type="text" 
                            id="name" 
                            value={name} 
                            onChange={handleNameChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="category">Category:</label>
                        <input 
                            type="text" 
                            id="category" 
                            value={category} 
                            onChange={handleCategoryChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea 
                            id="description" 
                            value={description} 
                            onChange={handleDescriptionChange} 
                            required 
                            placeholder='Enter appropriate description'
                        />
                    </div>
                    <button type="submit">Upload</button>
                </form>
            </Modal>
        </div>
    );
};

export default UploadForm;
