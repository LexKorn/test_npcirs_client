import React, {useState} from 'react';
import {Modal, Form, Button, Dropdown} from 'react-bootstrap';

import { createBook, updateBook } from 'http/API';

const ModalAddUpdateBook = ({show, onHide, operation, authors, books}) => {
    const [title, setTitle] = useState('');
    const [published, setPublished] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState({});
    const [selectedBook, setSelectedBook] = useState({});

    let toggle = false;
    if (operation === 'Добавить') {
        toggle = true;
    }

    const onClick = () => {
        if (!selectedAuthor.id || !title.trim()) {
            return alert('Все поля обязательны для заполнения');
        }

        if (published < 1000 || published > 2023) {
            return alert('Год публикации должен быть от 1600 до 2023');
        }

        if (toggle) {
            createBook(title, published, selectedAuthor.id)
                .then(() => {
                    setSelectedAuthor({});
                    setTitle('');
                    setPublished(null);
                    onHide();
                })
                .catch(err => alert(err.response.data.message));
        } else {
            if (!selectedBook.id) {
                return alert('Id необходимо указать');
            }

            updateBook(title, published, selectedAuthor.id, selectedBook.id)
                .then(() => {
                    setSelectedAuthor({});
                    setSelectedBook({});
                    setTitle('');
                    setPublished(null);
                    onHide();
                })
                .catch(err => alert(err.response.data.message));
        }
    };
    

    
    return (
        <Modal
            show={show}
            onHide={onHide}
            >
            <Modal.Body>
            <h3 style={{textAlign: 'center'}}>{toggle ? 'Добавить' : 'Изменить'} книгу</h3>
            <Form>
                {!toggle && <Dropdown className="mt-3 mb-3">
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
                </Dropdown>}
                <Dropdown className="mt-3 mb-3">
                    <Dropdown.Toggle className="btn-round btn-fill" variant="dark">{selectedAuthor.name || 'Выберите автора'}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {authors.map(author => 
                            <Dropdown.Item 
                                onClick={() => setSelectedAuthor(author)} 
                                key={author.id} >
                                    {author.name}
                            </Dropdown.Item>                                
                        )}
                    </Dropdown.Menu>
                </Dropdown>  
                <Form.Control
                    className="mt-3"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Введите название"
                />
                <Form.Control
                    type="number"
                    className="mt-3"
                    value={published}
                    onChange={e => setPublished(e.target.value)}
                    placeholder="Введите год публикации"
                />
            </Form>
            <Button className="btn-round btn-fill mt-3" variant={toggle ? "success" : "primary"} onClick={onClick}>{toggle ? 'Добавить' : 'Изменить'}</Button>
            </Modal.Body>
        </Modal>
    );
};

export default ModalAddUpdateBook;