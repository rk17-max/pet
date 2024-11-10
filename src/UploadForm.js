import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Import the Modal component

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading indicator

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleThumbnailChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('thumbnail', thumbnail);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('name', name);

        setLoading(true); // Set loading state to true

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload response:', response.data);
            alert('File uploaded successfully: ' + JSON.stringify(response.data));

            // Reset form fields after successful upload
            setFile(null);
            setThumbnail(null);
            setCategory('');
            setDescription('');
            setName('');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false); // Reset loading state
            setIsModalOpen(false); // Close modal after submission
        }
    };

    return (
        <div>
            <button onClick={() => setIsModalOpen(true)}>Upload PDF</button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="file">Upload PDF:</label>
                        <input
                            type="file"
                            id="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="thumbnail">Upload Thumbnail:</label>
                        <input
                            type="file"
                            id="thumbnail"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="name">Name:</label>
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
                    <button type="submit" disabled={loading}> {/* Disable button during loading */}
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default UploadForm;
