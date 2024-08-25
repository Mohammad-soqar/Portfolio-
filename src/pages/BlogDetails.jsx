import { getPost } from "../api"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function BlogDetails() {

    const [posts, setPosts] = useState([])

    let params = useParams()
    const navigate = useNavigate()
    let id = params.id

    useEffect(() => {
        async function loadPost() {
            const data = await getPost(id)
            setPosts(data)
        }

        loadPost()
    }, [])


    return (
        <>
        <button onClick={() => navigate(-1)}>Back</button>
            <h1>{posts.title}</h1>
            <h2>{posts.description}</h2>
            <h3>{posts.dateCreated}1</h3>
            <p>{posts.content}</p>
        </>
    )
}