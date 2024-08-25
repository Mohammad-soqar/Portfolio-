import { useState, useEffect } from "react"
import { createPost, getUsers } from "../api"

export function CreateBlog() {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [content, setContent] = useState("")
    const [author, setAuthor] = useState("")
    const [users, setUsers] = useState([])


    useEffect(() => {
        async function fetchUsers() {
            const response = await getUsers()
            setUsers(response.data)
        }
        fetchUsers()
    }, [])

    async function handleSubmit() {
        let submitObject = {
            title: title,
            description: description,
            content: content,
            author: author,
            dateCreated: new Date()
        }
        alert(author)
        await createPost(submitObject)
    }


    return (
        <form onSubmit={handleSubmit}>
            <label>Blog Title:</label>
            <input
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
                name="title"
                type="text"
            />
            <label>Blog Description:</label>
            <input
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                required
                name="description"
                type="text"
            />
            <label>Blog Content:</label>
            <textarea
                onChange={(e) => setContent(e.target.value)}
                maxLength={5000}
                required
                name="content"
                type="text"
            />
            <label>Select Author:</label>
            <select onChange={(e) => setAuthor(e.target.value)} required>
                <option value="">Select an Author</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>
                        {user.name}
                    </option>
                ))}
            </select>
            <button type="submit">Submit</button>
        </form>
    )
}