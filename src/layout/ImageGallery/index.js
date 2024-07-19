import React, { useState, useEffect } from 'react';

function ImageGallery() {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        // Load dữ liệu từ file JSON
        fetch('/categorized_images.json')
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setImages(data);
            setFilteredImages(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, []);

    return (
        <div>
        <h1>Image Gallery</h1>
        
        <div className="image-grid">
            {filteredImages.map((image, index) => (
            <div key={index} className="image-item">
                <img src={`/image/01. Tieng Viet 1/${image.filename}`} alt={`Image ${index}`} />
                <p>{`id: ${image.filename}, Sách: ${image.category.Sách}, Lớp: ${image.category.Lớp}, Bài: ${image.category.Bài}, Trang: ${image.category.Trang}, Ảnh số: ${image.category["Ảnh số"]}, Tập: ${image.category.Tập}`}</p>
            </div>
            ))}
        </div>
        </div>
    );
}

export default ImageGallery;
