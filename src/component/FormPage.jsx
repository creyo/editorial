import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './FormPage.css'; // Import your CSS file
import StatusSelection from '../FormDataInformation/StatusSelection';
import CategoryDropdown from '../FormDataInformation/CategoryDropDown';
import AuthorDropdown from '../FormDataInformation/AuthorDropdown';
import supabase from '../config/supabase'; // Import the Supabase instance

function FormPage() {

  const { publicationId, postTypeId } = useParams();
  
  const [statusId, setStatusId] = useState(1);
  const [typedUrl, setTypedUrl] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [category_id, setCategory_id] = useState(0);
  const [category_url, setCategory_url] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [tag, setTag] = useState('');
  const [keywords, setKeywords] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [authorId, setAuthorId] = useState(0);
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [note, setNote] = useState('');



  //dropdown 
  const [publicationData, setPublicationData] = useState([]);
  const [postTypeData, setPostTypeData] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(publicationId);
  const [selectedPostType, setSelectedPostType] = useState(postTypeId);
 
  const[highestarticleid,setHighestArticleId]= useState(0)

  const [submit, setSubmit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);






  useEffect(() => {
    async function fetchData() {
      // Fetch data from the 'publication' table
      const { data: publicationData, error } = await supabase
        .from('publication')
        .select('*');

      if (publicationData) {
        setPublicationData(publicationData);
      } else {
        throw error
      }

      // Fetch data from the 'post_type' table
      const { data: postTypeData, error: postTypeError } = await supabase
        .from('post_type')
        .select('*');

      if (postTypeData) {
        setPostTypeData(postTypeData);
      } else {
        throw postTypeError
      }
    }

    fetchData();
  }, []);



  //find highest article_id
  useEffect(() => {
    async function fetchHighestArticleId() {
      // Fetch data from the 'articles' table to find the highest article_id
      const { data, error } = await supabase.from('articles').select('article_id').order('article_id', { ascending: false }).limit(1);

      if (error) {
        console.error(error);
      } else if (data.length > 0) {
        setHighestArticleId(data[0].article_id+1);
      }
    }

    fetchHighestArticleId();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newArticle = {
        status: statusId,
        publication_id: selectedPublication,
        post_type: selectedPostType,
        url: category_url + '/' + typedUrl,
        seo_score: seoScore,
        seo_title: seoTitle,
        seo_description: seoDescription,
        tag,
        keyword: keywords,
        featured_image: featuredImage,
        author_id: authorId,
        category_id: category_id,
        date,
        title,
        body,
      };
      console.log(isUpdating)
      if (!isUpdating) {
        // Update the article with the highest article_id
        const { data: updatedArticles, error } = await supabase
          .from('articles')
          .update(newArticle)
          .eq('article_id', highestarticleid);

        if (error) {
          console.warn(error);
          throw error;
        }

        console.log('Article updated:', updatedArticles);
      } else {
        // Create a new article
        const { data: articles, error } = await supabase.from('articles').upsert([newArticle]);

        if (error) {
          console.warn(error);
          throw error;
        }

        console.log('Article created:', articles);
      }
      setIsUpdating(true)
      setSubmit(true);
    } catch (error) {
      console.error('Error creating/updating article:', error);
    }
  };


   
  const handleStatusChange = (selectedStatusId) => {
    setStatusId(selectedStatusId);
    setSubmit(false)
  };

  const handlePublicationChange = (event) => {
    setSelectedPublication(event.target.value);
    setSubmit(false)
  };

  const handlePostTypeChange = (event) => {
    setSelectedPostType(event.target.value);
    setSubmit(false)
  };

  const handleCategoryChange = (selectedCategoryInfo) => {
    setCategory_id(selectedCategoryInfo.category_id);
    setCategory_url(selectedCategoryInfo.category_url);
    setSubmit(false)
  };

  const handleAuthorChange = (selectedAuthorId) => {
    setAuthorId(selectedAuthorId);
    setSubmit(false)
  };


  const handleTextChange = (content) => {
    setBody(content);
    setSubmit(false)

  };
  const handleUrl = (e) => {
    setTypedUrl(e.target.value)
    setSubmit(false)
  }

  const handleSeoScore = (e) => {
    setSeoScore(e.target.value)
    setSubmit(false)
  }

  const handleSeoTitle = (e) => {
    setSeoTitle(e.target.value)
    setSubmit(false)
  }

  const handleSeoDescription = (e) => {
    setSeoDescription(e.target.value)
    setSubmit(false)
  }

  const handleTag = (e) => {
    setTag(e.target.value)
    setSubmit(false)
  }

  const handleKeywords = (e) => {
    setKeywords(e.target.value)
    setSubmit(false)
  }

  const handleFeatureImage = (e) => {
    setFeaturedImage(e.target.value)
    setSubmit(false)
  }


  const handleDate = (e) => {
    setDate(e.target.value)
    setSubmit(false)
  }

  const handleTitle =(e)=>{
    setTitle(e.target.value)
    setSubmit(false)
  }

  const handleNote =(e)=>{
   setNote(e.target.value)
   setSubmit(false)
  }

   //function to reset after click on add page 
  const resetForm = () => {
    setStatusId(1);
    setTypedUrl('');
    setSeoScore(0);
    setCategory_id(0);
    setCategory_url('');
    setSeoTitle('');
    setSeoDescription('');
    setTag('');
    setKeywords('');
    setFeaturedImage('');
    setAuthorId(0);
    setDate('');
    setTitle('');
    setBody('');
    setNote('');
  };
  
  // Add Page button click handler
  const handleAddPage = () => {
    setIsUpdating((prevIsUpdating) => !prevIsUpdating);
    setHighestArticleId(highestarticleid+1)
    resetForm(); // Reset the form
    const syntheticEvent = { preventDefault: () => {} }; // Create a synthetic event
    handleSubmit(syntheticEvent);// Submit the data
  };
  


  const TextEditorModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const TextEditorFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
  ];



  return (
    <div className="container">
      <div className="selectors">
        <select
          name="publicationDropdown"
          id="publicationDropdown"
          onChange={handlePublicationChange}
          value={selectedPublication}
        >

          {publicationData.map((publication) => (
            <option
              key={publication.publication_id}
              value={publication.publication_id}
            >
              {publication.publication_name}
            </option>
          ))}
        </select>

        <select
          name="postTypeDropdown"
          id="postTypeDropdown"
          onChange={handlePostTypeChange}
          value={selectedPostType}
        >

          {postTypeData.map((postType) => (
            <option
              key={postType.post_type_id}
              value={postType.post_type_id}
            >
              {postType.type_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex" style={{ margin: '1rem 0' }}>
    {/* back button will on home page */}
    <button class="back-button" onClick={() => (window.location.href = "/")}>Back</button>
    <button class="add-page-button" onClick={handleAddPage}>Add Page</button>
        <img src="/images/plus.svg" alt="" />
      </div>
      <div className="form-card">
        <div className="flex gap-between">
          <div className="flex child-margin">
            <p>Status</p>
            <StatusSelection
              selectedStatusId={statusId}
              onStatusChange={handleStatusChange}
              required
            />
          </div>
        </div>

        <div className="flex">
          <p style={{ marginRight: '1rem' }}>Category</p>
          <CategoryDropdown onCategoryChange={handleCategoryChange} required />
        </div>
        <div className="flex">
          <p style={{ marginRight: '1rem' }}>URL</p>
          <div className="url-section">
            /{category_url}/
            <span>
              <input
                type="text"
                value={typedUrl}
                onChange={handleUrl}
                placeholder="Type your URL here"
              />
            </span>
          </div>
        </div>

        <div className="flex">
          <p style={{ marginRight: '5rem' }}>SEO Score</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Enter SEO Score"
              value={seoScore}
              onChange={handleSeoScore} // onChange for seoScore
              min="0"
              max="100"
            />
            <p>%</p>
          </div>
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Enter SEO Title"
            value={seoTitle}
            onChange={handleSeoTitle} // onChange for seoTitle
          />
        </div>

        <div className="flex">
          <textarea
            placeholder="Enter SEO Description"
            value={seoDescription}
            onChange={handleSeoDescription} // onChange for seoDescription
            rows="4"
            cols="10"
          />
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Tag"
            value={tag}
            onChange={handleTag} // onChange for tag
          />
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Keywords"
            value={keywords}
            onChange={handleKeywords} // onChange for keywords
          />
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Featured Image"
            value={featuredImage}
            onChange={handleFeatureImage} // onChange for featuredImage
          />
        </div>

        <div className="flex">
          <p style={{ marginRight: '5rem' }}>Author</p>
          <AuthorDropdown onAuthorChange={handleAuthorChange} required />
        </div>

        <div className="flex">
          <p style={{ marginRight: '5rem' }}>Date</p>
          <input
            type="datetime-local"
            placeholder="Date"
            value={date}
            onChange={handleDate} // onChange for date
          />
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitle} // onChange for title
            rows="20"
            cols=""
          />
        </div>

        <div style={{ width: '1050px' }}>
          <ReactQuill
            value={body}
            onChange={handleTextChange}
            placeholder="Enter your text here..."
            modules={TextEditorModules}
            formats={TextEditorFormats}
            style={{ height: '800px', marginBottom: '100px' }}
          />
        </div>

        <div className="flex">
          <textarea
            placeholder="Note"
            value={note}
            onChange={handleNote} // onChange for note
            rows="4"
          />
        </div>

        <form action="" >
          <div className="button-div">
            <button className="button-light btn" type="button" onClick={resetForm}>
              Delete
            </button>
            <button
              className={`${submit ? 'button-grey' : 'button-blue'}`}
              type="submit"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormPage;
