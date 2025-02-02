import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const BudgetingTool = () => {
  const [status, setStatus] = useState('Press the button and speak');
  const [searchStatus, setSearchStatus] = useState('Press the button and speak your query');
  const [chatHistory, setChatHistory] = useState([]);
  const [contributionChart, setContributionChart] = useState('');
  const [dueChart, setDueChart] = useState('');
  const [categoryChart, setCategoryChart] = useState('');
  const [totalExpenditure, setTotalExpenditure] = useState('0');
  const [searchResults, setSearchResults] = useState([]);

  const mediaRecorderRef = useRef(null);
  const searchMediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const searchAudioChunksRef = useRef([]);

  const handleRecording = async (isSearch = false) => {
    const recorderRef = isSearch ? searchMediaRecorderRef : mediaRecorderRef;
    const audioChunks = isSearch ? searchAudioChunksRef : audioChunksRef;
    const setStatus = isSearch ? setSearchStatus : setStatus;

    if (!recorderRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new MediaRecorder(stream);

      recorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      recorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        audioChunks.current = [];

        const formData = new FormData();
        formData.append('audio', audioBlob);

        setStatus(isSearch ? 'Uploading query...' : 'Uploading audio...');

        try {
          const endpoint = isSearch ? '/search' : '/upload_audio';
          const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();

          if (isSearch) {
            setSearchResults(data.results || []);
            setSearchStatus('Search complete');
          } else {
            setChatHistory(data.chat_history || []);
            setContributionChart(`data:image/png;base64,${data.contribution_chart}`);
            setDueChart(`data:image/png;base64,${data.due_chart}`);
            setCategoryChart(`data:image/png;base64,${data.category_chart}`);
            setTotalExpenditure(`₹${data.total_expenditure}`);
            setStatus(data.message);
          }
        } catch (error) {
          setStatus(isSearch ? 'Error uploading query.' : 'Error uploading audio.');
          console.error('Error:', error);
        }
      };
    }

    const recorder = recorderRef.current;
    if (recorder.state === 'inactive') {
      recorder.start();
      setStatus(isSearch ? 'Recording...' : 'Recording...');
    } else {
      recorder.stop();
      setStatus(isSearch ? 'Processing query...' : 'Processing audio...');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Trip Budgeting App</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Individual Contribution Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={contributionChart} alt="Individual Contribution Chart" />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Due Amounts Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={dueChart} alt="Due Amounts Chart" />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Expense Category Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={categoryChart} alt="Expense Category Chart" />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Chat History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {chatHistory.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Total Expenditure</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{totalExpenditure}</p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Voice Input</CardTitle>
        </CardHeader>
        <CardContent>
          <button 
            onClick={() => handleRecording(false)} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            🎤 Record
          </button>
          <p className="text-gray-500 mt-2">{status}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Chat History</CardTitle>
        </CardHeader>
        <CardContent>
          <button 
            onClick={() => handleRecording(true)} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            🎤 Search by Voice
          </button>
          <p className="text-gray-500 mt-2">{searchStatus}</p>
          
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Search Results</h3>
              <ul>
                {searchResults.map((entry, index) => (
                  <li key={index}>{entry}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetingTool;