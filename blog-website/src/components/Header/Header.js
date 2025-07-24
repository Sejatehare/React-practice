const Header = (props) => {
    return (
        <>
            <h2>Hello Bloggers!!!!!</h2>
            <button onClick={props.onAddBlog}>Add new Blog</button>
        </>
    )
}

export default Header;