import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'; // You can use a UI library like Reactstrap for styling.
import axios from 'axios'; // You'll need Axios to make API requests to your Python backend.

const ATSForm = () => {
    // State to store user-selected files
    const [jobDescription, setJobDescription] = useState<File | null>(null);
    const [resumes, setResumes] = useState<FileList | null>(null);
  
    // State to store similarity results
    const [similarities, setSimilarities] = useState<number[] | null>(null);
  
    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!jobDescription || !resumes || resumes.length === 0) {
        alert('Please select job description and at least one resume.');
        return;
      }
  
      // Create a FormData object to send files to your Python backend
      const formData = new FormData();
      formData.append('job_description', jobDescription);
      for (let i = 0; i < resumes.length; i++) {
        formData.append('resumes', resumes[i]);
      }
  
      try {
        // Make a POST request to your Python ATS backend
        const response = await axios.post('/api/ats', formData);
        setSimilarities(response.data); // Assuming the response is an array of similarities.
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <div>
        <h1>Applicant Tracking System (ATS)</h1>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <FormGroup>
            <Label for="job_description">Upload Job Description:</Label>
            <Input
              type="file"
              name="job_description"
              id="job_description"
              accept=".docx, .pdf, .txt"
              onChange={(e) => setJobDescription(e.target.files?.[0])}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="resumes">Upload Resumes (Multiple Files):</Label>
            <Input
              type="file"
              name="resumes"
              id="resumes"
              accept=".docx, .pdf, .txt, .jpg, .jpeg, .png"
              multiple
              onChange={(e) => setResumes(e.target.files)}
              required
            />
          </FormGroup>
          <Button type="submit">Submit</Button>
        </Form>
  
        {similarities && (
          <div>
            <h2>Similarity Results:</h2>
            <ul>
              {similarities.map((similarity, index) => (
                <li key={index}>Similarity {index + 1}: {similarity}%</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  export default ATSForm;
  