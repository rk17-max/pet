import React, { useState, useEffect, useRef } from 'react';
import { getAllFilesFromDB, deleteFileFromDB } from './db';
import gsap from 'gsap';
import './offline.css';

const OfflineFilesList = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const containerRef = useRef(null);
    const filesGridRef = useRef(null);
    const modalRef = useRef(null);
    const modalContentRef = useRef(null);
    const fileCardsRef = useRef([]);

    // Initialize file cards ref array
    const updateFileCardsRef = (element, index) => {
        if (element && !fileCardsRef.current.includes(element)) {
            fileCardsRef.current[index] = element;
        }
    };

    useEffect(() => {
        const fetchFiles = async () => {
            const offlineFiles = await getAllFilesFromDB();
            setFiles(offlineFiles);
        };

        fetchFiles();
    }, []);

    useEffect(() => {
        if (filesGridRef.current && files.length > 0) {
            // Reset the animation timeline
            const tl = gsap.timeline();

            // Animate files grid
            tl.to(filesGridRef.current, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            });

            // Animate each file card
            fileCardsRef.current.forEach((card, index) => {
                if (card) {
                    tl.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    }, `-=${index ? 0.2 : 0}`);
                }
            });
        }
    }, [files]);

    const deleteFile = async (fileId) => {
        const cardElement = fileCardsRef.current.find(
            card => card?.dataset.id === fileId.toString()
        );
        
        if (cardElement) {
            await gsap.to(cardElement, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: 'power2.in'
            });

            await deleteFileFromDB(fileId);
            setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
        }
    };

    const openPreview = (file) => {
        setSelectedFile(file);
        setIsModalOpen(true);
        
        if (modalRef.current && modalContentRef.current) {
            gsap.set(modalRef.current, { 
                display: 'flex',
                opacity: 0 
            });
            gsap.set(modalContentRef.current, { 
                y: 50,
                opacity: 0 
            });

            const tl = gsap.timeline();
            
            tl.to(modalRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            })
            .to(modalContentRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out'
            }, "-=0.1");
        }
    };

    const closePreview = async () => {
        if (modalRef.current && modalContentRef.current) {
            const tl = gsap.timeline();
            
            await tl.to(modalContentRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in'
            })
            .to(modalRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in'
            });
            
            gsap.set(modalRef.current, { display: 'none' });
            setSelectedFile(null);
            setIsModalOpen(false);
        }
    };

    return (
        <div className="offline-container" ref={containerRef}>
            <h2>Offline Files</h2>
            <div className="fileso-grid" ref={filesGridRef}>
                {files.map((file, index) => (
                    <div 
                        key={file.id} 
                        className="fileo-card"
                        data-id={file.id}
                        ref={(el) => updateFileCardsRef(el, index)}
                        style={{ opacity: 0, transform: 'translateY(20px)' }}
                    >
                        <h3>{file.name}</h3>
                        <p>{file.description}</p>
                        <div className="button-group">
                            <button 
                                className="btn preview-btn"
                                onClick={() => openPreview(file)}
                            >
                                Preview PDF
                            </button>
                            <button 
                                className="btn delete-btn"
                                onClick={() => deleteFile(file.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div 
                    className="modal" 
                    ref={modalRef}
                    style={{ display: 'none' }}
                >
                    <div 
                        className="modal-content" 
                        ref={modalContentRef}
                    >
                        <span className="close" onClick={closePreview}>&times;</span>
                        <div className="modal-header">
                            <h2>{selectedFile?.name}</h2>
                            <p>{selectedFile?.description}</p>
                        </div>
                        <div className="pdf-container">
                            <iframe
                                src={selectedFile ? `http://localhost:5000/${selectedFile.url}` : ''}
                                title="PDF Preview"
                                width="100%"
                                height="500px"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfflineFilesList;