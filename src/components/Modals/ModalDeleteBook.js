import React, {useState} from 'react';
import {Modal, Form, Button, Dropdown} from 'react-bootstrap';

import { deleteBook } from 'http/API';

const ModalDeleteBook = ({show, onHide, books}) => {
    const [selectedBook, setSelectedBook] = useState({});

    const onDelete = () => {
        if (selectedBook.id) {
            deleteBook(selectedBook.id)
                .then(() => onHide())
                .catch(err => alert(err.response.data.message));
        } else {
            alert('Необходимо выбрать Id');
        }
    };
    
    return (
        <Modal
            show={show}
            onHide={onHide}
            >
            <Modal.Body>
            <h3 style={{textAlign: 'center'}}>Удалить книгу</h3>
            <Form>
                <Dropdown className="mt-3 mb-3">
                    <Dropdown.Toggle className="btn-round btn-fill" variant="dark">
                        {selectedBook.id || 'Выберите Id'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {books.map(book => 
                            <Dropdown.Item 
                                onClick={() => setSelectedBook(book)} 
                                key={book.id} >
                                    {book.id}
                            </Dropdown.Item>                                
                        )}
                    </Dropdown.Menu>
                </Dropdown>  
            </Form>
            <Button className="btn-round btn-fill" variant={"danger"} onClick={onDelete}>Удалить</Button>
            </Modal.Body>
        </Modal>
    );
};

export default ModalDeleteBook;