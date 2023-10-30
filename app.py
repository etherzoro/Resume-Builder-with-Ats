from flask import Flask, request, render_template, redirect, url_for, flash
import os
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a secure secret key

template_folder_path = r'C:\Users\darpa\Downloads\resume-builder\src\templates'
app = Flask(__name__, template_folder=template_folder_path)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        job_description = request.files['job_description']
        uploaded_resumes = request.files.getlist('resumes')

        if not job_description or not uploaded_resumes:
            flash('Please upload both a job description and one or more resumes.')
            return redirect(url_for('index'))

        job_description_text = read_file(job_description)
        similarities = []

        for resume in uploaded_resumes:
            resume_text = read_file(resume)
            content = [job_description_text, resume_text]
            matrix = CountVectorizer().fit_transform(content)
            similarity_matrix = cosine_similarity(matrix)
            similarity = round(similarity_matrix[0][1] * 100, 2)
            similarities.append((resume.filename, similarity))

        return render_template('results.html', job_description=job_description.filename, similarities=similarities)

    return render_template('index.html')

def read_file(file):
    if file.filename.endswith(('.docx', '.pdf', '.txt')):
        return file.read().decode('utf-8', 'ignore')
    elif file.filename.endswith(('.jpg', '.jpeg', '.png')):
        # Binary files (e.g., images) don't need decoding
        return file.read()
    else:
        flash(f'Unsupported file format: {file.filename}')
        return ''

if __name__ == '__main__':
    app.run(debug=True)
