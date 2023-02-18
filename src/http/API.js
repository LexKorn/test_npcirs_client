import axios from 'axios';

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

export const fetchAuthors = async () => {
    const {data} = await $host.get('api/authors');
    return data;
};

export const createBook = async (title, published, authorId) => {
    const {data} = await $host.post('api/books', {title, published, authorId});    
    return data;
};

export const fetchBooks = async () => {
    const {data} = await $host.get('api/books');
    return data;
};

export const deleteBook = async (id) => {
    const {data} = await $host.delete('api/books/' + id);
    return data;
};

export const updateBook = async (title, published, authorId, id) => {
    const {data} = await $host.put('api/books/' + id, {title, published, authorId});
    return data;
};