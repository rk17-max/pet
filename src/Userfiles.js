import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

import Footer from './Footer';
import Loadingfiles from './Loadingfiles'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Add CSS styles
const styles = `
  .files-containers {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .page-title {
    color: #2c3e50;
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 2rem;
    animation: slideDown 0.6s ease-out;
  }

  .files-lists {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    list-style: none;
    padding: 0;
  }

  .file-cards {
    background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: fadeIn 0.5s ease-out;
  }

  .file-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }

  .file-names {
    color: #34495e;
    font-size: 1.25rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
  }

  .show-graph-btn {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .show-graph-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
  }

  .graph-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: scaleIn 0.3s ease-out;
    z-index: 1000;
  }

  .graph-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.3s ease-out;
    z-index: 999;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #e74c3c;
    color: white;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .close-btn:hover {
    background: #c0392b;
  }

  .no-files {
    text-align: center;
    color: #7f8c8d;
    font-size: 1.2rem;
    margin-top: 2rem;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideDown {
    from { 
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const UserFiles = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    axios.defaults.withCredentials = true;
    useEffect(() => {
        // Inject styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const fetchUserFiles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/files');
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching user files:', error);
            } finally {
              setTimeout(() => {
                setLoading(false);
                setLoadingComplete(true);
              }, 2000);
            }
        };

        fetchUserFiles();

        // Cleanup styles
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    const prepareChartData = (ratings) => {
        const ratingCount = {
            "Very Poor": 0,
            "Poor": 0,
            "Fair": 0,
            "Good": 0,
            "Excellent": 0,
        };

        if (ratings.length === 0) {
            return { labels: Object.keys(ratingCount), data: Object.values(ratingCount) };
        }

        const totalRating = ratings.reduce((sum, { rating }) => sum + rating, 0);
        const averageRating = totalRating / ratings.length;

        let sentiment;
        if (averageRating >= 4.5) sentiment = "Excellent";
        else if (averageRating >= 4.0) sentiment = "Good";
        else if (averageRating >= 3.0) sentiment = "Fair";
        else if (averageRating >= 2.0) sentiment = "Poor";
        else sentiment = "Very Poor";

        ratingCount[sentiment]++;
        return { labels: Object.keys(ratingCount), data: Object.values(ratingCount) };
    };

    if (loading && !loadingComplete) {
      return <Loadingfiles />;
    }
  
    return (
      <>
        <div>
            <Navbar />
            <div className="files-containers">
                <h1 className="page-title">Your Uploaded Files</h1>
                {files.length === 0 ? (
                    <p className="no-files">You have not uploaded any files yet.</p>
                ) : (
                    <ul className="files-lists">
                        {files.map((file) => (
                            <li key={file._id} className="file-cards">
                                <h3 className="file-names">{file.name}</h3>
                                <button 
                                    className="show-graph-btn"
                                    onClick={() => setSelectedFile(file)}
                                >
                                    Show Sentiment Graph
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {selectedFile && (
                    <>
                        <div className="graph-backdrop" onClick={() => setSelectedFile(null)} />
                        <div className="graph-container">
                            <h2>{selectedFile.name} - Sentiment Analysis</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setSelectedFile(null)}
                            >
                                ×
                            </button>
                            <div style={{ width: '500px', height: '400px' }}>
                                <Bar
                                    data={{
                                        labels: prepareChartData(selectedFile.ratings).labels,
                                        datasets: [{
                                            label: 'Sentiment Distribution',
                                            data: prepareChartData(selectedFile.ratings).data,
                                            backgroundColor: [
                                                '#FF6B6B',  // Very Poor
                                                '#FFA06B',  // Poor
                                                '#FFD93D',  // Fair
                                                '#6BCB77',  // Good
                                                '#4D96FF'   // Excellent
                                            ],
                                        }],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Sentiment Distribution'
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    stepSize: 1
                                                }
                                            }
                                        },
                                        animation: {
                                            duration: 1000,
                                            easing: 'easeInOutQuart'
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        
        <Footer/>
        </>
    );
};

export default UserFiles;