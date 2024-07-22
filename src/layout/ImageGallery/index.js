import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTable } from 'react-table';
import ReactPaginate from 'react-paginate';
import './ImageGallery.scss'; // Tạo một file CSS riêng để tùy chỉnh giao diện

import { IoMdCloseCircleOutline } from "react-icons/io";

function ImageGallery() {
    const [images, setImages] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [editingId, setEditingId] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const [showModalName, setShowModalName] = useState(false); // State để kiểm soát hiển thị modal
    const [showModalAddTags, setShowModalAddTags] = useState(false); // State để kiểm soát hiển thị modal
    const modalRef = useRef(null); // Ref cho modal
    const modalContentRef = useRef(null);
    const [pictureClicked, setPictureClicked] = useState([]);

    const handleClickOutside = (event) => {
        // Kiểm tra xem click có xảy ra bên ngoài modal không
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModalName(false); // Nếu click bên ngoài modal, đóng modal
            setShowModalAddTags(false); // Nếu click bên ngoài modal, đóng modal
        }
    };
    const handleEditNameClick = (value) => {
        setShowModalName(true); // Khi nhấn vào nút "Sửa", hiển thị modal
        setPictureClicked(value);
    }
    const handleAddTagsClick = (value) => {
        setShowModalAddTags(true); // Khi nhấn vào nút "Sửa", hiển thị modal
        setShowModalName(false); // Khi nhấn vào nút "Sửa", hiển thị modal
    }

    useEffect(() => {
        fetch('https://farm-server-ten.vercel.app/api/images')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const transformedData = data.map((item, index) => ({
                    ...item,
                    index: index + 1,
                    imageFilename: item.filename, // Thêm thuộc tính imageFilename từ filename
                }));
                setImages(transformedData);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const currentItems = useMemo(() => {
        const offset = currentPage * itemsPerPage;
        return images.slice(offset, offset + itemsPerPage);
    }, [currentPage, itemsPerPage, images]);

    const HandleAddTag = (e) => {
        e.preventDefault();
        const tagName = e.target[0].value;
        console.log(tagName);

        fetch('https://farm-server-ten.vercel.app/api/add-tag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tagName }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Tag added:', data);
            // Cập nhật UI hoặc thực hiện hành động sau khi thêm thẻ thành công
            setShowModalAddTags(false);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

        setShowModalAddTags(false); // Khi nhấn vào nút "Sửa", hiển thị modal
    }

    const columns = useMemo(
        () => [
            {
                Header: 'STT',
                accessor: 'index',
            },
            {
                Header: 'Ảnh',
                accessor: 'imageFilename',
                Cell: ({ cell: { value } }) => (
                    <div className='imageCell' onClick={() => handleEditNameClick(value)}>
                        <img src={`/image/01. Tieng Viet 1/${value}`} alt={value} style={{ width: '250px' }} />
                    </div>
                )
            },
            {
                Header: 'Tên',
                accessor: 'filename',
                Cell: ({ cell: { value } }) => <span>{value}</span>,
            },
            {
                Header: 'Sách',
                accessor: 'category.Sách',
                Cell: ({ cell: { value } }) => <span>{value}</span>,
            },
            {
                Header: 'Lớp',
                accessor: 'category.Lớp',
                Cell: ({ cell: { value } }) => <span>{value}</span>,
            },
            {
                Header: 'Bài',
                accessor: 'category.Bài',
                Cell: ({ cell: { value } }) => <span>{value}</span>,
            },
            {
                Header: 'Trang',
                accessor: 'category.Trang',
                Cell: ({ cell: { value } }) => <span>{value}</span>,
            },
            {
                Header: 'Ảnh số',
                accessor: 'category.Ảnh số',
                Cell: ({ cell: { value } }) => <span>{value}</span>,
            },
            {
                Header: 'Tập',
                accessor: 'category.Tập',
                Cell: ({ cell: { value } }) => <span>{value}</span>,
            },
            {
                Header: 'Thẻ',
                accessor: 'category.Thẻ',
                Cell: ({ cell: { value } }) => <span>{value}</span>,
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: currentItems });

    return (
        <div>
            <h1>Image Gallery</h1>

            <div className='search'>
                <form>
                    <input placeholder='Tìm kiếm theo từ khóa'/>
                    <button>Tìm kiếm</button>
                </form>
            </div>

            <table {...getTableProps()} className="table-fixed-header">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <ReactPaginate
                previousLabel={'←'}
                nextLabel={'→'}
                pageCount={Math.ceil(images.length / itemsPerPage)}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />

            {showModalName && (
                <div className='backModal' onClick={() => setShowModalName(false)}></div>
            )}
            {showModalName && (
                <div className="modal" ref={modalRef}>
                    <div className='modal--buttonClose' onClick={() => setShowModalName(false)}><IoMdCloseCircleOutline /></div>
                    <div className="modal--content" ref={modalContentRef}>
                        <img src={`/image/01. Tieng Viet 1/${pictureClicked}`} alt={pictureClicked} style={{ width: '500px' }} />
                    </div>
                    <div onClick={handleAddTagsClick} className='modal--tags'>
                        <div className='modal--tags--addTags'>Tạo thêm thẻ mới</div>
                    </div>
                </div>
            )}

            {showModalAddTags && (
                <div className='backModal' onClick={() => setShowModalAddTags(false)}></div>
            )}
            {showModalAddTags && (
                <div className="modal" ref={modalRef}>
                    <div className='modal--buttonClose' onClick={() => setShowModalAddTags(false)}><IoMdCloseCircleOutline /></div>
                    <div className="modal--content" ref={modalContentRef}>
                        <form onSubmit={HandleAddTag}>
                            <input placeholder='Nhập thẻ mới'/>
                            <button>Thêm</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageGallery;
