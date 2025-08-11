import React, { useEffect, useState } from "react";
import noimg from '../images/noimg.png'
import '../styles/input.css'

const Blog = () => {
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('')
  const [bad, setBad] = useState(false)

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/news/search/?q=${query}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
      setBlogs(json.articles)
      if(json.articles.length === 0)
      {
        setBad(true);
      }
      else setBad(false)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (!blogs) {
          const response = await fetch('/api/news/general/');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Fetched blogs:', data);
          setBlogs(data.articles);
          if(data.articles.length === 0)
          {
            setBad(true)
          }
          else setBad(false)
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const truncateContent = (content) => {
    const truncatedContent = content.replace(/\.{3}.*$/, '...');
    return truncatedContent;
  };

  const renderBlogPosts = () => {
    return (
      <div>
        <form onSubmit={handlesubmit} action="" >
          <div class="input-container pl-6 mb-6">
            <input  onChange={e => setQuery(e.target.value)} type="text" name="text" class="input" placeholder="search..." />
            <span class="icon">
              <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="1" d="M14 5H20" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="1" d="M14 8H17" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="1" d="M22 22L20 20" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </span>
          </div>
        </form>
       
        { bad? ( <div className="w-full h-full flex justify-center items-center"> No Blogs / News found</div>):(<div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            blogs.map((blog) =>
              blog.description && blog.urlToImage ? (
                <div key={blog.id} className="bg-white p-6 rounded-lg shadow-md blog-post">
                  <div className="flex justify-center items-center">
                    {blog.urlToImage ? (
                      <img className="w-full max-h-[300px] h-auto object-cover" src={blog.urlToImage} alt="" />
                    ) : (
                      <img src={noimg} alt="" />
                    )}
                  </div>
                  <h2 className="mt-6 text-2xl font-sans font-bold mb-4">{blog.title}</h2>
                  <p>{blog.author ? <>By: {blog.author}</> : null}</p>
                  <p className="mt-2 text-gray-700 mb-4">
                    {blog.content ? truncateContent(blog.content.slice(0, 90)) : blog.description.slice(0, 90)}
                  </p>
                  <a target="_blank" href={blog.url} rel="noreferrer" className="text-green-600">Read more...</a>
                </div>
              ) : null
            )
          )}
        </div>)}
        
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen overflow-auto">
      <div className="container mx-auto mt-8 grid gap-8">
        {renderBlogPosts()}
      </div>
    </div>
  );
};

export default Blog;
