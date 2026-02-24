import React, { useState } from 'react';

export default function FeedbackForm({ projectId }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we would send data to backend
        console.log(`Feedback for Project ${projectId}:`, { rating, comment });
        setSubmitted(true);
    };

    if (submitted) return <p style={{ color: 'green' }}>Thank you for your feedback!</p>;

    return (
        <div style={{ marginTop: 20, pading: 15, border: '1px dashed #ccc' }}>
            <h4>Rate this Project</h4>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 10 }}>
                    <label>Difficulty: </label>
                    <select onChange={(e) => setRating(e.target.value)}>
                        <option value="5">Very Easy (5)</option>
                        <option value="4">Easy (4)</option>
                        <option value="3">Medium (3)</option>
                        <option value="2">Hard (2)</option>
                        <option value="1">Very Hard (1)</option>
                    </select>
                </div>
                <textarea
                    placeholder="Any comments?"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    style={{ width: '100%', marginBottom: 10 }}
                />
                <button type="submit">Submit Feedback</button>
            </form>
        </div>
    );
}
